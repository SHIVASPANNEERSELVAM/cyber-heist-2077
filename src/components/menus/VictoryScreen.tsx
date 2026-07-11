// ============================================================
// Cyber Heist 2077 — Victory Screen
// ============================================================

import { motion } from 'framer-motion';
import { MissionResult } from '../../types';

interface VictoryScreenProps {
  result: MissionResult;
  onNextMission: () => void;
  onUpgrades: () => void;
  onMenu: () => void;
}

export function VictoryScreen({ result, onNextMission, onUpgrades, onMenu }: VictoryScreenProps) {
  const stealthGrade =
    result.stealthRating >= 90 ? 'S' :
    result.stealthRating >= 70 ? 'A' :
    result.stealthRating >= 50 ? 'B' :
    result.stealthRating >= 30 ? 'C' : 'D';

  const gradeColor =
    stealthGrade === 'S' ? 'neon-text-cyan' :
    stealthGrade === 'A' ? 'neon-text-green' :
    stealthGrade === 'B' ? 'text-cyber-yellow' :
    'text-cyber-orange';

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-cyber-black bg-opacity-85" />

      <motion.div
        className="glass-panel p-10 text-center relative z-10 max-w-lg w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.h2
          className="font-cyber text-4xl neon-text-green tracking-wider mb-2"
          animate={{
            textShadow: [
              '0 0 10px #00ff66, 0 0 20px #00ff66',
              '0 0 20px #00ff66, 0 0 40px #00ff66, 0 0 60px #00ff66',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        >
          MISSION COMPLETE
        </motion.h2>

        <div className="cyber-divider my-4" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            className="glass-panel p-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="font-mono text-xs text-cyber-white-dim block">TIME</span>
            <span className="font-cyber text-xl text-cyber-cyan">{formatTime(result.timeTaken)}</span>
          </motion.div>
          <motion.div
            className="glass-panel p-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="font-mono text-xs text-cyber-white-dim block">SCORE</span>
            <span className="font-cyber text-xl text-cyber-yellow">{result.score.toLocaleString()}</span>
          </motion.div>
          <motion.div
            className="glass-panel p-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="font-mono text-xs text-cyber-white-dim block">STEALTH GRADE</span>
            <span className={`font-cyber text-3xl ${gradeColor}`}>{stealthGrade}</span>
          </motion.div>
          <motion.div
            className="glass-panel p-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="font-mono text-xs text-cyber-white-dim block">OBJECTIVES</span>
            <span className="font-cyber text-xl text-cyber-green">
              {result.objectivesCompleted}/{result.totalObjectives}
            </span>
          </motion.div>
        </div>

        {/* Credits earned */}
        <motion.div
          className="glass-panel p-3 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <span className="font-mono text-xs text-cyber-white-dim">CREDITS EARNED</span>
          <div className="font-cyber text-2xl text-cyber-yellow mt-1">
            ¢{(result.creditsEarned + result.bonusCredits).toLocaleString()}
            {result.bonusCredits > 0 && (
              <span className="font-mono text-sm text-cyber-green ml-2">
                (+{result.bonusCredits} bonus)
              </span>
            )}
          </div>
        </motion.div>

        <div className="cyber-divider mb-6" />

        <div className="flex flex-col gap-3">
          <button className="cyber-button text-sm" onClick={onNextMission}>
            NEXT MISSION →
          </button>
          <button className="cyber-button text-sm" onClick={onUpgrades}>
            UPGRADE EQUIPMENT
          </button>
          <button className="cyber-button-magenta text-sm" onClick={onMenu}>
            BACK TO MENU
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
