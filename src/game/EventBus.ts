// ============================================================
// Cyber Heist 2077 — Typed Event Bus
// React ↔ Phaser communication bridge
// ============================================================

import { GameEvents } from '../types';

type EventCallback<T> = T extends undefined ? () => void : (data: T) => void;

class EventBus {
  private listeners: Map<string, Set<Function>> = new Map();

  on<K extends keyof GameEvents>(event: K, callback: EventCallback<GameEvents[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off<K extends keyof GameEvents>(event: K, callback: EventCallback<GameEvents[K]>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit<K extends keyof GameEvents>(
    event: K,
    ...args: GameEvents[K] extends undefined ? [] : [GameEvents[K]]
  ): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          if (args.length > 0) {
            callback(args[0]);
          } else {
            callback();
          }
        } catch (error) {
          console.error(`EventBus error in handler for "${event}":`, error);
        }
      });
    }
  }

  removeAllListeners(event?: keyof GameEvents): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount(event: keyof GameEvents): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}

// Singleton instance
const eventBus = new EventBus();
export default eventBus;
