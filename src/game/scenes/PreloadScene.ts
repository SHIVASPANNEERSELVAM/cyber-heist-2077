// ============================================================
// Cyber Heist 2077 — Preload Scene (Animated Loading Screen)
// ============================================================

import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../../constants';
import eventBus from '../EventBus';

export class PreloadScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private percentText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private particles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number; size: number }> = [];
  private scanlineY: number = 0;
  private particleGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  create(): void {
    const { width: sw, height: sh } = this.scale;
    const cx = sw / 2;
    const cy = sh / 2;

    // Background
    this.cameras.main.setBackgroundColor('#0a0a0f');

    // Create floating particles
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * sw,
        y: Math.random() * sh,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    // Progress box
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x1a1a3e, 0.5);
    this.progressBox.fillRoundedRect(cx - 170, cy + 20, 340, 30, 4);
    this.progressBox.lineStyle(1, COLORS.CYAN, 0.3);
    this.progressBox.strokeRoundedRect(cx - 170, cy + 20, 340, 30, 4);

    // Progress bar
    this.progressBar = this.add.graphics();

    // Title
    this.add.text(cx, cy - 80, 'CYBER HEIST', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '36px',
      color: '#00f0ff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setShadow(0, 0, '#00f0ff', 10, true, true);

    this.add.text(cx, cy - 40, '2 0 7 7', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '24px',
      color: '#ff00aa',
      fontStyle: 'bold',
      letterSpacing: 12,
    }).setOrigin(0.5).setShadow(0, 0, '#ff00aa', 8, true, true);

    // Loading text
    this.loadingText = this.add.text(cx, cy + 5, 'INITIALIZING SYSTEMS...', {
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '14px',
      color: '#8888aa',
    }).setOrigin(0.5);

    // Percent text
    this.percentText = this.add.text(cx, cy + 35, '0%', {
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '14px',
      color: '#00f0ff',
    }).setOrigin(0.5);

    // Status text
    this.statusText = this.add.text(cx, cy + 65, 'Loading assets...', {
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '11px',
      color: '#555577',
    }).setOrigin(0.5);

    // Decorative lines
    const lineGfx = this.add.graphics();
    lineGfx.lineStyle(1, COLORS.CYAN, 0.15);
    lineGfx.lineBetween(cx - 200, cy - 55, cx + 200, cy - 55);
    lineGfx.lineBetween(cx - 200, cy + 80, cx + 200, cy + 80);

    // Corner decorations
    this.drawCorner(lineGfx, cx - 200, cy - 100, 1, 1);
    this.drawCorner(lineGfx, cx + 200, cy - 100, -1, 1);
    this.drawCorner(lineGfx, cx - 200, cy + 95, 1, -1);
    this.drawCorner(lineGfx, cx + 200, cy + 95, -1, -1);

    // Create particle graphics (reused in update)
    this.particleGraphics = this.add.graphics();
    this.particleGraphics.setDepth(1000);

    // Simulate loading with animated progress
    this.simulateLoading();
  }

  private drawCorner(g: Phaser.GameObjects.Graphics, x: number, y: number, dx: number, dy: number): void {
    g.lineStyle(1, COLORS.CYAN, 0.3);
    g.lineBetween(x, y, x + 15 * dx, y);
    g.lineBetween(x, y, x, y + 15 * dy);
  }

  private simulateLoading(): void {
    const statusMessages = [
      'Decrypting neural interface...',
      'Calibrating stealth systems...',
      'Loading facility blueprints...',
      'Synchronizing hacking modules...',
      'Initializing combat protocols...',
      'Connecting to mission control...',
      'Loading AI core signatures...',
      'Systems ready.',
    ];

    let progress = 0;
    const totalSteps = 100;
    const { width: sw, height: sh } = this.scale;
    const cx = sw / 2;
    const cy = sh / 2;

    const timer = this.time.addEvent({
      delay: 25,
      repeat: totalSteps - 1,
      callback: () => {
        progress++;
        const pct = progress / totalSteps;

        // Update progress bar
        this.progressBar.clear();
        this.progressBar.fillStyle(COLORS.CYAN, 0.8);
        this.progressBar.fillRoundedRect(cx - 166, cy + 24, 332 * pct, 22, 3);

        // Glow effect
        this.progressBar.fillStyle(COLORS.CYAN, 0.2);
        this.progressBar.fillRoundedRect(cx - 166, cy + 22, 332 * pct, 26, 4);

        this.percentText.setText(`${progress}%`);

        // Update status message
        const msgIndex = Math.floor(pct * (statusMessages.length - 1));
        this.statusText.setText(statusMessages[msgIndex]);

        if (progress >= totalSteps) {
          this.percentText.setText('100%');
          this.statusText.setText('Systems ready. Awaiting directive.');
          this.loadingText.setText('INITIALIZATION COMPLETE');
          this.loadingText.setColor('#00ff66');

          this.time.delayedCall(600, () => {
            this.cameras.main.fadeOut(400, 10, 10, 15);
            this.cameras.main.once('camerafadeoutcomplete', () => {
              eventBus.emit('game:screenChanged', { screen: 'mainMenu' });
            });
          });
        }
      },
    });
  }

  update(): void {
    // Animate floating particles (reuse single graphics object)
    this.particleGraphics.clear();

    const sw = this.scale.width;
    const sh = this.scale.height;

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = sw;
      if (p.x > sw) p.x = 0;
      if (p.y < 0) p.y = sh;
      if (p.y > sh) p.y = 0;

      this.particleGraphics.fillStyle(COLORS.CYAN, p.alpha);
      this.particleGraphics.fillCircle(p.x, p.y, p.size);
    }

    // Animate scanline
    this.scanlineY += 1;
    if (this.scanlineY > sh) this.scanlineY = 0;
    this.particleGraphics.fillStyle(COLORS.CYAN, 0.02);
    this.particleGraphics.fillRect(0, this.scanlineY, sw, 2);
  }
}
