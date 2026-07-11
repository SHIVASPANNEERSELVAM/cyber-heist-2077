// ============================================================
// Cyber Heist 2077 — Level Data (All 5 Levels)
// Handcrafted tile maps and object placement
// ============================================================
//
// Tile Legend:
// 0 = floor, 1 = wall, 2 = door_locked, 3 = door_unlocked,
// 4 = terminal, 5 = camera, 6 = laser_emitter, 7 = vault,
// 8 = exit, 9 = spawn, 10 = vent, 11 = decoration
// ============================================================

import { LevelConfig } from '../../types';
import { TILE_SIZE } from '../../constants';

// ---- Level 1: Tutorial ----
const level1Tiles: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,9,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,8,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,1,1,3,1,1,0,0,11,0,0,11,0,0,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// ---- Level 2: Laser Security ----
const level2Tiles: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,9,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,8,1],
  [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,3,0,0,6,0,0,3,0,0,6,0,0,3,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,1,1,3,1,1,0,0,0,0,0,1,1,1,3,1,1,1,1,1,1,3,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,4,0,0,0,6,0,6,0,0,0,0,0,0,0,0,0,0,4,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// ---- Level 3: Patrolling Guards ----
const level3Tiles: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,9,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,3,0,0,0,5,0,0,0,0,0,3,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,5,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,1,1,1,3,1,1,1,1,1,3,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,4,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,3,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// ---- Level 4: Security Drones ----
const level4Tiles: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,9,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,3,0,0,0,5,0,0,0,3,0,0,0,0,0,0,0,0,0,5,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,3,1,1,1,1,1,1,0,0,1],
  [1,1,1,1,1,3,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,6,0,6,0,0,0,0,0,0,0,0,0,0,4,0,0,1,0,0,1],
  [1,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,6,0,0,0,0,0,3,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,8,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// ---- Level 5: Boss Facility ----
const level5Tiles: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,9,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,2,0,0,0,5,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,3,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,6,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,5,0,0,0,4,0,0,0,5,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export const LEVEL_CONFIGS: LevelConfig[] = [
  // Level 1: Tutorial
  {
    id: 0,
    name: 'Neural Link',
    width: level1Tiles[0].length,
    height: level1Tiles.length,
    tileSize: TILE_SIZE,
    tiles: level1Tiles,
    playerSpawn: { x: 1, y: 1 },
    exitPoint: { x: 18, y: 1 },
    objects: [
      { id: 'terminal_1', type: 'terminal', x: 3, y: 8, properties: { difficulty: 1 } },
      { id: 'terminal_2', type: 'terminal', x: 9, y: 7, properties: { difficulty: 1 } },
      { id: 'keycard_1', type: 'keycard', x: 9, y: 3, properties: {} },
      { id: 'aicore_1', type: 'aiCore', x: 16, y: 2, properties: {} },
      { id: 'healthpack_1', type: 'healthPack', x: 7, y: 9, properties: {} },
    ],
    enemies: [],
  },
  // Level 2: Laser Security
  {
    id: 1,
    name: 'Neon Grid',
    width: level2Tiles[0].length,
    height: level2Tiles.length,
    tileSize: TILE_SIZE,
    tiles: level2Tiles,
    playerSpawn: { x: 1, y: 1 },
    exitPoint: { x: 23, y: 1 },
    objects: [
      { id: 'terminal_1', type: 'terminal', x: 3, y: 8, properties: { difficulty: 2 } },
      { id: 'terminal_2', type: 'terminal', x: 20, y: 8, properties: { difficulty: 2 } },
      { id: 'keycard_1', type: 'keycard', x: 9, y: 3, properties: {} },
      { id: 'aicore_1', type: 'aiCore', x: 14, y: 11, properties: {} },
      { id: 'emp_1', type: 'emp', x: 4, y: 7, properties: {} },
    ],
    enemies: [],
  },
  // Level 3: Patrolling Guards
  {
    id: 2,
    name: 'Shadow Protocol',
    width: level3Tiles[0].length,
    height: level3Tiles.length,
    tileSize: TILE_SIZE,
    tiles: level3Tiles,
    playerSpawn: { x: 1, y: 1 },
    exitPoint: { x: 22, y: 13 },
    objects: [
      { id: 'terminal_1', type: 'terminal', x: 8, y: 8, properties: { difficulty: 3 } },
      { id: 'terminal_2', type: 'terminal', x: 19, y: 9, properties: { difficulty: 3 } },
      { id: 'keycard_1', type: 'keycard', x: 4, y: 3, properties: {} },
      { id: 'aicore_1', type: 'aiCore', x: 15, y: 12, properties: {} },
      { id: 'healthpack_1', type: 'healthPack', x: 12, y: 7, properties: {} },
      { id: 'emp_1', type: 'emp', x: 21, y: 4, properties: {} },
    ],
    enemies: [
      {
        id: 'guard_1',
        patrolRoute: [
          { x: 8, y: 2 },
          { x: 8, y: 5 },
          { x: 14, y: 5 },
          { x: 14, y: 2 },
        ],
        visionRange: 150,
        visionAngle: 60,
        moveSpeed: 80,
        alertDuration: 2000,
        searchDuration: 5000,
      },
      {
        id: 'guard_2',
        patrolRoute: [
          { x: 18, y: 2 },
          { x: 22, y: 2 },
          { x: 22, y: 5 },
          { x: 18, y: 5 },
        ],
        visionRange: 150,
        visionAngle: 60,
        moveSpeed: 80,
        alertDuration: 2000,
        searchDuration: 5000,
      },
      {
        id: 'guard_3',
        patrolRoute: [
          { x: 2, y: 7 },
          { x: 2, y: 12 },
          { x: 10, y: 12 },
          { x: 10, y: 7 },
        ],
        visionRange: 150,
        visionAngle: 60,
        moveSpeed: 80,
        alertDuration: 2000,
        searchDuration: 5000,
      },
    ],
  },
  // Level 4: Security Drones
  {
    id: 3,
    name: 'Chrome Abyss',
    width: level4Tiles[0].length,
    height: level4Tiles.length,
    tileSize: TILE_SIZE,
    tiles: level4Tiles,
    playerSpawn: { x: 1, y: 1 },
    exitPoint: { x: 28, y: 14 },
    objects: [
      { id: 'terminal_1', type: 'terminal', x: 4, y: 8, properties: { difficulty: 4 } },
      { id: 'terminal_2', type: 'terminal', x: 23, y: 7, properties: { difficulty: 4 } },
      { id: 'keycard_1', type: 'keycard', x: 10, y: 3, properties: {} },
      { id: 'aicore_1', type: 'aiCore', x: 14, y: 13, properties: {} },
      { id: 'healthpack_1', type: 'healthPack', x: 20, y: 9, properties: {} },
      { id: 'emp_1', type: 'emp', x: 4, y: 7, properties: {} },
      { id: 'energycell_1', type: 'energyCell', x: 25, y: 12, properties: {} },
    ],
    enemies: [
      {
        id: 'guard_1',
        patrolRoute: [
          { x: 9, y: 2 },
          { x: 13, y: 2 },
          { x: 13, y: 4 },
          { x: 9, y: 4 },
        ],
        visionRange: 150,
        visionAngle: 60,
        moveSpeed: 80,
        alertDuration: 2000,
        searchDuration: 5000,
      },
      {
        id: 'drone_1',
        patrolRoute: [
          { x: 9, y: 7 },
          { x: 14, y: 7 },
          { x: 14, y: 10 },
          { x: 9, y: 10 },
        ],
        scanRange: 120,
        scanSpeed: 1.5,
        laserDamage: 15,
        empVulnerable: true,
      },
      {
        id: 'drone_2',
        patrolRoute: [
          { x: 18, y: 7 },
          { x: 24, y: 7 },
          { x: 24, y: 10 },
          { x: 18, y: 10 },
        ],
        scanRange: 120,
        scanSpeed: 1.5,
        laserDamage: 15,
        empVulnerable: true,
      },
    ],
  },
  // Level 5: Boss Facility
  {
    id: 4,
    name: 'Nexus Prime',
    width: level5Tiles[0].length,
    height: level5Tiles.length,
    tileSize: TILE_SIZE,
    tiles: level5Tiles,
    playerSpawn: { x: 1, y: 1 },
    exitPoint: { x: 28, y: 16 },
    objects: [
      { id: 'terminal_1', type: 'terminal', x: 2, y: 7, properties: { difficulty: 5 } },
      { id: 'terminal_2', type: 'terminal', x: 8, y: 12, properties: { difficulty: 5 } },
      { id: 'keycard_1', type: 'keycard', x: 8, y: 3, properties: {} },
      { id: 'aicore_1', type: 'aiCore', x: 8, y: 14, properties: {} },
      { id: 'healthpack_1', type: 'healthPack', x: 5, y: 7, properties: {} },
      { id: 'healthpack_2', type: 'healthPack', x: 14, y: 13, properties: {} },
      { id: 'emp_1', type: 'emp', x: 12, y: 11, properties: {} },
      { id: 'energycell_1', type: 'energyCell', x: 3, y: 12, properties: {} },
    ],
    enemies: [
      {
        id: 'guard_1',
        patrolRoute: [
          { x: 7, y: 2 },
          { x: 12, y: 2 },
          { x: 12, y: 4 },
          { x: 7, y: 4 },
        ],
        visionRange: 150,
        visionAngle: 60,
        moveSpeed: 90,
        alertDuration: 2000,
        searchDuration: 5000,
      },
      {
        id: 'guard_2',
        patrolRoute: [
          { x: 2, y: 10 },
          { x: 2, y: 14 },
          { x: 14, y: 14 },
          { x: 14, y: 10 },
        ],
        visionRange: 150,
        visionAngle: 60,
        moveSpeed: 85,
        alertDuration: 2000,
        searchDuration: 5000,
      },
      {
        id: 'drone_1',
        patrolRoute: [
          { x: 7, y: 6 },
          { x: 12, y: 6 },
          { x: 12, y: 8 },
          { x: 7, y: 8 },
        ],
        scanRange: 130,
        scanSpeed: 1.8,
        laserDamage: 18,
        empVulnerable: true,
      },
    ],
  },
];
