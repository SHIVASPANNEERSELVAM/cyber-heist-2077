// ============================================================
// Cyber Heist 2077 — Settings Menu
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameSettings } from '../../types';

interface SettingsProps {
  settings: GameSettings;
  onSave: (settings: GameSettings) => void;
  onBack: () => void;
}

export function Settings({ settings, onSave, onBack }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<GameSettings>({ ...settings });

  const handleChange = (key: keyof GameSettings, value: number | boolean | string) => {
    setLocalSettings((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto-unmute if a volume slider is increased
      if ((key === 'masterVolume' || key === 'musicVolume' || key === 'sfxVolume') && (value as number) > 0) {
        updated.isMuted = false;
      }
      return updated;
    });
  };

  const handleSave = () => {
    onSave(localSettings);
    onBack();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-cyber-black bg-opacity-90" />

      <motion.div
        className="glass-panel p-8 w-96 relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-cyber text-2xl text-center neon-text-cyan mb-6 tracking-wider">
          SETTINGS
        </h2>
        <div className="cyber-divider mb-6" />

        <div className="space-y-5">
          {/* Master Volume */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-mono text-xs text-cyber-white-dim tracking-wider">MASTER VOLUME</label>
              <span className="font-mono text-xs text-cyber-cyan">{Math.round(localSettings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(localSettings.masterVolume * 100)}
              onChange={(e) => handleChange('masterVolume', parseInt(e.target.value) / 100)}
              className="w-full accent-cyber-cyan h-1 bg-cyber-dark rounded-full cursor-pointer"
            />
          </div>

          {/* Music Volume */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-mono text-xs text-cyber-white-dim tracking-wider">MUSIC</label>
              <span className="font-mono text-xs text-cyber-cyan">{Math.round(localSettings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(localSettings.musicVolume * 100)}
              onChange={(e) => handleChange('musicVolume', parseInt(e.target.value) / 100)}
              className="w-full accent-cyber-cyan h-1 bg-cyber-dark rounded-full cursor-pointer"
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-mono text-xs text-cyber-white-dim tracking-wider">SFX</label>
              <span className="font-mono text-xs text-cyber-cyan">{Math.round(localSettings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(localSettings.sfxVolume * 100)}
              onChange={(e) => handleChange('sfxVolume', parseInt(e.target.value) / 100)}
              className="w-full accent-cyber-cyan h-1 bg-cyber-dark rounded-full cursor-pointer"
            />
          </div>

          {/* Mute */}
          <div className="flex justify-between items-center">
            <label className="font-mono text-xs text-cyber-white-dim tracking-wider">MUTE ALL</label>
            <button
              className={`w-12 h-6 rounded-full border transition-colors duration-200 ${
                localSettings.isMuted
                  ? 'bg-cyber-red border-cyber-red'
                  : 'bg-cyber-dark border-cyber-cyan border-opacity-30'
              }`}
              onClick={() => handleChange('isMuted', !localSettings.isMuted)}
            >
              <div
                className={`w-4 h-4 rounded-full bg-cyber-white transition-transform duration-200 mx-0.5 ${
                  localSettings.isMuted ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Screen Shake */}
          <div className="flex justify-between items-center">
            <label className="font-mono text-xs text-cyber-white-dim tracking-wider">SCREEN SHAKE</label>
            <button
              className={`w-12 h-6 rounded-full border transition-colors duration-200 ${
                localSettings.screenShake
                  ? 'bg-cyber-cyan bg-opacity-30 border-cyber-cyan'
                  : 'bg-cyber-dark border-cyber-cyan border-opacity-30'
              }`}
              onClick={() => handleChange('screenShake', !localSettings.screenShake)}
            >
              <div
                className={`w-4 h-4 rounded-full bg-cyber-white transition-transform duration-200 mx-0.5 ${
                  localSettings.screenShake ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Graphics Quality */}
          <div>
            <label className="font-mono text-xs text-cyber-white-dim tracking-wider block mb-2">GRAPHICS</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((quality) => (
                <button
                  key={quality}
                  className={`flex-1 font-mono text-xs py-2 rounded border transition-colors duration-200 ${
                    localSettings.graphicsQuality === quality
                      ? 'bg-cyber-cyan bg-opacity-20 border-cyber-cyan text-cyber-cyan'
                      : 'bg-cyber-dark border-cyber-cyan border-opacity-20 text-cyber-white-dim'
                  }`}
                  onClick={() => handleChange('graphicsQuality', quality)}
                >
                  {quality.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="cyber-divider my-6" />

        <div className="flex gap-3">
          <button className="cyber-button text-sm flex-1" onClick={handleSave}>
            SAVE
          </button>
          <button className="cyber-button-magenta text-sm flex-1" onClick={onBack}>
            CANCEL
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
