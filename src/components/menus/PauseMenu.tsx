// ============================================================
// Cyber Heist 2077 — Pause Menu
// ============================================================

import { motion } from 'framer-motion';
import eventBus from '../../game/EventBus';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onQuit: () => void;
}

export function PauseMenu({ onResume, onRestart, onSettings, onQuit }: PauseMenuProps) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cyber-black bg-opacity-80 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        className="glass-panel p-8 w-80 relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h2 className="font-cyber text-2xl text-center neon-text-cyan mb-6 tracking-wider">
          PAUSED
        </h2>

        <div className="cyber-divider mb-6" />

        <div className="flex flex-col gap-3">
          <button className="cyber-button text-sm" onClick={onResume}>
            RESUME
          </button>
          <button className="cyber-button text-sm" onClick={onRestart}>
            RESTART MISSION
          </button>
          <button className="cyber-button text-sm" onClick={onSettings}>
            SETTINGS
          </button>
          <button className="cyber-button-magenta text-sm" onClick={onQuit}>
            QUIT TO MENU
          </button>
        </div>

        <div className="cyber-divider mt-6" />

        <p className="font-mono text-xs text-cyber-white-dim text-center mt-4 opacity-60">
          Press ESC to resume
        </p>
      </motion.div>
    </motion.div>
  );
}
