// ============================================================
// Cyber Heist 2077 — Guard Entity
// Patrolling enemy with vision cone detection
// ============================================================

import Phaser from 'phaser';
import { GUARD, TILE_SIZE, COLORS } from '../../constants';
import { Player } from './Player';
import eventBus from '../EventBus';

export class Guard {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private waypoints: Phaser.Math.Vector2[];
  private currentWaypointIndex: number = 0;
  private state: 'patrol' | 'alert' | 'investigate' = 'patrol';
  private visionCone: Phaser.GameObjects.Graphics;
  private facing: Phaser.Math.Vector2;
  private speed: number = GUARD.SPEED;
  private patrolWaitTimer: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, waypoints: Phaser.Math.Vector2[] = []) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'enemy_guard');
    this.sprite.setDepth(20);
    this.sprite.setData('type', 'guard');

    // Default to a small horizontal patrol if no waypoints provided
    this.waypoints = waypoints.length > 0 ? waypoints : [
      new Phaser.Math.Vector2(x - TILE_SIZE * 2, y),
      new Phaser.Math.Vector2(x + TILE_SIZE * 2, y)
    ];

    this.visionCone = scene.add.graphics();
    this.visionCone.setDepth(15);
    this.facing = new Phaser.Math.Vector2(1, 0);

    // Initial movement
    this.moveToNextWaypoint();
  }

  private moveToNextWaypoint(): void {
    if (this.waypoints.length === 0) return;
    const target = this.waypoints[this.currentWaypointIndex];
    this.scene.physics.moveToObject(this.sprite, target, this.speed);

    // Calculate facing direction
    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, target.x, target.y);
    this.facing.setTo(Math.cos(angle), Math.sin(angle));
    this.sprite.setRotation(angle);
  }

  public update(delta: number, player: Player, walls: Phaser.Physics.Arcade.StaticGroup): void {
    if (this.state === 'patrol') {
      this.updatePatrol(delta);
    }
    
    this.updateVisionCone();
    this.checkPlayerDetection(player, walls);
  }

  private updatePatrol(delta: number): void {
    if (this.waypoints.length === 0) return;

    if (this.patrolWaitTimer > 0) {
      this.patrolWaitTimer -= delta;
      if (this.patrolWaitTimer <= 0) {
        this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.waypoints.length;
        this.moveToNextWaypoint();
      }
      return;
    }

    const target = this.waypoints[this.currentWaypointIndex];
    const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, target.x, target.y);

    if (dist < 4) {
      this.sprite.body!.stop();
      this.patrolWaitTimer = 1500; // 1.5 seconds wait
    }
  }

  private updateVisionCone(): void {
    this.visionCone.clear();

    const range = GUARD.VISION_RANGE;
    const angleBase = this.sprite.rotation;
    const angleSpread = Phaser.Math.DegToRad(GUARD.VISION_ANGLE * 2); // Convert to radians, full angle

    // Draw vision cone
    this.visionCone.fillStyle(
      this.state === 'alert' ? COLORS.RED : COLORS.YELLOW, 
      this.state === 'alert' ? 0.3 : 0.15
    );

    this.visionCone.beginPath();
    this.visionCone.moveTo(this.sprite.x, this.sprite.y);
    
    // Draw arc for the cone
    this.visionCone.arc(
      this.sprite.x,
      this.sprite.y,
      range,
      angleBase - angleSpread / 2,
      angleBase + angleSpread / 2,
      false
    );
    this.visionCone.closePath();
    this.visionCone.fillPath();

    // Outline
    this.visionCone.lineStyle(1, this.state === 'alert' ? COLORS.RED : COLORS.YELLOW, 0.4);
    this.visionCone.strokePath();
  }

  private checkPlayerDetection(player: Player, walls: Phaser.Physics.Arcade.StaticGroup): void {
    if (!player.sprite.active) return;

    const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y);

    // Stealth modifier
    let currentVisionRange = GUARD.VISION_RANGE;
    if (player.isStealthed) {
      currentVisionRange *= 0.3; // 70% reduced detection range in stealth
    }

    if (dist > currentVisionRange) {
      if (this.state === 'alert') this.state = 'patrol';
      return;
    }

    // Check angle
    const angleToPlayer = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y);
    const angleDiff = Phaser.Math.Angle.Wrap(angleToPlayer - this.sprite.rotation);

    if (Math.abs(angleDiff) > Phaser.Math.DegToRad(GUARD.VISION_ANGLE)) {
      if (this.state === 'alert') this.state = 'patrol';
      return;
    }

    // Raycast to check for walls blocking vision
    const line = new Phaser.Geom.Line(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y);
    let isBlocked = false;

    // Simple AABB overlap check for the raycast against walls
    const wallsChildren = walls.getChildren() as Phaser.Physics.Arcade.Sprite[];
    for (const wall of wallsChildren) {
      if (Phaser.Geom.Intersects.LineToRectangle(line, wall.getBounds())) {
        isBlocked = true;
        break;
      }
    }

    if (!isBlocked) {
      // Detected!
      this.state = 'alert';
      
      // If player is really close, trigger game over immediately
      if (dist < TILE_SIZE * 1.5) {
        eventBus.emit('mission:failed', { reason: 'Detected by Guard Security!' });
      } else {
        // Just chase the player if they are in the cone
        this.sprite.setRotation(angleToPlayer);
        this.scene.physics.moveToObject(this.sprite, player.sprite, this.speed * 1.5);
      }
    } else {
      if (this.state === 'alert') this.state = 'patrol';
    }
  }

  public destroy(): void {
    this.visionCone.destroy();
    this.sprite.destroy();
  }
}
