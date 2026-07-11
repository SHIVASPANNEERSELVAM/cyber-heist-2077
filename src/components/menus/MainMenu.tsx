// ============================================================
// Cyber Heist 2077 — Main Menu
// Animated cyberpunk main menu with glitch effects
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioService } from '../../services/AudioService';
import eventBus from '../../game/EventBus';

interface MainMenuProps {
  onStartGame: () => void;
  onMissionSelect: () => void;
  onUpgrades: () => void;
  onSettings: () => void;
  onCredits: () => void;
}

export function MainMenu({ onStartGame, onMissionSelect, onUpgrades, onSettings, onCredits }: MainMenuProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showTitle, setShowTitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 300);
    const t2 = setTimeout(() => setShowButtons(true), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const menuItems = [
    { id: 'new', label: 'NEW GAME', action: onStartGame },
    { id: 'missions', label: 'MISSION SELECT', action: onMissionSelect },
    { id: 'upgrades', label: 'CYBERNETICS', action: onUpgrades },
    { id: 'settings', label: 'SETTINGS', action: onSettings },
    { id: 'credits', label: 'CREDITS', action: onCredits },
  ];

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-cyber-black bg-opacity-90">
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'scanline 20s linear infinite',
          }}
        />
        {/* Corner decorations */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-cyber-cyan opacity-30" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-cyber-cyan opacity-30" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-cyber-cyan opacity-30" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-cyber-cyan opacity-30" />
      </div>

      {/* Scanline overlay */}
      <div className="scanline-overlay opacity-30" />

      {/* Title */}
      <AnimatePresence>
        {showTitle && (
          <motion.div
            className="text-center mb-16 relative"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className="font-cyber text-6xl md:text-7xl font-black tracking-wider neon-text-cyan"
              animate={{ textShadow: ['0 0 10px #00f0ff, 0 0 20px #00f0ff', '0 0 20px #00f0ff, 0 0 40px #00f0ff, 0 0 60px #00f0ff'] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              CYBER HEIST
            </motion.h1>
            <motion.p
              className="font-cyber text-3xl md:text-4xl font-bold tracking-[0.5em] neon-text-magenta mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              2 0 7 7
            </motion.p>
            <div className="cyber-divider mt-6 max-w-md mx-auto" />
            <motion.p
              className="font-mono text-sm text-cyber-white-dim mt-4 tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              STEALTH • ACTION • PUZZLE
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu buttons */}
      <AnimatePresence>
        {showButtons && (
          <motion.div
            className="flex flex-col gap-4 w-72"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {menuItems.map((item, idx) => (
              <motion.button
                key={item.id}
                className="cyber-button text-base"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4, ease: 'easeOut' }}
                onMouseEnter={() => {
                  setHoveredButton(item.id);
                  audioService.playUIHover();
                }}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => {
                  audioService.playUIClick();
                  item.action();
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {hoveredButton === item.id && (
                    <motion.span
                      className="text-cyber-cyan"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {'>>'}
                    </motion.span>
                  )}
                  {item.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version */}
      <motion.p
        className="absolute bottom-6 right-8 font-mono text-xs text-cyber-white-dim opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
      >
        v1.0.0 // PARSEWAVE JAM 2077
      </motion.p>

      {/* Controls hint */}
      <motion.div
        className="absolute bottom-6 left-8 font-mono text-xs text-cyber-white-dim opacity-40 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
      >
        WASD — Move | SPACE — Dash | SHIFT — Stealth | E — Interact
      </motion.div>
    </div>
  );
}
