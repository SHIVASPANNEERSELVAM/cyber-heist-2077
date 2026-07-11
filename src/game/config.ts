// ============================================================
// Cyber Heist 2077 — Phaser Game Configuration
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { GameScene } from './scenes/GameScene';
import { HackingScene } from './scenes/HackingScene';

export const createGameConfig = (parent: HTMLElement): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0a0a0f',
  pixelArt: false,
  antialias: true,
  // @ts-ignore
  resolution: window.devicePixelRatio || 1,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 512,
      height: 384,
    },
    max: {
      width: 1920,
      height: 1080,
    },
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
      tileBias: 16,
    },
  },
  scene: [BootScene, PreloadScene, GameScene, HackingScene],
  render: {
    antialiasGL: true,
    desynchronized: false,
  },
  fps: {
    target: 60,
    forceSetTimeOut: false,
  },
  input: {
    keyboard: true,
    mouse: true,
    touch: true,
    gamepad: false,
  },
  disableContextMenu: true,
});
