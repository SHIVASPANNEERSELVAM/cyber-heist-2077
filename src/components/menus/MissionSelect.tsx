// ============================================================
// Cyber Heist 2077 — Mission Select
// ============================================================

import { motion } from 'framer-motion';
import { LEVEL_CONFIGS } from '../../game/levels/LevelData';
import { MissionStatus, SaveData } from '../../types';

interface MissionSelectProps {
  saveData: SaveData | null;
  onSelectMission: (missionId: number) => void;
  onBack: () => void;
}

const DIFFICULTY_LABELS = ['BEGINNER', 'EASY', 'MODERATE', 'HARD', 'EXTREME'];
const DIFFICULTY_COLORS = ['text-cyber-green', 'text-cyber-cyan', 'text-cyber-yellow', 'text-cyber-orange', 'text-cyber-red'];

export function MissionSelect({ saveData, onSelectMission, onBack }: MissionSelectProps) {
  const getMissionStatus = (missionId: number): MissionStatus => {
    if (!saveData) return missionId === 0 ? 'unlocked' : 'locked';
    return saveData.missions[missionId]?.status ?? (missionId === 0 ? 'unlocked' : 'locked');
  };

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-cyber-black bg-opacity-95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="font-cyber text-3xl neon-text-cyan tracking-wider">MISSION SELECT</h2>
        <div className="cyber-divider mt-3 max-w-xs mx-auto" />
      </motion.div>

      {/* Mission cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-8 max-w-5xl w-full">
        {LEVEL_CONFIGS.map((level, idx) => {
          const status = getMissionStatus(level.id);
          const isLocked = status === 'locked';
          const isCompleted = status === 'completed';
          const missionSave = saveData?.missions[level.id];

          return (
            <motion.div
              key={level.id}
              className={`glass-panel p-5 cursor-pointer transition-all duration-300 ${
                isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-neon-cyan hover:border-cyber-cyan'
              } ${isCompleted ? 'border-cyber-green border-opacity-50' : ''}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: isLocked ? 0.4 : 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              onClick={() => !isLocked && onSelectMission(level.id)}
            >
              {/* Mission number */}
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-cyber-white-dim">
                  MISSION {String(level.id + 1).padStart(2, '0')}
                </span>
                {isCompleted && (
                  <span className="font-mono text-xs text-cyber-green">✓ COMPLETE</span>
                )}
                {isLocked && (
                  <span className="font-mono text-xs text-cyber-red">🔒 LOCKED</span>
                )}
              </div>

              {/* Mission name */}
              <h3 className="font-cyber text-lg text-cyber-white tracking-wider mb-1">
                {level.name}
              </h3>

              {/* Difficulty */}
              <span className={`font-mono text-xs ${DIFFICULTY_COLORS[level.id] ?? 'text-cyber-white-dim'}`}>
                {DIFFICULTY_LABELS[level.id] ?? 'UNKNOWN'}
              </span>

              {/* Stats */}
              {missionSave && (
                <div className="mt-3 pt-3 border-t border-cyber-cyan border-opacity-10">
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] text-cyber-white-dim">BEST TIME</span>
                    <span className="font-mono text-[10px] text-cyber-cyan">
                      {formatTime(missionSave.bestTime ?? null)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[10px] text-cyber-white-dim">HIGH SCORE</span>
                    <span className="font-mono text-[10px] text-cyber-yellow">
                      {missionSave.highScore ?? 0}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Back button */}
      <motion.button
        className="cyber-button-magenta text-sm mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onBack}
      >
        ← BACK TO MENU
      </motion.button>
    </motion.div>
  );
}
