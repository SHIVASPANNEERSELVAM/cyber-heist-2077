// ============================================================
// Cyber Heist 2077 — Player Entity
// Handles movement, dash, stealth, health, energy, interaction
// ============================================================

import Phaser from 'phaser';
import { PLAYER, COLORS, INPUT_KEYS, UPGRADE_EFFECTS } from '../../constants';
import { PlayerUpgrades } from '../../types';
import eventBus from '../EventBus';
import { audioService } from '../../services/AudioService';

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public health: number;
  public maxHealth: number;
  public energy: number;
  public maxEnergy: number;

  private scene: Phaser.Scene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private dashKey!: Phaser.Input.Keyboard.Key;
  private stealthKey!: Phaser.Input.Keyboard.Key;
  private interactKey!: Phaser.Input.Keyboard.Key;

  private isStealthMode: boolean = false;
  private isDashing: boolean = false;
  private isInvulnerable: boolean = false;
  private isDead: boolean = false;
  private canDash: boolean = true;

  private dashTimer: number = 0;
  private dashCooldownTimer: number = 0;
  private invulnTimer: number = 0;

  private velocityX: number = 0;
  private velocityY: number = 0;

  private directionIndicator: Phaser.GameObjects.Sprite | null = null;
  private glowGraphics: Phaser.GameObjects.Graphics;
  private lastFacing: number = 0; // radians
  private currentSpeed: number;
  private currentDashSpeed: number;
  private currentStealthDrain: number;
  private currentEnergyRegen: number;

  constructor(scene: Phaser.Scene, x: number, y: number, upgrades?: PlayerUpgrades) {
    this.scene = scene;
    
    // Apply upgrades
    const hpBonus = upgrades ? UPGRADE_EFFECTS.maxHealth[upgrades.maxHealth] : 0;
    const epBonus = upgrades ? UPGRADE_EFFECTS.maxEnergy[upgrades.maxEnergy] : 0;
    
    this.maxHealth = PLAYER.MAX_HEALTH + hpBonus;
    this.health = this.maxHealth;
    this.maxEnergy = PLAYER.MAX_ENERGY + (PLAYER.MAX_ENERGY * (epBonus / 100));
    this.energy = this.maxEnergy;

    const speedBonus = upgrades ? UPGRADE_EFFECTS.moveSpeed[upgrades.moveSpeed] : 0;
    this.currentSpeed = PLAYER.SPEED * (1 + speedBonus / 100);

    const dashBonus = upgrades ? UPGRADE_EFFECTS.dashDistance[upgrades.dashDistance] : 0;
    this.currentDashSpeed = PLAYER.DASH_SPEED * (1 + dashBonus / 100);

    const stealthBonus = upgrades ? UPGRADE_EFFECTS.stealthDuration[upgrades.stealthDuration] : 0;
    this.currentStealthDrain = PLAYER.STEALTH_ENERGY_DRAIN * (1 - stealthBonus / 100);

    const regenBonus = upgrades ? UPGRADE_EFFECTS.energyRegen[upgrades.energyRegen] : 0;
    this.currentEnergyRegen = PLAYER.ENERGY_REGEN * (1 + regenBonus / 100);

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'player_idle');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(100);
    this.sprite.setSize(PLAYER.SIZE - 4, PLAYER.SIZE - 4);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setMaxVelocity(this.currentSpeed, this.currentSpeed);

    // Direction indicator
    this.directionIndicator = scene.add.sprite(x, y, 'player_direction');
    this.directionIndicator.setDepth(99);
    this.directionIndicator.setAlpha(0.5);
    this.directionIndicator.setScale(0.8);

    // Glow effect
    this.glowGraphics = scene.add.graphics();
    this.glowGraphics.setDepth(98);

    // Setup input
    this.setupInput();
  }

  private setupInput(): void {
    const keyboard = this.scene.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.wasd = {
      W: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.dashKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.stealthKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.interactKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Stealth toggle
    this.stealthKey.on('down', () => {
      if (this.isDead) return;
      this.toggleStealth();
    });

    // Dash
    this.dashKey.on('down', () => {
      if (this.isDead || !this.canDash) return;
      this.startDash();
    });

    // Interact
    this.interactKey.on('down', () => {
      if (this.isDead) return;
      this.interact();
    });

    // Pause
    keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => {
      eventBus.emit('ui:pauseGame');
      eventBus.emit('game:screenChanged', { screen: 'paused' });
    });
  }

  update(delta: number): void {
    if (this.isDead) return;

    const dt = delta / 1000;

    // Handle dash timer
    if (this.isDashing) {
      this.dashTimer -= delta;
      if (this.dashTimer <= 0) {
        this.endDash();
      }
    }

    // Handle dash cooldown
    if (!this.canDash) {
      this.dashCooldownTimer -= delta;
      if (this.dashCooldownTimer <= 0) {
        this.canDash = true;
      }
    }

    // Handle invulnerability
    if (this.isInvulnerable) {
      this.invulnTimer -= delta;
      // Flicker effect
      this.sprite.setAlpha(Math.sin(this.invulnTimer * 0.02) > 0 ? 1 : 0.3);
      if (this.invulnTimer <= 0) {
        this.isInvulnerable = false;
        this.sprite.setAlpha(1);
      }
    }

    // Movement
    if (!this.isDashing) {
      this.handleMovement(dt);
    }

    // Stealth energy drain
    if (this.isStealthMode) {
      this.energy -= PLAYER.STEALTH_ENERGY_DRAIN * dt;
      if (this.energy <= 0) {
        this.energy = 0;
        this.toggleStealth();
      }
      eventBus.emit('player:energyChanged', { energy: this.energy, maxEnergy: this.maxEnergy });
    } else {
      // Energy regen
      if (this.energy < this.maxEnergy) {
        this.energy = Math.min(this.maxEnergy, this.energy + PLAYER.ENERGY_REGEN * dt);
        eventBus.emit('player:energyChanged', { energy: this.energy, maxEnergy: this.maxEnergy });
      }
    }

    // Update direction indicator
    this.updateDirectionIndicator();

    // Update glow effect
    this.updateGlow();

    // Update sprite texture
    this.updateSpriteTexture();
  }

  private handleMovement(dt: number): void {
    const speed = PLAYER.SPEED;
    const accel = PLAYER.ACCELERATION;
    const decel = PLAYER.DECELERATION;

    let inputX = 0;
    let inputY = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) inputX = -1;
    if (this.cursors.right.isDown || this.wasd.D.isDown) inputX = 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) inputY = -1;
    if (this.cursors.down.isDown || this.wasd.S.isDown) inputY = 1;

    // Normalize diagonal
    if (inputX !== 0 && inputY !== 0) {
      const norm = 1 / Math.SQRT2;
      inputX *= norm;
      inputY *= norm;
    }

    // Apply acceleration/deceleration
    if (inputX !== 0) {
      this.velocityX = Phaser.Math.Linear(this.velocityX, inputX * speed, accel * dt / speed);
    } else {
      this.velocityX = Phaser.Math.Linear(this.velocityX, 0, decel * dt / speed);
      if (Math.abs(this.velocityX) < 1) this.velocityX = 0;
    }

    if (inputY !== 0) {
      this.velocityY = Phaser.Math.Linear(this.velocityY, inputY * speed, accel * dt / speed);
    } else {
      this.velocityY = Phaser.Math.Linear(this.velocityY, 0, decel * dt / speed);
      if (Math.abs(this.velocityY) < 1) this.velocityY = 0;
    }

    // Stealth speed reduction
    const stealthMult = this.isStealthMode ? 0.6 : 1;
    this.sprite.setVelocity(this.velocityX * stealthMult, this.velocityY * stealthMult);

    // Update facing direction
    if (inputX !== 0 || inputY !== 0) {
      this.lastFacing = Math.atan2(inputY, inputX);
    }
  }

  private startDash(): void {
    if (this.energy < PLAYER.DASH_ENERGY_COST) return;

    this.isDashing = true;
    this.canDash = false;
    this.dashTimer = PLAYER.DASH_DURATION;
    this.dashCooldownTimer = PLAYER.DASH_COOLDOWN;
    this.energy -= PLAYER.DASH_ENERGY_COST;

    // Dash in facing direction
    const dashVx = Math.cos(this.lastFacing) * PLAYER.DASH_SPEED;
    const dashVy = Math.sin(this.lastFacing) * PLAYER.DASH_SPEED;
    this.sprite.setVelocity(dashVx, dashVy);

    // Invulnerable during dash
    this.isInvulnerable = true;
    this.invulnTimer = PLAYER.DASH_DURATION;

    audioService.playDash();
    eventBus.emit('player:energyChanged', { energy: this.energy, maxEnergy: this.maxEnergy });
  }

  private endDash(): void {
    this.isDashing = false;
    this.sprite.setTexture('player_idle');
  }

  private toggleStealth(): void {
    this.isStealthMode = !this.isStealthMode;
    eventBus.emit('player:stealthChanged', { isStealthMode: this.isStealthMode });
  }

  public get isStealthed(): boolean {
    return this.isStealthMode;
  }

  private interact(): void {
    // Find nearby interactables
    const interactables = this.scene.physics.overlapRect(
      this.sprite.x - PLAYER.INTERACT_RANGE / 2,
      this.sprite.y - PLAYER.INTERACT_RANGE / 2,
      PLAYER.INTERACT_RANGE,
      PLAYER.INTERACT_RANGE,
      true,
      true
    );

    for (const body of interactables) {
      const obj = body.gameObject;
      if (obj && obj.getData('interactable')) {
        const type = obj.getData('interactType');
        audioService.playInteract();
        if (type === 'terminal') {
          (this.scene as any).startHacking(obj);
        } else if (type === 'door') {
          (this.scene as any).openDoor(obj);
        } else if (type === 'exit') {
          (this.scene as any).attemptExit();
        } else if (type === 'camera') {
          const camObj = obj.getData('cameraObj');
          if (camObj) {
            camObj.disableCamera();
          }
        } else if (type === 'drone') {
          const droneObj = obj.getData('droneObj');
          if (droneObj) {
            droneObj.disableDrone();
          }
        }
      }
    }
  }

  public takeDamage(amount: number): void {
    if (this.isInvulnerable || this.isDead) return;

    this.health -= amount;
    this.isInvulnerable = true;
    this.invulnTimer = PLAYER.INVULN_DURATION;

    audioService.playDamage();
    eventBus.emit('player:healthChanged', { health: this.health, maxHealth: this.maxHealth });

    // Screen shake
    this.scene.cameras.main.shake(100, 0.005);

    if (this.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    this.isDead = true;
    this.health = 0;
    this.sprite.setTexture('player_dead');
    this.sprite.setVelocity(0, 0);

    eventBus.emit('player:healthChanged', { health: 0, maxHealth: this.maxHealth });
    eventBus.emit('player:died');

    // Death flash
    this.scene.cameras.main.flash(300, 255, 51, 68);

    this.scene.time.delayedCall(1500, () => {
      eventBus.emit('mission:failed', { reason: 'Agent eliminated.' });
    });
  }

  private updateDirectionIndicator(): void {
    if (!this.directionIndicator) return;
    const dist = 18;
    this.directionIndicator.setPosition(
      this.sprite.x + Math.cos(this.lastFacing) * dist,
      this.sprite.y + Math.sin(this.lastFacing) * dist
    );
    this.directionIndicator.setRotation(this.lastFacing + Math.PI / 2);
    this.directionIndicator.setAlpha(this.isStealthMode ? 0.2 : 0.5);
  }

  private updateGlow(): void {
    this.glowGraphics.clear();
    const color = this.isStealthMode ? COLORS.PLAYER_STEALTH : COLORS.PLAYER;
    const alpha = this.isStealthMode ? 0.05 : 0.1;
    this.glowGraphics.fillStyle(color, alpha);
    this.glowGraphics.fillCircle(this.sprite.x, this.sprite.y, 20);
  }

  private updateSpriteTexture(): void {
    if (this.isDead) return;

    if (this.isDashing) {
      this.sprite.setTexture('player_dash');
    } else if (this.isStealthMode) {
      this.sprite.setTexture('player_stealth');
    } else {
      this.sprite.setTexture('player_idle');
    }
  }

  public destroy(): void {
    this.sprite.destroy();
    this.directionIndicator?.destroy();
    this.glowGraphics.destroy();
  }
}
