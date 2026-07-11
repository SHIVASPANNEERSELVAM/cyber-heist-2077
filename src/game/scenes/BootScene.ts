// ============================================================
// Cyber Heist 2077 — Boot Scene
// Generates all procedural assets before the preload screen
// ============================================================

import Phaser from 'phaser';
import { COLORS, TILE_SIZE, PLAYER, GUARD, DRONE, BOSS } from '../../constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    this.generatePlayerSprites();
    this.generateGuardSprites();
    this.generateDroneSprites();
    this.generateBossSprites();
    this.generateTileSprites();
    this.generateItemSprites();
    this.generateEffectSprites();
    this.generateUISprites();
    this.scene.start('PreloadScene');
  }

  // ---- Player Sprites ----
  private generatePlayerSprites(): void {
    const size = PLAYER.SIZE;

    // Player idle
    this.generateSprite('player_idle', size, size, (g) => {
      // Body
      g.fillStyle(COLORS.PLAYER, 1);
      g.fillRoundedRect(4, 2, size - 8, size - 4, 3);
      // Visor
      g.fillStyle(COLORS.WHITE, 1);
      g.fillRect(7, 5, size - 14, 4);
      // Core glow
      g.fillStyle(COLORS.CYAN, 0.6);
      g.fillCircle(size / 2, size / 2 + 2, 3);
    });

    // Player stealth
    this.generateSprite('player_stealth', size, size, (g) => {
      g.fillStyle(COLORS.PLAYER_STEALTH, 0.6);
      g.fillRoundedRect(4, 2, size - 8, size - 4, 3);
      g.fillStyle(COLORS.CYAN_DIM, 0.4);
      g.fillRect(7, 5, size - 14, 4);
      g.fillStyle(COLORS.CYAN, 0.3);
      g.fillCircle(size / 2, size / 2 + 2, 3);
    });

    // Player dash
    this.generateSprite('player_dash', size + 8, size, (g) => {
      // Trail
      g.fillStyle(COLORS.CYAN, 0.2);
      g.fillRoundedRect(0, 2, size - 4, size - 4, 3);
      g.fillStyle(COLORS.CYAN, 0.4);
      g.fillRoundedRect(4, 2, size - 4, size - 4, 3);
      // Body
      g.fillStyle(COLORS.PLAYER, 1);
      g.fillRoundedRect(12, 2, size - 8, size - 4, 3);
      g.fillStyle(COLORS.WHITE, 1);
      g.fillRect(15, 5, size - 14, 4);
    });

    // Player dead
    this.generateSprite('player_dead', size, size, (g) => {
      g.fillStyle(COLORS.RED_DIM, 0.5);
      g.fillRoundedRect(4, 2, size - 8, size - 4, 3);
      g.fillStyle(COLORS.RED, 0.3);
      g.fillRect(7, 5, size - 14, 4);
      // X eyes
      g.lineStyle(2, COLORS.RED, 0.8);
      g.lineBetween(8, 5, 12, 9);
      g.lineBetween(12, 5, 8, 9);
      g.lineBetween(size - 12, 5, size - 8, 9);
      g.lineBetween(size - 8, 5, size - 12, 9);
    });

    // Directional indicator
    this.generateSprite('player_direction', 8, 8, (g) => {
      g.fillStyle(COLORS.CYAN, 0.8);
      g.fillTriangle(4, 0, 8, 8, 0, 8);
    });
  }

  // ---- Guard Sprites ----
  private generateGuardSprites(): void {
    const size = GUARD.SIZE;

    // Guard patrol
    this.generateSprite('guard_patrol', size, size, (g) => {
      g.fillStyle(COLORS.GUARD, 1);
      g.fillRoundedRect(3, 2, size - 6, size - 4, 4);
      // Helmet
      g.fillStyle(COLORS.RED_DIM, 1);
      g.fillRect(5, 2, size - 10, 6);
      // Visor
      g.fillStyle(COLORS.ORANGE, 0.9);
      g.fillRect(6, 4, size - 12, 3);
    });

    // Guard alert
    this.generateSprite('guard_alert', size, size, (g) => {
      g.fillStyle(COLORS.GUARD_ALERT, 1);
      g.fillRoundedRect(3, 2, size - 6, size - 4, 4);
      g.fillStyle(COLORS.RED, 1);
      g.fillRect(5, 2, size - 10, 6);
      g.fillStyle(COLORS.YELLOW, 1);
      g.fillRect(6, 4, size - 12, 3);
      // Exclamation
      g.fillStyle(COLORS.YELLOW, 1);
      g.fillRect(size / 2 - 1, -6, 3, 6);
      g.fillRect(size / 2 - 1, -9, 3, 2);
    });

    // Guard dead
    this.generateSprite('guard_dead', size, size, (g) => {
      g.fillStyle(COLORS.RED_DIM, 0.4);
      g.fillRoundedRect(3, 2, size - 6, size - 4, 4);
    });

    // Vision cone texture
    this.generateSprite('vision_cone', GUARD.VISION_RANGE * 2, GUARD.VISION_RANGE * 2, (g) => {
      g.fillStyle(COLORS.RED, 0.08);
      g.slice(
        GUARD.VISION_RANGE,
        GUARD.VISION_RANGE,
        GUARD.VISION_RANGE,
        Phaser.Math.DegToRad(-GUARD.VISION_ANGLE),
        Phaser.Math.DegToRad(GUARD.VISION_ANGLE),
        false
      );
      g.fillPath();
      g.lineStyle(1, COLORS.RED, 0.15);
      g.strokePath();
    });
  }

  // ---- Drone Sprites ----
  private generateDroneSprites(): void {
    const size = DRONE.SIZE;

    // Drone normal
    this.generateSprite('drone_normal', size, size, (g) => {
      // Body - hexagonal shape
      g.fillStyle(COLORS.DRONE, 1);
      g.fillCircle(size / 2, size / 2, size / 2 - 2);
      // Inner ring
      g.lineStyle(1, COLORS.PURPLE, 0.8);
      g.strokeCircle(size / 2, size / 2, size / 3);
      // Eye
      g.fillStyle(COLORS.MAGENTA, 1);
      g.fillCircle(size / 2, size / 2, 3);
    });

    // Drone scanning
    this.generateSprite('drone_scan', size, size, (g) => {
      g.fillStyle(COLORS.DRONE_SCAN, 1);
      g.fillCircle(size / 2, size / 2, size / 2 - 2);
      g.lineStyle(2, COLORS.MAGENTA, 1);
      g.strokeCircle(size / 2, size / 2, size / 3);
      g.fillStyle(COLORS.RED, 1);
      g.fillCircle(size / 2, size / 2, 3);
    });

    // Drone stunned
    this.generateSprite('drone_stunned', size, size, (g) => {
      g.fillStyle(COLORS.YELLOW, 0.3);
      g.fillCircle(size / 2, size / 2, size / 2 - 2);
      g.lineStyle(1, COLORS.YELLOW, 0.5);
      g.strokeCircle(size / 2, size / 2, size / 3);
      // Sparks
      g.lineStyle(1, COLORS.YELLOW, 0.8);
      g.lineBetween(2, 2, 6, 6);
      g.lineBetween(size - 2, 2, size - 6, 6);
      g.lineBetween(2, size - 2, 6, size - 6);
      g.lineBetween(size - 2, size - 2, size - 6, size - 6);
    });
  }

  // ---- Boss Sprites ----
  private generateBossSprites(): void {
    const size = BOSS.SIZE;

    // Boss phase 1
    this.generateSprite('boss_phase1', size, size, (g) => {
      // Main body
      g.fillStyle(COLORS.BOSS, 1);
      g.fillRoundedRect(4, 4, size - 8, size - 8, 6);
      // Armor plates
      g.lineStyle(2, COLORS.RED_DIM, 1);
      g.strokeRoundedRect(6, 6, size - 12, size - 12, 5);
      // Eyes
      g.fillStyle(COLORS.YELLOW, 1);
      g.fillRect(14, 12, 6, 4);
      g.fillRect(size - 20, 12, 6, 4);
      // Weak point (hidden)
      g.fillStyle(COLORS.RED_DIM, 0.3);
      g.fillCircle(size / 2, size / 2 + 4, 5);
    });

    // Boss phase 2
    this.generateSprite('boss_phase2', size, size, (g) => {
      g.fillStyle(COLORS.BOSS, 1);
      g.fillRoundedRect(4, 4, size - 8, size - 8, 6);
      g.lineStyle(2, COLORS.ORANGE, 1);
      g.strokeRoundedRect(6, 6, size - 12, size - 12, 5);
      g.fillStyle(COLORS.ORANGE, 1);
      g.fillRect(14, 12, 6, 4);
      g.fillRect(size - 20, 12, 6, 4);
      // Cracked armor
      g.lineStyle(1, COLORS.YELLOW, 0.5);
      g.lineBetween(10, 20, 20, 30);
      g.lineBetween(size - 10, 22, size - 18, 32);
    });

    // Boss phase 3
    this.generateSprite('boss_phase3', size, size, (g) => {
      g.fillStyle(COLORS.BOSS, 1);
      g.fillRoundedRect(4, 4, size - 8, size - 8, 6);
      g.lineStyle(2, COLORS.YELLOW, 1);
      g.strokeRoundedRect(6, 6, size - 12, size - 12, 5);
      g.fillStyle(COLORS.RED, 1);
      g.fillRect(14, 12, 6, 4);
      g.fillRect(size - 20, 12, 6, 4);
      // Exposed weak point
      g.fillStyle(COLORS.BOSS_WEAK, 0.9);
      g.fillCircle(size / 2, size / 2 + 4, 6);
      g.lineStyle(1, COLORS.YELLOW, 1);
      g.strokeCircle(size / 2, size / 2 + 4, 6);
      // Heavy damage
      g.lineStyle(1, COLORS.YELLOW, 0.7);
      g.lineBetween(8, 15, 18, 28);
      g.lineBetween(size - 8, 18, size - 16, 30);
      g.lineBetween(12, size - 12, 22, size - 18);
    });

    // Boss weak point
    this.generateSprite('boss_weakpoint', 16, 16, (g) => {
      g.fillStyle(COLORS.BOSS_WEAK, 0.8);
      g.fillCircle(8, 8, 7);
      g.lineStyle(1, COLORS.YELLOW, 1);
      g.strokeCircle(8, 8, 7);
      g.fillStyle(COLORS.YELLOW, 1);
      g.fillCircle(8, 8, 3);
    });
  }

  // ---- Tile Sprites ----
  private generateTileSprites(): void {
    const ts = TILE_SIZE;

    // Player stealth
    this.generateSprite('player_stealth', ts, ts, (g) => {
      g.fillStyle(COLORS.CYAN, 0.2);
      g.fillRect(4, 4, ts - 8, ts - 8);
      g.lineStyle(1, COLORS.CYAN, 0.4);
      g.strokeRect(4, 4, ts - 8, ts - 8);
    });

    // Enemy Guard
    this.generateSprite('enemy_guard', ts, ts, (g) => {
      g.fillStyle(COLORS.RED, 1);
      g.fillRect(4, 4, ts - 8, ts - 8);
      g.lineStyle(2, COLORS.YELLOW, 1);
      g.strokeRect(4, 4, ts - 8, ts - 8);
      // Eye/Visor
      g.fillStyle(COLORS.YELLOW, 1);
      g.fillRect(ts - 6, 8, 4, ts - 16);
    });

    // Enemy Drone
    this.generateSprite('enemy_drone', ts, ts, (g) => {
      g.fillStyle(COLORS.MAGENTA, 1);
      g.fillCircle(ts / 2, ts / 2, ts / 2 - 4);
      g.lineStyle(2, COLORS.WHITE, 0.8);
      g.strokeCircle(ts / 2, ts / 2, ts / 2 - 4);
      // Red core
      g.fillStyle(COLORS.RED, 1);
      g.fillCircle(ts / 2, ts / 2, 3);
    });

    // Floor
    this.generateSprite('tile_floor', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR, 1);
      g.fillRect(0, 0, ts, ts);
      g.lineStyle(1, COLORS.CYAN, 0.03);
      g.strokeRect(0, 0, ts, ts);
    });

    // Floor alt (checker pattern)
    this.generateSprite('tile_floor_alt', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR_ALT, 1);
      g.fillRect(0, 0, ts, ts);
      g.lineStyle(1, COLORS.CYAN, 0.04);
      g.strokeRect(0, 0, ts, ts);
    });

    // Wall
    this.generateSprite('tile_wall', ts, ts, (g) => {
      g.fillStyle(COLORS.WALL, 1);
      g.fillRect(0, 0, ts, ts);
      g.fillStyle(COLORS.WALL_HIGHLIGHT, 1);
      g.fillRect(0, 0, ts, 3);
      g.lineStyle(1, COLORS.CYAN, 0.08);
      g.strokeRect(0, 0, ts, ts);
    });

    // Door locked
    this.generateSprite('tile_door_locked', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR, 1);
      g.fillRect(0, 0, ts, ts);
      g.fillStyle(COLORS.DOOR_LOCKED, 0.6);
      g.fillRect(4, 0, ts - 8, ts);
      g.lineStyle(2, COLORS.RED, 0.8);
      g.strokeRect(4, 0, ts - 8, ts);
      // Lock icon
      g.fillStyle(COLORS.RED, 1);
      g.fillRect(ts / 2 - 3, ts / 2 - 3, 6, 6);
    });

    // Door unlocked
    this.generateSprite('tile_door_unlocked', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR, 1);
      g.fillRect(0, 0, ts, ts);
      g.fillStyle(COLORS.DOOR_UNLOCKED, 0.4);
      g.fillRect(4, 0, ts - 8, ts);
      g.lineStyle(2, COLORS.GREEN, 0.8);
      g.strokeRect(4, 0, ts - 8, ts);
    });

    // Door open
    this.generateSprite('tile_door_open', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR, 1);
      g.fillRect(0, 0, ts, ts);
      g.fillStyle(COLORS.DOOR_OPEN, 0.15);
      g.fillRect(0, 0, ts, ts);
    });

    // Terminal
    this.generateSprite('tile_terminal', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR, 1);
      g.fillRect(0, 0, ts, ts);
      // Screen
      g.fillStyle(COLORS.TERMINAL, 0.15);
      g.fillRect(4, 4, ts - 8, ts - 8);
      g.lineStyle(1, COLORS.GREEN, 0.6);
      g.strokeRect(4, 4, ts - 8, ts - 8);
      // Screen lines
      g.lineStyle(1, COLORS.GREEN, 0.3);
      g.lineBetween(6, 10, ts - 6, 10);
      g.lineBetween(6, 14, ts - 10, 14);
      g.lineBetween(6, 18, ts - 8, 18);
    });

    // Security camera
    this.generateSprite('tile_camera', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR, 1);
      g.fillRect(0, 0, ts, ts);
      g.fillStyle(COLORS.RED, 0.8);
      g.fillCircle(ts / 2, ts / 2, 5);
      g.lineStyle(1, COLORS.RED, 0.4);
      g.strokeCircle(ts / 2, ts / 2, 8);
    });

    // Laser emitter
    this.generateSprite('tile_laser_emitter', ts, ts, (g) => {
      g.fillStyle(COLORS.WALL, 1);
      g.fillRect(0, 0, ts, ts);
      g.fillStyle(COLORS.LASER, 0.8);
      g.fillCircle(ts / 2, ts / 2, 4);
      g.lineStyle(2, COLORS.RED, 0.6);
      g.strokeCircle(ts / 2, ts / 2, 6);
    });

    // Vault
    this.generateSprite('tile_vault', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR, 1);
      g.fillRect(0, 0, ts, ts);
      g.fillStyle(COLORS.YELLOW, 0.15);
      g.fillRect(2, 2, ts - 4, ts - 4);
      g.lineStyle(2, COLORS.YELLOW, 0.6);
      g.strokeRect(2, 2, ts - 4, ts - 4);
      g.fillStyle(COLORS.YELLOW, 0.8);
      g.fillCircle(ts / 2, ts / 2, 4);
    });

    // Exit
    this.generateSprite('tile_exit', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR, 1);
      g.fillRect(0, 0, ts, ts);
      g.fillStyle(COLORS.EXIT, 0.2);
      g.fillRect(0, 0, ts, ts);
      g.lineStyle(2, COLORS.CYAN, 0.6);
      g.strokeRect(2, 2, ts - 4, ts - 4);
      // Arrow
      g.fillStyle(COLORS.CYAN, 0.8);
      g.fillTriangle(ts / 2, 6, ts - 6, ts / 2, ts / 2, ts - 6);
    });

    // Spawn
    this.generateSprite('tile_spawn', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR, 1);
      g.fillRect(0, 0, ts, ts);
      g.fillStyle(COLORS.CYAN, 0.1);
      g.fillCircle(ts / 2, ts / 2, ts / 3);
    });

    // Vent
    this.generateSprite('tile_vent', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR_ALT, 1);
      g.fillRect(0, 0, ts, ts);
      g.lineStyle(1, COLORS.WHITE_DIM, 0.3);
      for (let i = 4; i < ts; i += 6) {
        g.lineBetween(i, 2, i, ts - 2);
      }
    });

    // Decoration
    this.generateSprite('tile_decoration', ts, ts, (g) => {
      g.fillStyle(COLORS.FLOOR, 1);
      g.fillRect(0, 0, ts, ts);
      g.lineStyle(1, COLORS.CYAN, 0.06);
      g.lineBetween(0, ts / 2, ts, ts / 2);
      g.lineBetween(ts / 2, 0, ts / 2, ts);
    });
  }

  // ---- Item Sprites ----
  private generateItemSprites(): void {
    const size = 16;

    // Keycard
    this.generateSprite('item_keycard', size, size, (g) => {
      g.fillStyle(COLORS.KEYCARD, 0.9);
      g.fillRoundedRect(1, 3, size - 2, size - 6, 2);
      g.fillStyle(COLORS.YELLOW, 1);
      g.fillRect(3, 6, 4, 3);
      g.lineStyle(1, COLORS.YELLOW, 0.5);
      g.lineBetween(9, 7, size - 3, 7);
    });

    // AI Core
    this.generateSprite('item_aicore', size, size, (g) => {
      g.fillStyle(COLORS.AI_CORE, 0.9);
      g.fillCircle(size / 2, size / 2, size / 2 - 2);
      g.lineStyle(1, COLORS.CYAN, 1);
      g.strokeCircle(size / 2, size / 2, size / 2 - 2);
      g.fillStyle(COLORS.WHITE, 0.9);
      g.fillCircle(size / 2, size / 2, 2);
    });

    // Health pack
    this.generateSprite('item_healthpack', size, size, (g) => {
      g.fillStyle(COLORS.HEALTH_PACK, 0.8);
      g.fillRoundedRect(2, 2, size - 4, size - 4, 2);
      g.fillStyle(COLORS.WHITE, 1);
      g.fillRect(size / 2 - 1, 4, 2, size - 8);
      g.fillRect(4, size / 2 - 1, size - 8, 2);
    });

    // Energy cell
    this.generateSprite('item_energycell', size, size, (g) => {
      g.fillStyle(COLORS.ENERGY_CELL, 0.8);
      g.fillRoundedRect(3, 1, size - 6, size - 2, 2);
      g.fillStyle(COLORS.PURPLE, 1);
      g.fillRect(5, 3, size - 10, 3);
      g.lineStyle(1, COLORS.PURPLE, 0.6);
      g.lineBetween(size / 2, 0, size / 2, 1);
    });

    // EMP device
    this.generateSprite('item_emp', size, size, (g) => {
      g.fillStyle(COLORS.EMP_DEVICE, 0.8);
      g.fillCircle(size / 2, size / 2, size / 2 - 2);
      g.lineStyle(1, COLORS.YELLOW, 0.8);
      // Lightning bolt
      g.lineBetween(size / 2 - 2, 3, size / 2 + 1, size / 2 - 1);
      g.lineBetween(size / 2 + 1, size / 2 - 1, size / 2 - 1, size / 2 + 1);
      g.lineBetween(size / 2 - 1, size / 2 + 1, size / 2 + 2, size - 3);
    });
  }

  // ---- Effect Sprites ----
  private generateEffectSprites(): void {
    // Particle
    this.generateSprite('particle', 4, 4, (g) => {
      g.fillStyle(0xffffff, 1);
      g.fillCircle(2, 2, 2);
    });

    // Spark
    this.generateSprite('spark', 6, 6, (g) => {
      g.fillStyle(COLORS.YELLOW, 1);
      g.fillRect(2, 0, 2, 6);
      g.fillRect(0, 2, 6, 2);
    });

    // Laser beam segment
    this.generateSprite('laser_beam', TILE_SIZE, 4, (g) => {
      g.fillStyle(COLORS.LASER, 0.6);
      g.fillRect(0, 0, TILE_SIZE, 4);
      g.fillStyle(COLORS.RED, 1);
      g.fillRect(0, 1, TILE_SIZE, 2);
    });

    // Scan beam (for drones)
    this.generateSprite('scan_beam', 4, DRONE.SCAN_RANGE, (g) => {
      g.fillStyle(COLORS.MAGENTA, 0.4);
      g.fillRect(0, 0, 4, DRONE.SCAN_RANGE);
      g.fillStyle(COLORS.MAGENTA, 0.8);
      g.fillRect(1, 0, 2, DRONE.SCAN_RANGE);
    });

    // EMP blast ring
    this.generateSprite('emp_blast', 64, 64, (g) => {
      g.lineStyle(3, COLORS.YELLOW, 0.6);
      g.strokeCircle(32, 32, 28);
      g.lineStyle(1, COLORS.YELLOW, 0.3);
      g.strokeCircle(32, 32, 20);
    });

    // Explosion
    this.generateSprite('explosion', 32, 32, (g) => {
      g.fillStyle(COLORS.ORANGE, 0.8);
      g.fillCircle(16, 16, 14);
      g.fillStyle(COLORS.YELLOW, 0.6);
      g.fillCircle(16, 16, 8);
      g.fillStyle(COLORS.WHITE, 0.4);
      g.fillCircle(16, 16, 3);
    });
  }

  // ---- UI Sprites ----
  private generateUISprites(): void {
    // Interaction prompt
    this.generateSprite('interact_prompt', 24, 24, (g) => {
      g.fillStyle(COLORS.CYAN, 0.2);
      g.fillRoundedRect(0, 0, 24, 24, 4);
      g.lineStyle(1, COLORS.CYAN, 0.6);
      g.strokeRoundedRect(0, 0, 24, 24, 4);
      // E key
      g.fillStyle(COLORS.CYAN, 1);
      g.fillRect(7, 6, 10, 2);
      g.fillRect(7, 6, 2, 12);
      g.fillRect(7, 11, 8, 2);
      g.fillRect(7, 16, 10, 2);
    });

    // Minimap player dot
    this.generateSprite('minimap_player', 6, 6, (g) => {
      g.fillStyle(COLORS.CYAN, 1);
      g.fillCircle(3, 3, 3);
    });

    // Minimap enemy dot
    this.generateSprite('minimap_enemy', 4, 4, (g) => {
      g.fillStyle(COLORS.RED, 1);
      g.fillCircle(2, 2, 2);
    });

    // Minimap objective dot
    this.generateSprite('minimap_objective', 5, 5, (g) => {
      g.fillStyle(COLORS.YELLOW, 1);
      g.fillRect(0, 0, 5, 5);
    });
  }

  // ---- Helper ----
  private generateSprite(
    key: string,
    width: number,
    height: number,
    draw: (graphics: Phaser.GameObjects.Graphics) => void
  ): void {
    const graphics = this.add.graphics();
    draw(graphics);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }
}
