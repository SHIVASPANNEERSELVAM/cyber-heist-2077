// ============================================================
// Cyber Heist 2077 — Game Constants
// ============================================================

// ---- Colors (used in Phaser procedural generation) ----
export const COLORS = {
  // Environment
  FLOOR: 0x111125,
  FLOOR_ALT: 0x0d0d1a,
  WALL: 0x1a1a3e,
  WALL_HIGHLIGHT: 0x2a2a5e,
  DOOR_LOCKED: 0xff3344,
  DOOR_UNLOCKED: 0x00ff66,
  DOOR_OPEN: 0x00aa44,

  // Neon accents
  CYAN: 0x00f0ff,
  CYAN_DIM: 0x00a0aa,
  MAGENTA: 0xff00aa,
  MAGENTA_DIM: 0xaa0077,
  GREEN: 0x00ff66,
  GREEN_DIM: 0x00aa44,
  RED: 0xff3344,
  RED_DIM: 0xaa2233,
  YELLOW: 0xffee00,
  ORANGE: 0xff8800,
  PURPLE: 0xaa44ff,
  WHITE: 0xe0e0ff,
  WHITE_DIM: 0x8888aa,

  // Entity-specific
  PLAYER: 0x00f0ff,
  PLAYER_STEALTH: 0x00a0aa,
  GUARD: 0xff3344,
  GUARD_ALERT: 0xff8800,
  DRONE: 0xaa44ff,
  DRONE_SCAN: 0xff00aa,
  BOSS: 0xff3344,
  BOSS_WEAK: 0xffee00,

  // Items
  KEYCARD: 0xffee00,
  AI_CORE: 0x00f0ff,
  HEALTH_PACK: 0x00ff66,
  ENERGY_CELL: 0xaa44ff,
  EMP_DEVICE: 0xff8800,

  // Effects
  LASER: 0xff3344,
  CAMERA_CONE: 0xff334433,
  VISION_CONE: 0xff334422,
  TERMINAL: 0x00ff66,
  EXIT: 0x00f0ff,
  ALARM: 0xff3344,
} as const;

// ---- Dimensions ----
export const TILE_SIZE = 32;
export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;

// ---- Player ----
export const PLAYER = {
  SIZE: 24,
  SPEED: 160,
  ACCELERATION: 800,
  DECELERATION: 600,
  DASH_SPEED: 400,
  DASH_DURATION: 200,      // ms
  DASH_COOLDOWN: 1000,     // ms
  DASH_ENERGY_COST: 20,
  STEALTH_ENERGY_DRAIN: 8, // per second
  MAX_HEALTH: 100,
  MAX_ENERGY: 100,
  ENERGY_REGEN: 5,         // per second
  INVULN_DURATION: 1000,   // ms
  INTERACT_RANGE: 48,
} as const;

// ---- Enemies ----
export const GUARD = {
  SIZE: 26,
  SPEED: 80,
  CHASE_SPEED: 140,
  VISION_RANGE: 150,
  VISION_ANGLE: 60,       // degrees, half-angle
  ALERT_DURATION: 2000,    // ms
  SEARCH_DURATION: 5000,   // ms
  ATTACK_RANGE: 32,
  ATTACK_DAMAGE: 20,
  ATTACK_COOLDOWN: 1000,   // ms
} as const;

export const DRONE = {
  SIZE: 20,
  SPEED: 60,
  SCAN_RANGE: 120,
  SCAN_SPEED: 1.5,        // radians per second
  LASER_DAMAGE: 15,
  LASER_RANGE: 200,
  LASER_COOLDOWN: 2000,   // ms
  EMP_STUN_DURATION: 5000, // ms
  HOVER_AMPLITUDE: 4,
  HOVER_FREQUENCY: 2,
} as const;

export const BOSS = {
  SIZE: 48,
  MAX_HEALTH: 300,
  PHASE_THRESHOLDS: [1.0, 0.66, 0.33],
  CHARGE_SPEED: 250,
  CHARGE_DAMAGE: 35,
  LASER_DAMAGE: 25,
  WEAK_POINT_DURATION: 3000,  // ms
  WEAK_POINT_DAMAGE_MULT: 3,
} as const;

// ---- Missions ----
export const MISSION_TIME_LIMITS = [180, 240, 300, 360, 420] as const; // seconds per level

export const SCORING = {
  OBJECTIVE_COMPLETE: 500,
  STEALTH_BONUS_MULT: 2.0,
  TIME_BONUS_PER_SEC: 10,
  NO_DAMAGE_BONUS: 1000,
  ALL_OBJECTIVES_BONUS: 2000,
} as const;

// ---- Upgrades ----
export const UPGRADE_COSTS = [100, 250, 500, 1000, 2000] as const; // cost per level 1-5

export const UPGRADE_EFFECTS = {
  moveSpeed: [0, 10, 20, 30, 40, 50],        // % increase
  dashDistance: [0, 10, 20, 30, 40, 50],
  stealthDuration: [0, 15, 30, 45, 60, 75],  // % energy cost reduction
  maxHealth: [0, 20, 40, 60, 80, 100],        // flat increase
  maxEnergy: [0, 15, 30, 45, 60, 75],
  hackSpeed: [0, 10, 20, 30, 40, 50],        // % time increase
  energyRegen: [0, 15, 30, 45, 60, 75],      // % increase
} as const;

// ---- Physics ----
export const PHYSICS = {
  GRAVITY: 0,                // top-down, no gravity
  WORLD_BOUNDS_PADDING: 0,
} as const;

// ---- Hacking ----
export const HACKING = {
  BASE_TIME: 30,            // seconds
  TIME_PER_DIFFICULTY: -3,  // seconds reduced per difficulty level
  MIN_NODES: 4,
  MAX_NODES: 10,
  MEMORY_MIN_LENGTH: 3,
  MEMORY_MAX_LENGTH: 8,
  PATTERN_SPEED_BASE: 1.0,
  PATTERN_SPEED_MULT: 0.15, // speed increase per difficulty
} as const;

// ---- Camera ----
export const CAMERA = {
  LERP: 0.1,
  DEADZONE_WIDTH: 50,
  DEADZONE_HEIGHT: 50,
  ZOOM: 1.5,
} as const;

// ---- Save ----
export const SAVE_KEY = 'cyberheist_save';
export const SAVE_VERSION = 2;

// ---- Input Keys ----
export const INPUT_KEYS = {
  UP: ['W', 'UP'],
  DOWN: ['S', 'DOWN'],
  LEFT: ['A', 'LEFT'],
  RIGHT: ['D', 'RIGHT'],
  DASH: 'SPACE',
  STEALTH: 'SHIFT',
  INTERACT: 'E',
  PAUSE: 'ESC',
  INVENTORY_1: 'ONE',
  INVENTORY_2: 'TWO',
  INVENTORY_3: 'THREE',
  INVENTORY_4: 'FOUR',
} as const;
