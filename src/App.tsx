// ============================================================
// Cyber Heist 2077 — Main Application
// Orchestrates all screens and Phaser game lifecycle
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PhaserGame } from './game/PhaserGame';
import eventBus from './game/EventBus';
import { MainMenu } from './components/menus/MainMenu';
import { MissionSelect } from './components/menus/MissionSelect';
import { PauseMenu } from './components/menus/PauseMenu';
import { GameHUD } from './components/hud/GameHUD';
import { GameOver } from './components/menus/GameOver';
import { VictoryScreen } from './components/menus/VictoryScreen';
import { Settings } from './components/menus/Settings';
import { Credits } from './components/menus/Credits';
import { UpgradeShop } from './components/menus/UpgradeShop';
import { audioService } from './services/AudioService';
import { GameScreen, GameSettings, MissionResult, SaveData, PlayerUpgrades } from './types';
import { SAVE_KEY, SAVE_VERSION } from './constants';

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.7,
  musicVolume: 0.5,
  sfxVolume: 0.8,
  isMuted: false,
  graphicsQuality: 'high',
  showFPS: false,
  screenShake: true,
};

const DEFAULT_SAVE: SaveData = {
  version: SAVE_VERSION,
  missions: {
    0: { status: 'unlocked', bestTime: null, highScore: null, bestStealthRating: null },
    1: { status: 'unlocked', bestTime: null, highScore: null, bestStealthRating: null },
    2: { status: 'unlocked', bestTime: null, highScore: null, bestStealthRating: null },
    3: { status: 'unlocked', bestTime: null, highScore: null, bestStealthRating: null },
    4: { status: 'unlocked', bestTime: null, highScore: null, bestStealthRating: null },
  },
  upgrades: {
    moveSpeed: 0,
    dashDistance: 0,
    stealthDuration: 0,
    maxHealth: 0,
    maxEnergy: 0,
    hackSpeed: 0,
    energyRegen: 0,
  },
  credits: 0,
  settings: DEFAULT_SETTINGS,
  timestamp: Date.now(),
};

function loadSaveData(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as SaveData;
      if (data.version === SAVE_VERSION) {
        // Deep merge settings to ensure new keys exist
        data.settings = { ...DEFAULT_SETTINGS, ...data.settings };
        return data;
      }
    }
  } catch (e) {
    console.warn('Failed to load save data:', e);
  }
  return { ...DEFAULT_SAVE };
}

function persistSaveData(data: SaveData): void {
  try {
    data.timestamp = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save data:', e);
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('loading');
  const [saveData, setSaveData] = useState<SaveData>(loadSaveData);
  const [gameOverReason, setGameOverReason] = useState('');
  const [missionResult, setMissionResult] = useState<MissionResult | null>(null);
  const [currentMissionId, setCurrentMissionId] = useState(0);
  const [previousScreen, setPreviousScreen] = useState<GameScreen>('mainMenu');
  const gameRef = useRef<Phaser.Game | null>(null);

  // Listen for screen changes from Phaser
  useEffect(() => {
    const onScreenChange = (data: { screen: GameScreen }) => {
      setCurrentScreen(data.screen);
    };
    const onMissionFailed = (data: { reason: string }) => {
      setGameOverReason(data.reason);
      setCurrentScreen('gameOver');
    };
    const onMissionCompleted = (data: MissionResult) => {
      setMissionResult(data);

      // Update save data
      setSaveData((prev) => {
        const updated = { ...prev };
        const missionId = data.missionId;

        // Update current mission stats
        const existing = updated.missions[missionId] ?? {
          status: 'unlocked' as const,
          bestTime: null,
          highScore: null,
          bestStealthRating: null,
        };
        updated.missions[missionId] = {
          status: 'completed',
          bestTime: existing.bestTime === null ? data.timeTaken : Math.min(existing.bestTime, data.timeTaken),
          highScore: existing.highScore === null ? data.score : Math.max(existing.highScore, data.score),
          bestStealthRating: existing.bestStealthRating === null ? data.stealthRating : Math.max(existing.bestStealthRating, data.stealthRating),
        };

        // Unlock next mission
        const nextMissionId = missionId + 1;
        if (nextMissionId <= 4 && (!updated.missions[nextMissionId] || updated.missions[nextMissionId].status === 'locked')) {
          updated.missions[nextMissionId] = {
            status: 'unlocked',
            bestTime: null,
            highScore: null,
            bestStealthRating: null,
          };
        }

        // Add credits
        updated.credits += data.creditsEarned + data.bonusCredits;

        persistSaveData(updated);
        return updated;
      });

      setCurrentScreen('victory');
    };

    eventBus.on('game:screenChanged', onScreenChange);
    eventBus.on('mission:failed', onMissionFailed);
    eventBus.on('mission:completed', onMissionCompleted);

    return () => {
      eventBus.off('game:screenChanged', onScreenChange);
      eventBus.off('mission:failed', onMissionFailed);
      eventBus.off('mission:completed', onMissionCompleted);
    };
  }, []);

  // ---- Audio Initialization & Settings Sync ----
  useEffect(() => {
    // Sync volumes
    audioService.setVolumes(
      saveData.settings.musicVolume, 
      saveData.settings.sfxVolume,
      saveData.settings.masterVolume,
      saveData.settings.isMuted
    );
    
    const handleFirstInteraction = () => {
      audioService.init();
      audioService.playBGM();
      window.removeEventListener('click', handleFirstInteraction, true);
      window.removeEventListener('keydown', handleFirstInteraction, true);
    };

    window.addEventListener('click', handleFirstInteraction, true);
    window.addEventListener('keydown', handleFirstInteraction, true);

    return () => {
      window.removeEventListener('click', handleFirstInteraction, true);
      window.removeEventListener('keydown', handleFirstInteraction, true);
    };
  }, [saveData.settings.musicVolume, saveData.settings.sfxVolume, saveData.settings.masterVolume, saveData.settings.isMuted]);

  // ---- Handlers ----
  const startMission = useCallback((missionId: number) => {
    setCurrentMissionId(missionId);
    setCurrentScreen('playing');
    eventBus.emit('ui:startMission', { missionId, upgrades: saveData.upgrades });
  }, [saveData.upgrades]);

  const handleResume = useCallback(() => {
    setCurrentScreen('playing');
    eventBus.emit('ui:resumeGame');
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentScreen('playing');
    eventBus.emit('ui:restartMission');
  }, []);

  const handleQuitToMenu = useCallback(() => {
    setCurrentScreen('mainMenu');
    eventBus.emit('ui:quitToMenu');
  }, []);

  const handleSettingsSave = useCallback((settings: GameSettings) => {
    setSaveData((prev) => {
      const updated = { ...prev, settings };
      persistSaveData(updated);
      return updated;
    });
    audioService.setVolumes(settings.musicVolume, settings.sfxVolume, settings.masterVolume, settings.isMuted);
    eventBus.emit('ui:settingsChanged', settings);
  }, []);

  const showSettings = useCallback(() => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('settings');
  }, [currentScreen]);

  const handleUpgradesSave = useCallback((upgrades: PlayerUpgrades, remainingCredits: number) => {
    setSaveData((prev) => {
      const updated = { ...prev, upgrades, credits: remainingCredits };
      persistSaveData(updated);
      return updated;
    });
    setCurrentScreen('mainMenu'); // Return to main menu after
  }, []);

  const backFromSettings = useCallback(() => {
    setCurrentScreen(previousScreen);
  }, [previousScreen]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-cyber-black">
      {/* Phaser game canvas — always mounted */}
      <PhaserGame
        onGameReady={(game) => {
          gameRef.current = game;
        }}
      />

      {/* React UI overlays */}
      <AnimatePresence mode="wait">
        {/* Main Menu */}
        {currentScreen === 'mainMenu' && (
          <MainMenu
            key="mainMenu"
            onStartGame={() => startMission(0)}
            onMissionSelect={() => setCurrentScreen('missionSelect')}
            onUpgrades={() => setCurrentScreen('upgradeShop')}
            onSettings={() => showSettings()}
            onCredits={() => setCurrentScreen('credits')}
          />
        )}

        {/* Mission Select */}
        {currentScreen === 'missionSelect' && (
          <MissionSelect
            key="missionSelect"
            saveData={saveData}
            onSelectMission={startMission}
            onBack={() => setCurrentScreen('mainMenu')}
          />
        )}

        {/* Game HUD */}
        {currentScreen === 'playing' && (
          <GameHUD key="gameHUD" />
        )}

        {/* Pause Menu */}
        {currentScreen === 'paused' && (
          <PauseMenu
            key="pauseMenu"
            onResume={handleResume}
            onRestart={handleRestart}
            onSettings={showSettings}
            onQuit={handleQuitToMenu}
          />
        )}

        {/* Game Over */}
        {currentScreen === 'gameOver' && (
          <GameOver
            key="gameOver"
            reason={gameOverReason}
            onRetry={handleRestart}
            onQuit={handleQuitToMenu}
          />
        )}

        {/* Victory */}
        {currentScreen === 'victory' && missionResult && (
          <VictoryScreen
            key="victory"
            result={missionResult}
            onNextMission={() => startMission(currentMissionId + 1)}
            onUpgrades={() => setCurrentScreen('upgradeShop')}
            onMenu={handleQuitToMenu}
          />
        )}

        {/* Settings */}
        {currentScreen === 'settings' && (
          <Settings
            key="settings"
            settings={saveData.settings}
            onSave={handleSettingsSave}
            onBack={backFromSettings}
          />
        )}

        {/* Credits */}
        {currentScreen === 'credits' && (
          <Credits
            key="credits"
            onBack={() => setCurrentScreen('mainMenu')}
          />
        )}

        {/* Upgrade Shop */}
        {currentScreen === 'upgradeShop' && (
          <UpgradeShop
            key="upgradeShop"
            upgrades={saveData.upgrades}
            credits={saveData.credits}
            onSave={handleUpgradesSave}
            onBack={() => setCurrentScreen('mainMenu')}
          />
        )}
      </AnimatePresence>

      {/* Persistent scanline overlay */}
      <div className="scanline-overlay opacity-20" />
    </div>
  );
}
