// ============================================================
// Cyber Heist 2077 — Core Type Definitions
// ============================================================

// ---- Game State ----

export type GameScreen =
  | 'loading'
  | 'mainMenu'
  | 'missionSelect'
  | 'briefing'
  | 'playing'
  | 'paused'
  | 'hacking'
  | 'gameOver'
  | 'victory'
  | 'upgradeShop'
  | 'settings'
  | 'credits';

export interface GameState {
  currentScreen: GameScreen;
  currentMission: number;
  isPaused: boolean;
  isHacking: boolean;
}

// ---- Player ----

export interface PlayerState {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  isStealthMode: boolean;
  isDashing: boolean;
  isInvulnerable: boolean;
  isDead: boolean;
  position: { x: number; y: number };
}

export interface PlayerUpgrades {
  moveSpeed: number;       // 0-5 upgrade level
  dashDistance: number;     // 0-5
  stealthDuration: number; // 0-5
  maxHealth: number;       // 0-5
  maxEnergy: number;       // 0-5
  hackSpeed: number;       // 0-5
  energyRegen: number;     // 0-5
}

// ---- Inventory ----

export type ItemType = 'keycard' | 'emp' | 'healthPack' | 'energyCell' | 'aiCore';

export interface InventoryItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  quantity: number;
}

// ---- Mission ----

export type MissionStatus = 'locked' | 'unlocked' | 'completed';

export interface MissionObjective {
  id: string;
  description: string;
  type: 'hack' | 'collect' | 'escape';
  targetId: string;
  isCompleted: boolean;
  isOptional: boolean;
}

export interface MissionData {
  id: number;
  name: string;
  description: string;
  briefing: string;
  difficulty: number;
  timeLimit: number; // seconds
  objectives: MissionObjective[];
  rewards: {
    credits: number;
    stealthBonus: number;
    speedBonus: number;
  };
}

export interface MissionResult {
  missionId: number;
  completed: boolean;
  timeTaken: number;
  score: number;
  stealthRating: number; // 0-100
  objectivesCompleted: number;
  totalObjectives: number;
  creditsEarned: number;
  bonusCredits: number;
}

// ---- Enemies ----

export type EnemyState = 'patrol' | 'alert' | 'search' | 'chase' | 'attack' | 'returning' | 'stunned' | 'dead';

export interface GuardConfig {
  id: string;
  patrolRoute: Array<{ x: number; y: number }>;
  visionRange: number;
  visionAngle: number;
  moveSpeed: number;
  alertDuration: number;
  searchDuration: number;
}

export interface DroneConfig {
  id: string;
  patrolRoute: Array<{ x: number; y: number }>;
  scanRange: number;
  scanSpeed: number;
  laserDamage: number;
  empVulnerable: boolean;
}

export type BossPhase = 1 | 2 | 3;

export interface BossConfig {
  id: string;
  maxHealth: number;
  phases: Array<{
    phase: BossPhase;
    healthThreshold: number;
    attackPattern: string[];
    weakPointExposed: boolean;
    speed: number;
  }>;
}

// ---- Level ----

export type TileType =
  | 'floor'
  | 'wall'
  | 'door_locked'
  | 'door_unlocked'
  | 'door_open'
  | 'terminal'
  | 'camera'
  | 'laser_emitter'
  | 'laser_beam'
  | 'vault'
  | 'exit'
  | 'spawn'
  | 'vent'
  | 'decoration';

export interface LevelTile {
  type: TileType;
  x: number;
  y: number;
  properties?: Record<string, unknown>;
}

export interface LevelConfig {
  id: number;
  name: string;
  width: number;
  height: number;
  tileSize: number;
  tiles: number[][];
  objects: LevelObjectConfig[];
  enemies: Array<GuardConfig | DroneConfig>;
  playerSpawn: { x: number; y: number };
  exitPoint: { x: number; y: number };
}

export interface LevelObjectConfig {
  id: string;
  type: 'terminal' | 'camera' | 'laser' | 'keycard' | 'healthPack' | 'energyCell' | 'aiCore' | 'emp' | 'door';
  x: number;
  y: number;
  properties?: Record<string, unknown>;
}

// ---- Hacking ----

export type HackingPuzzleType = 'nodeConnection' | 'memorySequence' | 'patternMatch';

export interface HackingPuzzleConfig {
  type: HackingPuzzleType;
  difficulty: number; // 1-5
  timeLimit: number;  // seconds
  onSuccess: string;  // event to emit
  onFailure: string;  // event to emit
}

// ---- Save Data ----

export interface SaveData {
  version: number;
  missions: Record<number, {
    status: MissionStatus;
    bestTime: number | null;
    highScore: number | null;
    bestStealthRating: number | null;
  }>;
  upgrades: PlayerUpgrades;
  credits: number;
  settings: GameSettings;
  timestamp: number;
}

// ---- Settings ----

export interface GameSettings {
  masterVolume: number;  // 0-1
  musicVolume: number;   // 0-1
  sfxVolume: number;     // 0-1
  isMuted: boolean;
  graphicsQuality: 'low' | 'medium' | 'high';
  showFPS: boolean;
  screenShake: boolean;
}

// ---- Events ----

export interface GameEvents {
  // Phaser → React
  'player:healthChanged': { health: number; maxHealth: number };
  'player:energyChanged': { energy: number; maxEnergy: number };
  'player:stealthChanged': { isStealthMode: boolean };
  'player:died': undefined;
  'player:positionChanged': { x: number; y: number };
  'mission:objectiveCompleted': { objectiveId: string };
  'mission:objectiveUpdated': { objectives: MissionObjective[] };
  'mission:timerUpdate': { timeRemaining: number };
  'mission:completed': MissionResult;
  'mission:failed': { reason: string };
  'inventory:changed': { items: InventoryItem[] };
  'hacking:start': HackingPuzzleConfig;
  'hacking:complete': { success: boolean };
  'enemy:alert': { enemyId: string; state: EnemyState };
  'game:screenChanged': { screen: GameScreen };
  'game:fpsUpdate': { fps: number };

  // React → Phaser
  'ui:pauseGame': undefined;
  'ui:resumeGame': undefined;
  'ui:restartMission': undefined;
  'ui:quitToMenu': undefined;
  'ui:startMission': { missionId: number; upgrades?: PlayerUpgrades };
  'ui:hackingResult': { success: boolean };
  'ui:settingsChanged': GameSettings;
  'ui:useItem': { itemId: string };
}
