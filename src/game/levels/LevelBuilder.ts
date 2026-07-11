// ============================================================
// Cyber Heist 2077 — Level Builder
// Converts level data into Phaser tilemaps and game objects
// ============================================================

import Phaser from 'phaser';
import { LevelConfig, LevelObjectConfig } from '../../types';
import { TILE_SIZE, COLORS } from '../../constants';
import { SecurityCamera } from '../entities/SecurityCamera';

const TILE_TEXTURE_MAP: Record<number, string> = {
  0: 'tile_floor',
  1: 'tile_wall',
  2: 'tile_door_locked',
  3: 'tile_door_unlocked',
  4: 'tile_terminal',
  5: 'tile_camera',
  6: 'tile_laser_emitter',
  7: 'tile_vault',
  8: 'tile_exit',
  9: 'tile_spawn',
  10: 'tile_vent',
  11: 'tile_decoration',
};

const WALL_TILES = new Set([1, 2, 6]);
const INTERACTABLE_TILES = new Set([3, 4, 7, 8]);

export class LevelBuilder {
  private scene: Phaser.Scene;
  private config: LevelConfig;

  constructor(scene: Phaser.Scene, config: LevelConfig) {
    this.scene = scene;
    this.config = config;
  }

  build(
    walls: Phaser.Physics.Arcade.StaticGroup,
    interactables: Phaser.Physics.Arcade.StaticGroup,
    items: Phaser.Physics.Arcade.Group,
    cameras: SecurityCamera[]
  ): void {
    this.buildTiles(walls, interactables, cameras);
    this.buildObjects(interactables, items);
    this.buildEnvironmentEffects();
  }

  private buildTiles(
    walls: Phaser.Physics.Arcade.StaticGroup,
    interactables: Phaser.Physics.Arcade.StaticGroup,
    cameras: SecurityCamera[]
  ): void {
    const { tiles, width, height } = this.config;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileId = tiles[y]?.[x] ?? 0;
        const px = x * TILE_SIZE + TILE_SIZE / 2;
        const py = y * TILE_SIZE + TILE_SIZE / 2;

        // Always place floor underneath
        if (tileId !== 1) {
          const floorTex = (x + y) % 2 === 0 ? 'tile_floor' : 'tile_floor_alt';
          this.scene.add.sprite(px, py, floorTex).setDepth(0);
        }

        const texture = TILE_TEXTURE_MAP[tileId] ?? 'tile_floor';

        if (WALL_TILES.has(tileId)) {
          // Wall or wall-like tiles
          const wall = walls.create(px, py, texture) as Phaser.Physics.Arcade.Sprite;
          wall.setDepth(10);
          wall.refreshBody();
        } else if (INTERACTABLE_TILES.has(tileId)) {
          // Interactable tiles
          const obj = interactables.create(px, py, texture) as Phaser.Physics.Arcade.Sprite;
          obj.setDepth(10);

          if (tileId === 3) {
            // Door unlocked
            obj.setData('interactable', true);
            obj.setData('interactType', 'door');
            obj.setData('locked', false);
          } else if (tileId === 4) {
            // Terminal
            obj.setData('interactable', true);
            obj.setData('interactType', 'terminal');
            obj.setData('difficulty', 1);
          } else if (tileId === 7) {
            // Vault
            obj.setData('interactable', true);
            obj.setData('interactType', 'vault');
          } else if (tileId === 8) {
            // Exit
            obj.setData('interactable', true);
            obj.setData('interactType', 'exit');

            // Add pulsing glow to exit
            this.scene.tweens.add({
              targets: obj,
              alpha: { from: 0.7, to: 1 },
              duration: 800,
              yoyo: true,
              repeat: -1,
            });
          }
        } else if (tileId === 5) {
          // Security Camera
          const cam = new SecurityCamera(this.scene, px, py);
          cameras.push(cam);
        } else if (tileId !== 0 && tileId !== 9) {
          // Decorative tiles
          this.scene.add.sprite(px, py, texture).setDepth(1);
        }
      }
    }
  }

  private buildObjects(
    interactables: Phaser.Physics.Arcade.StaticGroup,
    items: Phaser.Physics.Arcade.Group
  ): void {
    for (const obj of this.config.objects) {
      const px = obj.x * TILE_SIZE + TILE_SIZE / 2;
      const py = obj.y * TILE_SIZE + TILE_SIZE / 2;

      switch (obj.type) {
        case 'terminal': {
          // Override tile terminal with proper difficulty
          const terminal = interactables.create(px, py, 'tile_terminal') as Phaser.Physics.Arcade.Sprite;
          terminal.setDepth(10);
          terminal.setData('interactable', true);
          terminal.setData('interactType', 'terminal');
          terminal.setData('difficulty', obj.properties?.difficulty ?? 1);
          terminal.setData('objectId', obj.id);

          // Glow effect
          this.scene.tweens.add({
            targets: terminal,
            alpha: { from: 0.8, to: 1 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
          });
          break;
        }
        case 'keycard': {
          const item = items.create(px, py, 'item_keycard') as Phaser.Physics.Arcade.Sprite;
          item.setDepth(50);
          item.setData('itemConfig', { id: obj.id, type: 'keycard' });
          (item.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

          // Floating animation
          this.scene.tweens.add({
            targets: item,
            y: py - 4,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
          break;
        }
        case 'aiCore': {
          const item = items.create(px, py, 'item_aicore') as Phaser.Physics.Arcade.Sprite;
          item.setDepth(50);
          item.setData('itemConfig', { id: obj.id, type: 'aiCore' });
          (item.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

          this.scene.tweens.add({
            targets: item,
            y: py - 5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });

          // Rotation glow
          this.scene.tweens.add({
            targets: item,
            angle: 360,
            duration: 4000,
            repeat: -1,
          });
          break;
        }
        case 'healthPack': {
          const item = items.create(px, py, 'item_healthpack') as Phaser.Physics.Arcade.Sprite;
          item.setDepth(50);
          item.setData('itemConfig', { id: obj.id, type: 'healthPack' });
          (item.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

          this.scene.tweens.add({
            targets: item,
            y: py - 3,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
          break;
        }
        case 'energyCell': {
          const item = items.create(px, py, 'item_energycell') as Phaser.Physics.Arcade.Sprite;
          item.setDepth(50);
          item.setData('itemConfig', { id: obj.id, type: 'energyCell' });
          (item.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

          this.scene.tweens.add({
            targets: item,
            y: py - 3,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
          break;
        }
        case 'emp': {
          const item = items.create(px, py, 'item_emp') as Phaser.Physics.Arcade.Sprite;
          item.setDepth(50);
          item.setData('itemConfig', { id: obj.id, type: 'emp' });
          (item.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

          this.scene.tweens.add({
            targets: item,
            y: py - 3,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
          break;
        }
        case 'door': {
          const door = interactables.create(px, py, 'tile_door_locked') as Phaser.Physics.Arcade.Sprite;
          door.setDepth(10);
          door.setData('interactable', true);
          door.setData('interactType', 'door');
          door.setData('locked', obj.properties?.locked ?? true);
          door.setData('objectId', obj.id);
          break;
        }
      }
    }
  }

  private buildEnvironmentEffects(): void {
    // Add subtle grid overlay for cyberpunk feel
    const gfx = this.scene.add.graphics();
    gfx.setDepth(2);
    gfx.setAlpha(0.03);

    const worldWidth = this.config.width * TILE_SIZE;
    const worldHeight = this.config.height * TILE_SIZE;

    // Horizontal grid lines
    gfx.lineStyle(1, COLORS.CYAN, 1);
    for (let y = 0; y < worldHeight; y += TILE_SIZE * 4) {
      gfx.lineBetween(0, y, worldWidth, y);
    }
    // Vertical grid lines
    for (let x = 0; x < worldWidth; x += TILE_SIZE * 4) {
      gfx.lineBetween(x, 0, x, worldHeight);
    }
  }
}
