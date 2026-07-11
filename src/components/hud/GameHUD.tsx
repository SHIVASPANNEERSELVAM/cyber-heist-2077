// ============================================================
// Cyber Heist 2077 — Game HUD
// Health, Energy, Timer, Objectives, Minimap
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import eventBus from '../../game/EventBus';
import { MissionObjective, InventoryItem } from '../../types';
import { MobileControls } from './MobileControls';

export function GameHUD() {
  const [health, setHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [maxEnergy, setMaxEnergy] = useState(100);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [objectives, setObjectives] = useState<MissionObjective[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const onHealth = (data: { health: number; maxHealth: number }) => {
      setHealth(data.health);
      setMaxHealth(data.maxHealth);
    };
    const onEnergy = (data: { energy: number; maxEnergy: number }) => {
      setEnergy(data.energy);
      setMaxEnergy(data.maxEnergy);
    };
    const onTimer = (data: { timeRemaining: number }) => {
      setTimeRemaining(data.timeRemaining);
    };
    const onStealth = (data: { isStealthMode: boolean }) => {
      setIsStealthMode(data.isStealthMode);
    };
    const onObjectives = (data: { objectives: MissionObjective[] }) => {
      setObjectives(data.objectives);
    };
    const onInventory = (data: { items: InventoryItem[] }) => {
      setInventory(prev => {
        const newInv = [...prev];
        data.items.forEach(newItem => {
          const existing = newInv.find(i => i.id === newItem.id);
          if (existing) {
            existing.quantity += newItem.quantity;
          } else {
            newInv.push(newItem);
          }
        });
        return newInv;
      });
    };
    const onFps = (data: { fps: number }) => {
      setFps(data.fps);
    };

    eventBus.on('player:healthChanged', onHealth);
    eventBus.on('player:energyChanged', onEnergy);
    eventBus.on('mission:timerUpdate', onTimer);
    eventBus.on('player:stealthChanged', onStealth);
    eventBus.on('mission:objectiveUpdated', onObjectives);
    eventBus.on('inventory:changed', onInventory);
    eventBus.on('game:fpsUpdate', onFps);

    return () => {
      eventBus.off('player:healthChanged', onHealth);
      eventBus.off('player:energyChanged', onEnergy);
      eventBus.off('mission:timerUpdate', onTimer);
      eventBus.off('player:stealthChanged', onStealth);
      eventBus.off('mission:objectiveUpdated', onObjectives);
      eventBus.off('inventory:changed', onInventory);
      eventBus.off('game:fpsUpdate', onFps);
    };
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const healthPct = (health / maxHealth) * 100;
  const energyPct = (energy / maxEnergy) * 100;
  const isTimeCritical = timeRemaining < 30;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* Top Left — Health & Energy */}
      <div className="absolute top-4 left-4 w-40 md:w-56">
        {/* Health bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-xs text-cyber-red tracking-wider">HEALTH</span>
            <span className="font-mono text-xs text-cyber-white-dim">{Math.ceil(health)}/{maxHealth}</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-bar-fill-health h-full rounded-full"
              style={{ width: `${healthPct}%` }}
              animate={{ width: `${healthPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Energy bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-xs text-cyber-purple tracking-wider">ENERGY</span>
            <span className="font-mono text-xs text-cyber-white-dim">{Math.ceil(energy)}/{maxEnergy}</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-bar-fill-energy h-full rounded-full"
              style={{ width: `${energyPct}%` }}
              animate={{ width: `${energyPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Stealth indicator */}
        <AnimatePresence>
          {isStealthMode && (
            <motion.div
              className="glass-panel px-3 py-1 flex items-center gap-2 mt-2 pointer-events-auto"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
              <span className="font-mono text-xs text-cyber-cyan tracking-wider">STEALTH ACTIVE</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Center — Timer */}
      <div className="absolute top-16 md:top-4 left-1/2 -translate-x-1/2">
        <motion.div
          className={`glass-panel px-6 py-2 text-center ${isTimeCritical ? 'border-cyber-red' : ''}`}
          animate={isTimeCritical ? {
            boxShadow: ['0 0 5px #ff3344, 0 0 10px rgba(255, 51, 68, 0.3)', '0 0 15px #ff3344, 0 0 30px rgba(255, 51, 68, 0.5)']
          } : {}}
          transition={{ duration: 0.5, repeat: isTimeCritical ? Infinity : 0, repeatType: 'reverse' }}
        >
          <span className="font-mono text-xs text-cyber-white-dim tracking-wider block">LOCKDOWN IN</span>
          <span className={`font-cyber text-2xl font-bold tracking-wider ${isTimeCritical ? 'neon-text-red' : 'neon-text-cyan'}`}>
            {formatTime(timeRemaining)}
          </span>
        </motion.div>
      </div>

      {/* Top Right — Objectives */}
      <div className="absolute top-24 md:top-4 right-2 md:right-4 w-48 md:w-64">
        <div className="glass-panel p-3">
          <h3 className="font-cyber text-xs text-cyber-cyan tracking-wider mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full" />
            OBJECTIVES
          </h3>
          <ul className="space-y-1.5">
            {objectives.map((obj) => (
              <li key={obj.id} className="flex items-start gap-2">
                <span className={`font-mono text-xs mt-0.5 ${obj.isCompleted ? 'text-cyber-green' : 'text-cyber-white-dim'}`}>
                  {obj.isCompleted ? '✓' : '○'}
                </span>
                <span className={`font-mono text-xs leading-tight ${obj.isCompleted ? 'text-cyber-green line-through opacity-60' : 'text-cyber-white'}`}>
                  {obj.description}
                  {obj.isOptional && <span className="text-cyber-yellow ml-1">(BONUS)</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Left — Controls reminder */}
      <div className="absolute bottom-4 left-4 hidden md:block">
        <div className="flex gap-3">
          {[
            { key: 'E', label: 'INTERACT' },
            { key: 'SPACE', label: 'DASH' },
            { key: 'SHIFT', label: 'STEALTH' },
            { key: 'ESC', label: 'PAUSE' },
          ].map((ctrl) => (
            <div key={ctrl.key} className="flex items-center gap-1">
              <span className="font-mono text-[10px] text-cyber-cyan bg-cyber-dark border border-cyber-cyan border-opacity-30 px-1.5 py-0.5 rounded">
                {ctrl.key}
              </span>
              <span className="font-mono text-[10px] text-cyber-white-dim">{ctrl.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Center — Inventory */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="flex gap-2">
          <AnimatePresence>
            {inventory.map((item) => (
              <motion.div
                key={item.id}
                className="glass-panel w-12 h-12 flex items-center justify-center relative border border-cyber-cyan border-opacity-50"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <span className="font-mono text-[10px] text-cyber-cyan uppercase tracking-tighter text-center leading-none">
                  {item.name}
                </span>
                {item.quantity > 1 && (
                  <span className="absolute -bottom-1 -right-1 font-mono text-[9px] bg-cyber-cyan text-cyber-black px-1 rounded">
                    x{item.quantity}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Right — FPS */}
      <div className="absolute bottom-4 right-4 hidden md:block">
        <span className="font-mono text-[10px] text-cyber-white-dim opacity-50">{fps} FPS</span>
      </div>

      <MobileControls />
    </div>
  );
}
