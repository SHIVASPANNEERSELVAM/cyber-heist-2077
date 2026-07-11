// ============================================================
// Cyber Heist 2077 — Drone Entity
// Sweeping security drone with rotating laser scanner
// ============================================================

import Phaser from 'phaser';
import { DRONE, COLORS, TILE_SIZE } from '../../constants';
import { Player } from './Player';
import eventBus from '../EventBus';

export class Drone {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private scanBeam: Phaser.GameObjects.Sprite;
  private state: 'sweep' | 'lock' = 'sweep';
  private startX: number;
  private startY: number;
  private sweepAngle: number = 0;
  private isHorizontal: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, isHorizontal: boolean = true) {
    this.scene = scene;
    this.startX = x;
    this.startY = y;
    this.isHorizontal = isHorizontal;

    this.sprite = scene.physics.add.sprite(x, y, 'enemy_drone');
    this.sprite.setDepth(20);
    this.sprite.setData('type', 'drone');
    this.sprite.setData('interactable', true);
    this.sprite.setData('interactType', 'drone');
    this.sprite.setData('droneObj', this);
    
    // Add hovering tween
    scene.tweens.add({
      targets: this.sprite,
      y: y - 4,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Scanner beam sprite (generated in BootScene)
    this.scanBeam = scene.add.sprite(x, y, 'scan_beam');
    this.scanBeam.setOrigin(0.5, 0); // Origin at top center
    this.scanBeam.setDepth(15);
    this.scanBeam.setAlpha(0.6);

    // Initial movement
    this.startSweep();
  }

  public disableDrone(): void {
    if (this.state === 'disabled' as any) return;
    this.state = 'disabled' as any;
    this.scanBeam.clearTint();
    this.scanBeam.setAlpha(0);
    this.sprite.setTint(0x555555);
    this.sprite.setData('interactable', false);
    this.scene.tweens.killTweensOf(this.sprite);
    
    // Fall to ground effect
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y + 10,
      duration: 500,
      ease: 'Bounce.easeOut'
    });
  }

  private startSweep(): void {
    if (this.isHorizontal) {
      this.scene.tweens.add({
        targets: this.sprite,
        x: this.startX + TILE_SIZE * 3,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else {
      this.scene.tweens.add({
        targets: this.sprite,
        y: this.startY + TILE_SIZE * 3,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  public update(delta: number, player: Player, walls: Phaser.Physics.Arcade.StaticGroup): void {
    if (this.state === 'disabled' as any) return;

    // Sync beam to drone position
    this.scanBeam.setPosition(this.sprite.x, this.sprite.y);

    if (this.state === 'sweep') {
      // Rotate scanner back and forth
      this.sweepAngle += delta * 0.001 * DRONE.SCAN_SPEED;
      const angleOffset = Math.sin(this.sweepAngle) * 0.8; // ~45 degree sweep
      this.scanBeam.setRotation(this.isHorizontal ? Math.PI / 2 + angleOffset : angleOffset);
    }

    this.checkPlayerDetection(player, walls);
  }

  private checkPlayerDetection(player: Player, walls: Phaser.Physics.Arcade.StaticGroup): void {
    if (!player.sprite.active) return;

    // The scan beam is a thin line. We check if player is within the beam's rectangular bounds mathematically.
    const beamAngle = this.scanBeam.rotation;
    
    const dx = player.sprite.x - this.sprite.x;
    const dy = player.sprite.y - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Stealth modifier
    let currentScanRange = DRONE.SCAN_RANGE;
    if (player.isStealthed) {
      currentScanRange *= 0.5; // 50% reduced detection range in stealth
    }

    if (dist > currentScanRange) {
      this.scanBeam.setTint(COLORS.MAGENTA);
      this.state = 'sweep';
      return;
    }

    const angleToPlayer = Math.atan2(dy, dx);
    const angleDiff = Phaser.Math.Angle.Wrap(angleToPlayer - beamAngle + Math.PI / 2);

    // The beam is narrow (e.g. 10 degrees)
    const beamWidthRadians = 0.15; 
    
    if (Math.abs(angleDiff) < beamWidthRadians) {
      // Raycast to check for walls blocking the laser
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
        // Detected!
        this.scanBeam.setTint(COLORS.RED);
        this.state = 'lock';
        eventBus.emit('mission:failed', { reason: 'Scanned by Security Drone!' });
      }
    } else {
      this.scanBeam.setTint(COLORS.MAGENTA);
      this.state = 'sweep';
    }
  }

  public destroy(): void {
    this.scanBeam.destroy();
    this.sprite.destroy();
  }
}
