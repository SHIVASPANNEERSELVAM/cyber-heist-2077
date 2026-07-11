// ============================================================
// Cyber Heist 2077 — Game Over Screen
// ============================================================

import { motion } from 'framer-motion';

interface GameOverProps {
  reason: string;
  onRetry: () => void;
  onQuit: () => void;
}

export function GameOver({ reason, onRetry, onQuit }: GameOverProps) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-cyber-black bg-opacity-85" />

      <motion.div
        className="glass-panel-magenta p-10 text-center relative z-10 max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
      >
        <motion.h2
          className="font-cyber text-4xl neon-text-red tracking-wider mb-4"
          animate={{
            textShadow: [
              '0 0 10px #ff3344, 0 0 20px #ff3344',
              '0 0 20px #ff3344, 0 0 40px #ff3344, 0 0 60px #ff3344',
            ],
          }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        >
          MISSION FAILED
        </motion.h2>

        <div className="cyber-divider mb-4" style={{ background: 'linear-gradient(90deg, transparent, #ff334444, #ff3344, #ff334444, transparent)' }} />

        <p className="font-mono text-sm text-cyber-white-dim mb-8">{reason}</p>

        <div className="flex flex-col gap-3">
          <button className="cyber-button text-sm" onClick={onRetry}>
            RETRY MISSION
          </button>
          <button className="cyber-button-magenta text-sm" onClick={onQuit}>
            ABORT MISSION
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
