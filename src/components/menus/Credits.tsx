// ============================================================
// Cyber Heist 2077 — Credits
// ============================================================

import { motion } from 'framer-motion';

interface CreditsProps {
  onBack: () => void;
}

export function Credits({ onBack }: CreditsProps) {
  const credits = [
    { role: 'GAME DESIGN', name: 'Cyber Heist Team' },
    { role: 'PROGRAMMING', name: 'AI-Assisted Development' },
    { role: 'ART & VISUALS', name: 'Procedural Generation' },
    { role: 'AUDIO', name: 'Web Audio API Synthesis' },
    { role: 'ENGINE', name: 'Phaser 3' },
    { role: 'UI FRAMEWORK', name: 'React + TypeScript' },
    { role: 'STYLING', name: 'Tailwind CSS' },
    { role: 'ANIMATIONS', name: 'Framer Motion' },
    { role: 'AUDIO LIBRARY', name: 'Howler.js' },
    { role: 'BUNDLER', name: 'Vite' },
    { role: 'GAME JAM', name: 'Parsewave 2077' },
  ];

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-cyber-black bg-opacity-95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h2
        className="font-cyber text-3xl neon-text-cyan tracking-wider mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        CREDITS
      </motion.h2>

      <div className="space-y-4 max-w-md w-full px-8">
        {credits.map((credit, idx) => (
          <motion.div
            key={credit.role}
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            <span className="font-mono text-xs text-cyber-white-dim tracking-widest block">{credit.role}</span>
            <span className="font-cyber text-lg text-cyber-white">{credit.name}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <button className="cyber-button-magenta text-sm" onClick={onBack}>
          ← BACK TO MENU
        </button>
      </motion.div>

      <motion.p
        className="absolute bottom-6 font-mono text-xs text-cyber-white-dim opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5 }}
      >
        Made with ♥ for the Parsewave Game Jam
      </motion.p>
    </motion.div>
  );
}
