import Phaser from 'phaser';
import { TILE_SIZE, COLORS } from '../../constants';
import { Player } from './Player';
import eventBus from '../EventBus';

export class SecurityCamera {
  public sprite: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;
  private visionCone: Phaser.GameObjects.Graphics;
  private rotationSpeed: number = 0.001;
  private currentAngle: number = 0;
  private state: 'patrol' | 'alert' | 'disabled' = 'patrol';

  // Constants
  private VISION_RANGE: number = TILE_SIZE * 4;
  private VISION_ANGLE: number = 45; // Degrees of the cone width

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    
    // Draw the camera base/body
    this.sprite = scene.physics.add.sprite(x, y, 'tile_camera');
    this.sprite.setDepth(20);
    this.sprite.setData('interactable', true);
    this.sprite.setData('interactType', 'camera');
    this.sprite.setData('cameraObj', this);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.visionCone = scene.add.graphics();
    this.visionCone.setDepth(15);
    
    // Initialize starting angle
    this.currentAngle = Math.random() * Math.PI * 2; 
  }

  public disableCamera(): void {
    if (this.state === 'disabled') return;
    this.state = 'disabled';
    this.visionCone.clear();
    this.sprite.setTint(0x555555);
    this.sprite.setData('interactable', false);
  }

  public update(delta: number, player: Player, walls: Phaser.Physics.Arcade.StaticGroup): void {
    if (this.state === 'disabled') return;

    if (this.state === 'patrol') {
      // Rotate continuously 360 degrees
      this.currentAngle += this.rotationSpeed * delta;
      if (this.currentAngle > Math.PI * 2) {
        this.currentAngle -= Math.PI * 2;
      }
    }

    this.updateVisionCone();
    this.checkPlayerDetection(player, walls);
  }

  private updateVisionCone(): void {
    this.visionCone.clear();

    const range = this.VISION_RANGE;
    const angleSpread = Phaser.Math.DegToRad(this.VISION_ANGLE);

    this.visionCone.fillStyle(
      this.state === 'alert' ? COLORS.RED : COLORS.RED_DIM, 
      this.state === 'alert' ? 0.4 : 0.15
    );

    this.visionCone.beginPath();
    this.visionCone.moveTo(this.sprite.x, this.sprite.y);
    
    this.visionCone.arc(
      this.sprite.x,
      this.sprite.y,
      range,
      this.currentAngle - angleSpread / 2,
      this.currentAngle + angleSpread / 2,
      false
    );
    this.visionCone.closePath();
    this.visionCone.fillPath();

    this.visionCone.lineStyle(1, this.state === 'alert' ? COLORS.RED : COLORS.RED_DIM, 0.4);
    this.visionCone.strokePath();
  }

  private checkPlayerDetection(player: Player, walls: Phaser.Physics.Arcade.StaticGroup): void {
    if (!player.sprite.active) return;

    const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y);

    let currentVisionRange = this.VISION_RANGE;
    if (player.isStealthed) {
      currentVisionRange *= 0.3;
    }

    if (dist > currentVisionRange) {
      if (this.state === 'alert') this.state = 'patrol';
      return;
    }

    const angleToPlayer = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y);
    const angleDiff = Phaser.Math.Angle.Wrap(angleToPlayer - this.currentAngle);

    if (Math.abs(angleDiff) > Phaser.Math.DegToRad(this.VISION_ANGLE / 2)) {
      if (this.state === 'alert') this.state = 'patrol';
      return;
    }

    const line = new Phaser.Geom.Line(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y);
    let isBlocked = false;

    const wallsChildren = walls.getChildren() as Phaser.Physics.Arcade.Sprite[];
    for (const wall of wallsChildren) {
      if (Phaser.Geom.Intersects.LineToRectangle(line, wall.getBounds())) {
        isBlocked = true;
        break;
      }
    }

    if (!isBlocked) {
      this.state = 'alert';
      eventBus.emit('mission:failed', { reason: 'Detected by Security Camera!' });
    } else {
      if (this.state === 'alert') this.state = 'patrol';
    }
  }

  public destroy(): void {
    this.sprite.destroy();
    this.visionCone.destroy();
  }
}
