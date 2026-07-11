// ============================================================
// Cyber Heist 2077 — Main Game Scene
// Hosts the player, level, enemies, and all gameplay systems
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, TILE_SIZE, CAMERA } from '../../constants';
import eventBus from '../EventBus';
import { Player } from '../entities/Player';
import { LevelBuilder } from '../levels/LevelBuilder';
import { LEVEL_CONFIGS } from '../levels/LevelData';
import { LevelConfig, GuardConfig, DroneConfig, MissionObjective, PlayerUpgrades } from '../../types';
import { Guard } from '../entities/Guard';
import { Drone } from '../entities/Drone';
import { SecurityCamera } from '../entities/SecurityCamera';
import { audioService } from '../../services/AudioService';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private levelBuilder!: LevelBuilder;
  private currentLevel: number = 0;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private interactables!: Phaser.Physics.Arcade.StaticGroup;
  private items!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private isPaused: boolean = false;
  private missionTimer: number = 0;
  private missionTimeLimit: number = 0;
  private missionActive: boolean = false;
  private ambientParticles: Phaser.GameObjects.Graphics | null = null;
  private floatingParticles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number; size: number }> = [];
  private enemyEntities: (Guard | Drone)[] = [];
  private cameraEntities: SecurityCamera[] = [];
  
  private activeTerminal: Phaser.GameObjects.Sprite | null = null;
  private hasKeycard: boolean = false;
  private collectedObjectives: number = 0;
  private totalObjectives: number = 0;
  private currentObjectives: MissionObjective[] = [];

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { missionId?: number }): void {
    this.currentLevel = data.missionId ?? 0;
    this.isPaused = false;
    this.missionActive = false;
    this.missionTimer = 0;
    this.floatingParticles = [];
  }

  create(data: { missionId: number; upgrades?: PlayerUpgrades }): void {
    // Clean up any previous run
    this.children.removeAll(true);
    this.enemyEntities.forEach(e => e.destroy());
    this.enemyEntities = [];
    this.activeTerminal = null;
    this.hasKeycard = false;
    this.collectedObjectives = 0;

    // Setup groups
    this.walls = this.physics.add.staticGroup();
    this.interactables = this.physics.add.staticGroup();
    this.items = this.physics.add.group();
    this.enemies = this.physics.add.group();

    // Build level
    const levelConfig = LEVEL_CONFIGS[this.currentLevel];
    if (!levelConfig) {
      console.error(`Level ${this.currentLevel} not found`);
      eventBus.emit('game:screenChanged', { screen: 'mainMenu' });
      return;
    }

    this.cameraEntities = [];

    this.levelBuilder = new LevelBuilder(this, levelConfig);
    this.levelBuilder.build(this.walls, this.interactables, this.items, this.cameraEntities);

    // Instantiate Enemies
    if (levelConfig.enemies) {
      for (const enemyConfig of levelConfig.enemies) {
        if ('visionRange' in enemyConfig) {
          // Guard
          const waypoints = enemyConfig.patrolRoute.map(
            (p) => new Phaser.Math.Vector2(p.x * TILE_SIZE + TILE_SIZE / 2, p.y * TILE_SIZE + TILE_SIZE / 2)
          );
          const guard = new Guard(this, waypoints[0].x, waypoints[0].y, waypoints);
          this.enemyEntities.push(guard);
          this.enemies.add(guard.sprite);
        } else if ('scanRange' in enemyConfig) {
          // Drone
          const startX = enemyConfig.patrolRoute[0].x * TILE_SIZE + TILE_SIZE / 2;
          const startY = enemyConfig.patrolRoute[0].y * TILE_SIZE + TILE_SIZE / 2;
          const isHorizontal = enemyConfig.patrolRoute[1]?.x !== enemyConfig.patrolRoute[0].x;
          const drone = new Drone(this, startX, startY, isHorizontal);
          this.enemyEntities.push(drone);
          this.enemies.add(drone.sprite);
        }
      }
    }

    // Create player at spawn
    const spawnX = levelConfig.playerSpawn.x * TILE_SIZE + TILE_SIZE / 2;
    const spawnY = levelConfig.playerSpawn.y * TILE_SIZE + TILE_SIZE / 2;
    this.player = new Player(this, spawnX, spawnY, data.upgrades);

    // Setup physics collisions
    this.physics.add.collider(this.player.sprite, this.walls);

    // Item overlap
    this.physics.add.overlap(this.player.sprite, this.items, (_player, item) => {
      this.handleItemPickup(item as Phaser.Physics.Arcade.Sprite);
    });

    // Setup camera
    const worldWidth = levelConfig.width * TILE_SIZE;
    const worldHeight = levelConfig.height * TILE_SIZE;

    const viewportW = this.scale.width / CAMERA.ZOOM;
    const viewportH = this.scale.height / CAMERA.ZOOM;

    const bx = worldWidth < viewportW ? -(viewportW - worldWidth) / 2 : 0;
    const by = worldHeight < viewportH ? -(viewportH - worldHeight) / 2 : 0;
    const bw = Math.max(worldWidth, viewportW);
    const bh = Math.max(worldHeight, viewportH);

    this.cameras.main.setBounds(bx, by, bw, bh);
    this.cameras.main.startFollow(this.player.sprite, true, CAMERA.LERP, CAMERA.LERP);
    this.cameras.main.setZoom(CAMERA.ZOOM);
    this.cameras.main.setDeadzone(CAMERA.DEADZONE_WIDTH, CAMERA.DEADZONE_HEIGHT);
    this.cameras.main.setBackgroundColor('#0a0a0f');

    // World bounds
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // Create ambient particle layer
    this.createAmbientParticles();

    // Setup event listeners
    this.setupEventListeners();

    // Start mission
    this.startMission(levelConfig);

    // Fade in
    this.cameras.main.fadeIn(500, 10, 10, 15);

    // Emit initial state
    eventBus.emit('game:screenChanged', { screen: 'playing' });
    eventBus.emit('player:healthChanged', {
      health: this.player.health,
      maxHealth: this.player.maxHealth,
    });
    eventBus.emit('player:energyChanged', {
      energy: this.player.energy,
      maxEnergy: this.player.maxEnergy,
    });
  }

  private createAmbientParticles(): void {
    const worldWidth = LEVEL_CONFIGS[this.currentLevel].width * TILE_SIZE;
    const worldHeight = LEVEL_CONFIGS[this.currentLevel].height * TILE_SIZE;

    for (let i = 0; i < 30; i++) {
      this.floatingParticles.push({
        x: Math.random() * worldWidth,
        y: Math.random() * worldHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.15 + 0.05,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    this.ambientParticles = this.add.graphics();
    this.ambientParticles.setDepth(1000);
  }

  private startMission(levelConfig: LevelConfig): void {
    this.missionTimeLimit = levelConfig.id < 5
      ? [180, 240, 300, 360, 420][levelConfig.id]
      : 300;
    this.missionTimer = this.missionTimeLimit;
    this.missionActive = true;

    // Emit objectives
    const objectives: MissionObjective[] = LEVEL_CONFIGS[this.currentLevel]?.objects
      .filter(o => o.type === 'aiCore' || o.type === 'terminal')
      .map((o, i) => ({
        id: o.id,
        description: o.type === 'aiCore' ? 'Retrieve the AI Core' : `Hack Terminal ${i + 1}`,
        type: (o.type === 'aiCore' ? 'collect' : 'hack') as 'collect' | 'hack',
        targetId: o.id,
        isCompleted: false,
        isOptional: false,
      })) ?? [];

    // Add escape objective
    objectives.push({
      id: 'escape',
      description: 'Escape to the exit',
      type: 'escape',
      targetId: 'exit',
      isCompleted: false,
      isOptional: false,
    });

    this.totalObjectives = objectives.length - 1; // excluding escape
    this.currentObjectives = objectives;

    eventBus.emit('mission:objectiveUpdated', { objectives });
  }

  private setupEventListeners(): void {
    eventBus.on('ui:pauseGame', () => {
      this.isPaused = true;
      this.physics.pause();
    });

    eventBus.on('ui:resumeGame', () => {
      this.isPaused = false;
      this.physics.resume();
    });

    eventBus.on('ui:restartMission', () => {
      this.cleanup();
      this.scene.restart({ missionId: this.currentLevel });
    });

    eventBus.on('ui:quitToMenu', () => {
      this.cleanup();
      this.scene.stop();
      eventBus.emit('game:screenChanged', { screen: 'mainMenu' });
    });

    eventBus.on('ui:startMission', (data) => {
      this.cleanup();
      this.scene.restart({ missionId: data.missionId, upgrades: data.upgrades });
    });

    eventBus.on('hacking:complete', (data: { success: boolean }) => {
      if (data.success && this.activeTerminal) {
        this.activeTerminal.setTexture('tile_terminal');
        this.activeTerminal.setTint(COLORS.GREEN); // visual feedback
        this.activeTerminal.setData('interactable', false);
        this.completeObjective(this.activeTerminal.getData('objectId'));
      }
      this.activeTerminal = null;
      this.isPaused = false;
      this.physics.resume();
    });
  }

  private cleanup(): void {
    eventBus.off('ui:pauseGame', () => {});
    eventBus.off('ui:resumeGame', () => {});
    eventBus.off('ui:restartMission', () => {});
    eventBus.off('ui:quitToMenu', () => {});
    eventBus.off('ui:startMission', () => {});
    eventBus.off('hacking:complete', () => {});

    for (const cam of this.cameraEntities) {
      cam.destroy();
    }
    this.cameraEntities = [];
  }

  private handleItemPickup(itemSprite: Phaser.Physics.Arcade.Sprite): void {
    const itemData = itemSprite.getData('itemConfig');
    if (!itemData) return;

    itemSprite.destroy();

    // Flash effect
    this.cameras.main.flash(100, 0, 240, 255, false, (_cam: Phaser.Cameras.Scene2D.Camera, progress: number) => {
      if (progress === 1) {
        // done
      }
    });

    eventBus.emit('inventory:changed', {
      items: [{
        id: itemData.id,
        type: itemData.type,
        name: itemData.type === 'aiCore' ? 'AI Core' : itemData.type,
        description: '',
        quantity: 1,
      }],
    });

    if (itemData.type === 'aiCore') {
      this.completeObjective(itemData.id);
    } else if (itemData.type === 'keycard') {
      this.hasKeycard = true;
    }
  }

  public completeObjective(id: string): void {
    const obj = this.currentObjectives.find(o => o.targetId === id);
    if (obj && !obj.isCompleted) {
      obj.isCompleted = true;
      this.collectedObjectives++;
      eventBus.emit('mission:objectiveUpdated', { objectives: this.currentObjectives });
      
      // If all mandatory objectives are complete, unlock the exit
      if (this.collectedObjectives >= this.totalObjectives) {
        eventBus.emit('mission:objectiveCompleted', { objectiveId: 'escape' });
        // The escape objective isn't mandatory for the count, but it's now active
      }
    }
  }

  public startHacking(terminal: Phaser.GameObjects.Sprite): void {
    this.activeTerminal = terminal;
    this.isPaused = true;
    this.physics.pause();
    
    const difficulty = terminal.getData('difficulty') ?? 1;
    this.scene.launch('HackingScene', {
      config: {
        type: ['nodeConnection', 'memorySequence', 'patternMatch'][Math.floor(Math.random() * 3)],
        difficulty,
      },
    });
  }

  public openDoor(door: Phaser.GameObjects.Sprite): void {
    const isLocked = door.getData('locked');
    if (isLocked && !this.hasKeycard) {
      this.cameras.main.flash(100, 255, 51, 68);
    } else {
      door.setTexture('tile_door_open');
      door.setData('interactable', false);
      const body = door.body as Phaser.Physics.Arcade.Body;
      if (body) body.enable = false;
    }
  }

  public attemptExit(): void {
    if (this.collectedObjectives >= this.totalObjectives) {
      eventBus.emit('mission:completed', {
        missionId: this.currentLevel,
        completed: true,
        timeTaken: this.missionTimeLimit - this.missionTimer,
        score: 1000 + (this.missionTimer * 10),
        stealthRating: 100,
        objectivesCompleted: this.collectedObjectives,
        totalObjectives: this.totalObjectives,
        creditsEarned: 500,
        bonusCredits: Math.floor(this.missionTimer * 5),
      });
      this.missionActive = false;
    } else {
      this.cameras.main.flash(100, 255, 51, 68); // Objectives incomplete
    }
  }

  update(time: number, delta: number): void {
    if (this.isPaused) return;

    // Update player
    this.player.update(delta);

    // Update mission timer
    if (this.missionActive) {
      this.missionTimer -= delta / 1000;
      eventBus.emit('mission:timerUpdate', { timeRemaining: Math.max(0, this.missionTimer) });

      if (this.missionTimer <= 30 && this.missionTimer > 0) {
        // Play alarm every second
        if (Math.floor(this.missionTimer * 10) % 10 === 0) {
          audioService.playAlarm();
        }
      }

      if (this.missionTimer <= 0) {
        this.missionActive = false;
        eventBus.emit('mission:failed', { reason: 'Time expired! Lockdown initiated.' });
      }
    }

    // Update enemies
    for (const enemy of this.enemyEntities) {
      enemy.update(delta, this.player, this.walls);
    }

    for (const cam of this.cameraEntities) {
      cam.update(delta, this.player, this.walls);
    }

    // Update ambient particles
    if (this.ambientParticles) {
      this.ambientParticles.clear();
      for (const p of this.floatingParticles) {
        p.x += p.vx;
        p.y += p.vy;
        const camBounds = this.cameras.main.worldView;
        if (p.x < camBounds.x - 50) p.x = camBounds.right + 50;
        if (p.x > camBounds.right + 50) p.x = camBounds.x - 50;
        if (p.y < camBounds.y - 50) p.y = camBounds.bottom + 50;
        if (p.y > camBounds.bottom + 50) p.y = camBounds.y - 50;

        this.ambientParticles.fillStyle(COLORS.CYAN, p.alpha);
        this.ambientParticles.fillCircle(p.x, p.y, p.size);
      }
    }

    // Emit player position for minimap
    if (this.player.sprite.active) {
      eventBus.emit('player:positionChanged', {
        x: this.player.sprite.x,
        y: this.player.sprite.y,
      });
    }

    // FPS counter
    eventBus.emit('game:fpsUpdate', { fps: Math.round(this.game.loop.actualFps) });
  }
}
