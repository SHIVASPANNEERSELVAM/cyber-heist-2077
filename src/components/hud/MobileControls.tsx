import React, { useState, useEffect, useRef } from 'react';
import eventBus from '../../game/EventBus';

export const MobileControls: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const baseRef = useRef<HTMLDivElement>(null);

  // Check if device supports touch
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024 || window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.target instanceof Element) e.target.setPointerCapture(e.pointerId);
    setJoystickActive(true);
    updateJoystick(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!joystickActive) return;
    updateJoystick(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.target instanceof Element) e.target.releasePointerCapture(e.pointerId);
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    eventBus.emit('joystick:move' as any, { x: 0, y: 0 });
  };

  const updateJoystick = (e: React.PointerEvent) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    
    const maxDistance = rect.width / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }
    
    setJoystickPos({ x: dx, y: dy });
    
    // Normalize to [-1, 1]
    const normX = dx / maxDistance;
    const normY = dy / maxDistance;
    eventBus.emit('joystick:move', { x: normX, y: normY });
  };

  const handleAction = (action: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    eventBus.emit('player:action', action);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      
      {/* Pause Button */}
      <div className="absolute top-4 right-4 pointer-events-auto touch-none">
        <button
          onPointerDown={() => {
            eventBus.emit('ui:pauseGame');
            eventBus.emit('game:screenChanged', { screen: 'paused' });
          }}
          className="w-10 h-10 rounded-lg bg-black/50 border border-cyan-400 text-cyan-200 font-mono font-bold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.3)] active:bg-cyan-500/30 active:scale-95 transition-all backdrop-blur-sm"
        >
          ||
        </button>
      </div>

      {/* Joystick Area */}
      <div className="absolute bottom-4 left-4 w-32 h-32 pointer-events-auto touch-none"
           onPointerDown={handlePointerDown}
           onPointerMove={handlePointerMove}
           onPointerUp={handlePointerUp}
           onPointerCancel={handlePointerUp}>
        {/* Joystick Base */}
        <div ref={baseRef} className="absolute inset-0 rounded-full border-2 border-cyan-500/30 bg-black/20 backdrop-blur-sm" />
        
        {/* Joystick Knob */}
        <div 
          className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 rounded-full bg-cyan-400/50 border border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-transform duration-75 ease-out"
          style={{ transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)` }}
        />
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-3 pointer-events-auto touch-none">
        <div className="flex gap-3 mr-4">
          {/* Stealth Button */}
          <button 
            onPointerDown={handleAction('stealth')}
            className="w-16 h-16 rounded-full bg-purple-500/30 border-2 border-purple-400 text-purple-200 font-mono font-bold text-xs flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] active:bg-purple-500/50 active:scale-95 transition-all"
          >
            STEALTH
          </button>
          
          {/* Dash Button */}
          <button 
            onPointerDown={handleAction('dash')}
            className="w-16 h-16 rounded-full bg-pink-500/30 border-2 border-pink-400 text-pink-200 font-mono font-bold text-xs flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)] active:bg-pink-500/50 active:scale-95 transition-all"
          >
            DASH
          </button>
        </div>
        
        {/* Interact Button (Larger) */}
        <button 
          onPointerDown={handleAction('interact')}
          className="w-20 h-20 rounded-full bg-cyan-500/30 border-2 border-cyan-400 text-cyan-200 font-mono font-bold text-sm flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] active:bg-cyan-500/50 active:scale-95 transition-all"
        >
          INTERACT
        </button>
      </div>

    </div>
  );
};
