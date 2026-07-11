// ============================================================
// Cyber Heist 2077 — PhaserGame React Component
// Container Pattern: React wrapper for the Phaser canvas
// ============================================================

import { useRef, useEffect } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './config';
import eventBus from './EventBus';

interface PhaserGameProps {
  onGameReady?: (game: Phaser.Game) => void;
}

export function PhaserGame({ onGameReady }: PhaserGameProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameContainerRef.current || gameRef.current) return;

    const config = createGameConfig(gameContainerRef.current);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    if (onGameReady) {
      onGameReady(game);
    }

    const handleStartMission = (data: { missionId: number; upgrades?: any }) => {
      game.scene.start('GameScene', { missionId: data.missionId, upgrades: data.upgrades });
    };

    const handleQuitToMenu = () => {
      game.scene.stop('GameScene');
      game.scene.stop('HackingScene');
    };

    eventBus.on('ui:startMission', handleStartMission);
    eventBus.on('ui:quitToMenu', handleQuitToMenu);

    return () => {
      eventBus.off('ui:startMission', handleStartMission);
      eventBus.off('ui:quitToMenu', handleQuitToMenu);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      id="phaser-game-container"
      className="absolute inset-0 z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
