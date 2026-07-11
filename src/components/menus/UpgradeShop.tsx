// ============================================================
// Cyber Heist 2077 — Upgrade Shop
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayerUpgrades } from '../../types';
import { UPGRADE_COSTS, UPGRADE_EFFECTS } from '../../constants';

interface UpgradeShopProps {
  upgrades: PlayerUpgrades;
  credits: number;
  onSave: (upgrades: PlayerUpgrades, remainingCredits: number) => void;
  onBack: () => void;
}

const UPGRADE_LABELS = {
  moveSpeed: 'KINETIC ENHANCER',
  dashDistance: 'BLINK DRIVE',
  stealthDuration: 'OPTIC CAMO',
  maxHealth: 'SUBDERMAL ARMOR',
  maxEnergy: 'PLASMA CORE',
  hackSpeed: 'NEURAL LINK',
  energyRegen: 'CAPACITOR MATRIX',
};

const UPGRADE_DESCS = {
  moveSpeed: 'Increases base movement speed.',
  dashDistance: 'Increases dash distance and speed.',
  stealthDuration: 'Reduces energy drain while stealthed.',
  maxHealth: 'Increases maximum health capacity.',
  maxEnergy: 'Increases maximum energy capacity.',
  hackSpeed: 'Increases time limits for hacking minigames.',
  energyRegen: 'Increases energy regeneration rate.',
};

export function UpgradeShop({ upgrades, credits, onSave, onBack }: UpgradeShopProps) {
  const [currentUpgrades, setCurrentUpgrades] = useState<PlayerUpgrades>({ ...upgrades });
  const [currentCredits, setCurrentCredits] = useState<number>(credits);
  const [selectedUpgrade, setSelectedUpgrade] = useState<keyof PlayerUpgrades | null>(null);

  const handlePurchase = (key: keyof PlayerUpgrades) => {
    const level = currentUpgrades[key];
    if (level >= 5) return; // Max level

    const cost = UPGRADE_COSTS[level];
    if (currentCredits >= cost) {
      setCurrentCredits(currentCredits - cost);
      setCurrentUpgrades({ ...currentUpgrades, [key]: level + 1 });
    }
  };

  const handleApply = () => {
    onSave(currentUpgrades, currentCredits);
  };

  return (
    <motion.div 
      className="absolute inset-0 z-50 bg-cyber-black flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute top-8 left-8 flex flex-col">
        <h1 className="font-cyber text-4xl text-cyber-cyan tracking-widest neon-text-cyan uppercase">
          CYBERNETICS CLINIC
        </h1>
        <div className="w-full h-1 bg-cyber-cyan opacity-50 mt-2" />
      </div>

      <div className="absolute top-8 right-8 text-right">
        <span className="font-mono text-sm text-cyber-white-dim block mb-1">AVAILABLE CREDITS</span>
        <span className="font-cyber text-3xl text-cyber-yellow tracking-widest">
          {currentCredits.toLocaleString()} <span className="text-xl">CR</span>
        </span>
      </div>

      <div className="w-full max-w-5xl h-3/4 flex gap-8 mt-16">
        {/* Upgrade List */}
        <div className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
          {(Object.keys(currentUpgrades) as Array<keyof PlayerUpgrades>).map((key) => {
            const level = currentUpgrades[key];
            const isSelected = selectedUpgrade === key;
            const cost = level < 5 ? UPGRADE_COSTS[level] : 0;
            const canAfford = currentCredits >= cost;

            return (
              <motion.button
                key={key}
                className={`w-full text-left p-4 border transition-colors ${
                  isSelected 
                    ? 'border-cyber-cyan bg-cyber-cyan bg-opacity-10' 
                    : 'border-cyber-cyan border-opacity-30 bg-cyber-dark hover:border-opacity-60'
                }`}
                onClick={() => setSelectedUpgrade(key)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-cyber text-xl tracking-wider ${isSelected ? 'text-cyber-cyan' : 'text-cyber-white'}`}>
                    {UPGRADE_LABELS[key]}
                  </span>
                  <span className="font-mono text-sm text-cyber-yellow">
                    LVL {level}/5
                  </span>
                </div>
                
                {/* Level blocks */}
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`h-2 flex-1 ${i < level ? 'bg-cyber-yellow' : 'bg-cyber-black border border-cyber-yellow border-opacity-30'}`} 
                    />
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Details Panel */}
        <div className="w-1/3 flex flex-col gap-4">
          {selectedUpgrade ? (
            <div className="glass-panel p-6 flex-1 flex flex-col">
              <h2 className="font-cyber text-2xl text-cyber-cyan tracking-wider mb-2">
                {UPGRADE_LABELS[selectedUpgrade]}
              </h2>
              <p className="font-mono text-sm text-cyber-white-dim mb-8">
                {UPGRADE_DESCS[selectedUpgrade]}
              </p>

              <div className="mb-6">
                <span className="font-mono text-xs text-cyber-white-dim block mb-2">CURRENT EFFECT</span>
                <span className="font-mono text-lg text-cyber-white">
                  +{UPGRADE_EFFECTS[selectedUpgrade][currentUpgrades[selectedUpgrade]]}
                </span>
              </div>

              {currentUpgrades[selectedUpgrade] < 5 ? (
                <div className="mb-auto">
                  <span className="font-mono text-xs text-cyber-yellow block mb-2">NEXT LEVEL EFFECT</span>
                  <span className="font-mono text-lg text-cyber-yellow block mb-6">
                    +{UPGRADE_EFFECTS[selectedUpgrade][currentUpgrades[selectedUpgrade] + 1]}
                  </span>
                  
                  <div className="flex justify-between items-center bg-cyber-black p-4 border border-cyber-yellow border-opacity-30">
                    <span className="font-mono text-sm text-cyber-white-dim">UPGRADE COST</span>
                    <span className={`font-cyber text-xl ${currentCredits >= UPGRADE_COSTS[currentUpgrades[selectedUpgrade]] ? 'text-cyber-green' : 'text-cyber-red'}`}>
                      {UPGRADE_COSTS[currentUpgrades[selectedUpgrade]].toLocaleString()} CR
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-auto flex items-center justify-center bg-cyber-black p-4 border border-cyber-green border-opacity-30">
                  <span className="font-cyber text-xl text-cyber-green tracking-widest">MAX LEVEL REACHED</span>
                </div>
              )}

              <motion.button
                className={`w-full py-4 mt-6 font-cyber text-xl tracking-wider transition-colors ${
                  currentUpgrades[selectedUpgrade] < 5 && currentCredits >= UPGRADE_COSTS[currentUpgrades[selectedUpgrade]]
                    ? 'bg-cyber-cyan text-cyber-black hover:bg-opacity-80'
                    : 'bg-cyber-dark text-cyber-white-dim border border-cyber-white border-opacity-20 opacity-50 cursor-not-allowed'
                }`}
                disabled={currentUpgrades[selectedUpgrade] >= 5 || currentCredits < UPGRADE_COSTS[currentUpgrades[selectedUpgrade]]}
                onClick={() => handlePurchase(selectedUpgrade)}
                whileHover={currentUpgrades[selectedUpgrade] < 5 && currentCredits >= UPGRADE_COSTS[currentUpgrades[selectedUpgrade]] ? { scale: 1.02 } : {}}
                whileTap={currentUpgrades[selectedUpgrade] < 5 && currentCredits >= UPGRADE_COSTS[currentUpgrades[selectedUpgrade]] ? { scale: 0.98 } : {}}
              >
                {currentUpgrades[selectedUpgrade] >= 5 ? 'MAXED OUT' : 'INSTALL UPGRADE'}
              </motion.button>
            </div>
          ) : (
            <div className="glass-panel p-6 flex-1 flex items-center justify-center opacity-50">
              <span className="font-mono text-sm text-cyber-white-dim">SELECT AN UPGRADE TO VIEW DETAILS</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-8 flex gap-4 w-[calc(100%-4rem)]">
        <motion.button
          className="px-8 py-3 font-cyber text-lg tracking-widest text-cyber-cyan border border-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-10 transition-colors"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          BACK
        </motion.button>
        <div className="flex-1" />
        <motion.button
          className="px-12 py-3 font-cyber text-lg tracking-widest bg-cyber-cyan text-cyber-black hover:bg-opacity-80 transition-colors"
          onClick={handleApply}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          APPLY & RETURN
        </motion.button>
      </div>
    </motion.div>
  );
}
