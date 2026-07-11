// ============================================================
// Cyber Heist 2077 — Hacking Puzzle Scene
// Overlay scene for interactive hacking minigames
// ============================================================

import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT, HACKING } from '../../constants';
import { HackingPuzzleConfig } from '../../types';
import eventBus from '../EventBus';
import { audioService } from '../../services/AudioService';

interface PuzzleNode {
  x: number;
  y: number;
  id: number;
  isInput: boolean;
  isOutput: boolean;
  isActive: boolean;
  connections: number[];
}

interface MemoryCell {
  value: number;
  isRevealed: boolean;
  x: number;
  y: number;
}

export class HackingScene extends Phaser.Scene {
  private puzzleConfig: HackingPuzzleConfig | null = null;
  private puzzleContainer!: Phaser.GameObjects.Container;
  private timerBar!: Phaser.GameObjects.Graphics;
  private timeRemaining: number = 0;
  private timeLimit: number = 0;
  private puzzleActive: boolean = false;
  private puzzleSolved: boolean = false;

  // Node connection puzzle
  private nodes: PuzzleNode[] = [];
  private selectedNode: number | null = null;
  private connectionLines: Phaser.GameObjects.Graphics | null = null;

  // Memory sequence puzzle
  private memoryCells: MemoryCell[] = [];
  private memorySequence: number[] = [];
  private playerSequence: number[] = [];
  private showingSequence: boolean = false;
  private memoryPhase: 'showing' | 'input' | 'checking' = 'showing';

  // Pattern match puzzle
  private patternGrid: number[][] = [];
  private targetPattern: number[] = [];
  private selectedPattern: number[] = [];
  private patternScrollOffset: number = 0;

  constructor() {
    super({ key: 'HackingScene' });
  }

  init(data: { config: HackingPuzzleConfig }): void {
    this.puzzleConfig = data.config;
    this.puzzleSolved = false;
    this.puzzleActive = false;
    this.nodes = [];
    this.selectedNode = null;
    this.memoryCells = [];
    this.memorySequence = [];
    this.playerSequence = [];
    this.patternGrid = [];
    this.targetPattern = [];
    this.selectedPattern = [];
    this.patternScrollOffset = 0;
  }

  create(): void {
    if (!this.puzzleConfig) return;

    const { width: sw, height: sh } = this.scale;

    // Dark overlay
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.7);
    bg.fillRect(0, 0, sw, sh);

    // Puzzle container (centered panel)
    const panelWidth = 500;
    const panelHeight = 400;
    const px = (sw - panelWidth) / 2;
    const py = (sh - panelHeight) / 2;

    // Panel background with glassmorphism
    const panel = this.add.graphics();
    panel.fillStyle(0x0d0d1a, 0.9);
    panel.fillRoundedRect(px, py, panelWidth, panelHeight, 8);
    panel.lineStyle(1, COLORS.CYAN, 0.4);
    panel.strokeRoundedRect(px, py, panelWidth, panelHeight, 8);

    // Inner glow
    panel.lineStyle(1, COLORS.CYAN, 0.1);
    panel.strokeRoundedRect(px + 2, py + 2, panelWidth - 4, panelHeight - 4, 7);

    // Title
    const titleText = this.getPuzzleTitle();
    this.add.text(sw / 2, py + 25, titleText, {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '18px',
      color: '#00f0ff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setShadow(0, 0, '#00f0ff', 5, true, true);

    // Difficulty indicator
    const diffText = '■'.repeat(this.puzzleConfig.difficulty) + '□'.repeat(5 - this.puzzleConfig.difficulty);
    this.add.text(sw / 2, py + 50, `DIFFICULTY: ${diffText}`, {
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '12px',
      color: '#8888aa',
    }).setOrigin(0.5);

    // Timer bar
    this.timeLimit = HACKING.BASE_TIME + (HACKING.TIME_PER_DIFFICULTY * this.puzzleConfig.difficulty);
    this.timeRemaining = this.timeLimit;
    this.timerBar = this.add.graphics();
    this.drawTimerBar(px + 20, py + panelHeight - 30, panelWidth - 40);

    // Instructions
    this.add.text(sw / 2, py + panelHeight - 45, 'ESC to abort | Complete the puzzle before time runs out', {
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '10px',
      color: '#555577',
    }).setOrigin(0.5);

    // Build the specific puzzle
    this.puzzleContainer = this.add.container(px + 20, py + 70);

    switch (this.puzzleConfig.type) {
      case 'nodeConnection':
        this.buildNodeConnectionPuzzle(panelWidth - 40, panelHeight - 130);
        break;
      case 'memorySequence':
        this.buildMemorySequencePuzzle(panelWidth - 40, panelHeight - 130);
        break;
      case 'patternMatch':
        this.buildPatternMatchPuzzle(panelWidth - 40, panelHeight - 130);
        break;
    }

    // ESC to abort
    this.input.keyboard!.on('keydown-ESC', () => {
      this.endPuzzle(false);
    });

    this.puzzleActive = true;
  }

  private getPuzzleTitle(): string {
    switch (this.puzzleConfig?.type) {
      case 'nodeConnection': return '// NODE CONNECTION';
      case 'memorySequence': return '// MEMORY SEQUENCE';
      case 'patternMatch': return '// PATTERN MATCH';
      default: return '// HACK';
    }
  }

  // ============================================================
  // Node Connection Puzzle
  // Connect the input node to the output node through intermediaries
  // ============================================================
  private buildNodeConnectionPuzzle(width: number, height: number): void {
    const difficulty = this.puzzleConfig?.difficulty ?? 1;
    const nodeCount = HACKING.MIN_NODES + difficulty;
    const gfx = this.add.graphics();
    this.connectionLines = this.add.graphics();
    this.puzzleContainer.add(gfx);
    this.puzzleContainer.add(this.connectionLines);

    // Generate node positions
    const margin = 30;
    for (let i = 0; i < nodeCount; i++) {
      const node: PuzzleNode = {
        x: margin + Math.random() * (width - margin * 2),
        y: margin + Math.random() * (height - margin * 3),
        id: i,
        isInput: i === 0,
        isOutput: i === nodeCount - 1,
        isActive: i === 0,
        connections: [],
      };
      this.nodes.push(node);
    }

    // Ensure a valid path exists by creating a chain
    for (let i = 0; i < nodeCount - 1; i++) {
      this.nodes[i].connections.push(i + 1);
      this.nodes[i + 1].connections.push(i);
    }

    // Add some extra connections for complexity
    for (let i = 0; i < difficulty; i++) {
      const a = Math.floor(Math.random() * (nodeCount - 2)) + 1;
      const b = Math.floor(Math.random() * (nodeCount - 2)) + 1;
      if (a !== b && !this.nodes[a].connections.includes(b)) {
        this.nodes[a].connections.push(b);
        this.nodes[b].connections.push(a);
      }
    }

    this.drawNodes(gfx);

    // Make nodes clickable
    for (const node of this.nodes) {
      const zone = this.add.zone(0, 0, 30, 30)
        .setPosition(node.x, node.y)
        .setInteractive({ useHandCursor: true });
      this.puzzleContainer.add(zone);

      zone.on('pointerdown', () => {
        this.handleNodeClick(node.id, gfx);
      });
    }
  }

  private handleNodeClick(nodeId: number, gfx: Phaser.GameObjects.Graphics): void {
    if (!this.puzzleActive || this.puzzleSolved) return;

    const node = this.nodes[nodeId];

    if (this.selectedNode === null) {
      if (node.isActive) {
        this.selectedNode = nodeId;
      }
    } else {
      const selectedNodeObj = this.nodes[this.selectedNode];
      if (selectedNodeObj.connections.includes(nodeId) && !node.isActive) {
        node.isActive = true;
        this.selectedNode = null;
        this.drawNodes(gfx);

        if (node.isOutput) {
          this.puzzleSolved = true;
          this.time.delayedCall(500, () => this.endPuzzle(true));
        }
      } else {
        this.selectedNode = null;
      }
    }
  }

  private drawNodes(gfx: Phaser.GameObjects.Graphics): void {
    gfx.clear();

    // Draw connections
    for (const node of this.nodes) {
      for (const connId of node.connections) {
        const other = this.nodes[connId];
        const bothActive = node.isActive && other.isActive;
        gfx.lineStyle(bothActive ? 2 : 1, bothActive ? COLORS.CYAN : COLORS.WHITE_DIM, bothActive ? 0.8 : 0.2);
        gfx.lineBetween(node.x, node.y, other.x, other.y);
      }
    }

    // Draw nodes
    for (const node of this.nodes) {
      const color = node.isInput ? COLORS.GREEN :
                    node.isOutput ? COLORS.MAGENTA :
                    node.isActive ? COLORS.CYAN : COLORS.WHITE_DIM;
      const alpha = node.isActive ? 1 : 0.4;

      gfx.fillStyle(color, alpha);
      gfx.fillCircle(node.x, node.y, node.isInput || node.isOutput ? 12 : 8);
      gfx.lineStyle(1, color, alpha * 0.6);
      gfx.strokeCircle(node.x, node.y, (node.isInput || node.isOutput ? 12 : 8) + 3);
    }
  }

  // ============================================================
  // Memory Sequence Puzzle
  // Watch the sequence, then repeat it
  // ============================================================
  private buildMemorySequencePuzzle(width: number, height: number): void {
    const difficulty = this.puzzleConfig?.difficulty ?? 1;
    const sequenceLength = HACKING.MEMORY_MIN_LENGTH + difficulty;
    const gridSize = 3;
    const cellSize = 60;
    const gap = 10;
    const startX = (width - (gridSize * (cellSize + gap) - gap)) / 2;
    const startY = (height - (gridSize * (cellSize + gap) - gap)) / 2;

    const gfx = this.add.graphics();
    this.puzzleContainer.add(gfx);

    // Create grid cells
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellX = startX + col * (cellSize + gap);
        const cellY = startY + row * (cellSize + gap);
        const cellId = row * gridSize + col;

        this.memoryCells.push({
          value: cellId,
          isRevealed: false,
          x: cellX,
          y: cellY,
        });

        const zone = this.add.zone(0, 0, cellSize, cellSize)
          .setPosition(cellX + cellSize / 2, cellY + cellSize / 2)
          .setInteractive({ useHandCursor: true });
        this.puzzleContainer.add(zone);

        zone.on('pointerdown', () => {
          if (this.memoryPhase !== 'input' || !this.puzzleActive) return;
          this.handleMemoryInput(cellId, gfx, cellSize);
        });
      }
    }

    // Generate random sequence
    this.memorySequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      this.memorySequence.push(Math.floor(Math.random() * (gridSize * gridSize)));
    }

    // Status text
    const statusText = this.add.text(width / 2, startY - 20, 'WATCH THE SEQUENCE', {
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '14px',
      color: '#00f0ff',
    }).setOrigin(0.5);
    this.puzzleContainer.add(statusText);

    // Draw initial grid
    this.drawMemoryGrid(gfx, cellSize);

    // Show sequence
    this.showingSequence = true;
    this.memoryPhase = 'showing';
    this.playerSequence = [];

    this.showMemorySequence(gfx, cellSize, statusText, 0);
  }

  private showMemorySequence(
    gfx: Phaser.GameObjects.Graphics,
    cellSize: number,
    statusText: Phaser.GameObjects.Text,
    index: number
  ): void {
    if (index >= this.memorySequence.length) {
      this.memoryPhase = 'input';
      statusText.setText('YOUR TURN - REPEAT THE SEQUENCE');
      statusText.setColor('#00ff66');
      this.drawMemoryGrid(gfx, cellSize);
      return;
    }

    const cellId = this.memorySequence[index];
    this.memoryCells[cellId].isRevealed = true;
    this.drawMemoryGrid(gfx, cellSize);

    this.time.delayedCall(600, () => {
      this.memoryCells[cellId].isRevealed = false;
      this.drawMemoryGrid(gfx, cellSize);

      this.time.delayedCall(300, () => {
        this.showMemorySequence(gfx, cellSize, statusText, index + 1);
      });
    });
  }

  private handleMemoryInput(cellId: number, gfx: Phaser.GameObjects.Graphics, cellSize: number): void {
    this.playerSequence.push(cellId);

    // Flash the cell
    this.memoryCells[cellId].isRevealed = true;
    this.drawMemoryGrid(gfx, cellSize);
    this.time.delayedCall(200, () => {
      this.memoryCells[cellId].isRevealed = false;
      this.drawMemoryGrid(gfx, cellSize);
    });

    const idx = this.playerSequence.length - 1;
    if (this.playerSequence[idx] !== this.memorySequence[idx]) {
      // Wrong!
      this.puzzleActive = false;
      this.time.delayedCall(500, () => this.endPuzzle(false));
      return;
    }

    if (this.playerSequence.length === this.memorySequence.length) {
      // Correct!
      this.puzzleSolved = true;
      this.time.delayedCall(500, () => this.endPuzzle(true));
    }
  }

  private drawMemoryGrid(gfx: Phaser.GameObjects.Graphics, cellSize: number): void {
    gfx.clear();
    for (const cell of this.memoryCells) {
      const color = cell.isRevealed ? COLORS.CYAN : COLORS.WHITE_DIM;
      const alpha = cell.isRevealed ? 0.8 : 0.15;

      gfx.fillStyle(color, alpha);
      gfx.fillRoundedRect(cell.x, cell.y, cellSize, cellSize, 4);
      gfx.lineStyle(1, color, cell.isRevealed ? 0.9 : 0.3);
      gfx.strokeRoundedRect(cell.x, cell.y, cellSize, cellSize, 4);
    }
  }

  // ============================================================
  // Pattern Match Puzzle
  // Select cells matching the displayed pattern
  // ============================================================
  private buildPatternMatchPuzzle(width: number, height: number): void {
    const difficulty = this.puzzleConfig?.difficulty ?? 1;
    const gridSize = 4 + Math.floor(difficulty / 2);
    const maxCellWidth = (width - 40) / gridSize;
    const maxCellHeight = (height - 40) / gridSize;
    const cellSize = Math.min(40, Math.min(maxCellWidth, maxCellHeight));
    const gap = 4;
    const totalGridSize = gridSize * (cellSize + gap) - gap;
    const startX = (width - totalGridSize) / 2;
    const startY = Math.max(35, (height - totalGridSize) / 2 + 15);

    const gfx = this.add.graphics();
    this.puzzleContainer.add(gfx);

    // Generate target pattern (random cells that need to be selected)
    const totalCells = gridSize * gridSize;
    const patternSize = 3 + difficulty;
    this.targetPattern = [];

    while (this.targetPattern.length < patternSize) {
      const cell = Math.floor(Math.random() * totalCells);
      if (!this.targetPattern.includes(cell)) {
        this.targetPattern.push(cell);
      }
    }

    this.selectedPattern = [];

    // Build grid
    this.patternGrid = [];
    for (let row = 0; row < gridSize; row++) {
      this.patternGrid[row] = [];
      for (let col = 0; col < gridSize; col++) {
        const cellId = row * gridSize + col;
        const cellX = startX + col * (cellSize + gap);
        const cellY = startY + row * (cellSize + gap);
        this.patternGrid[row][col] = cellId;

        const zone = this.add.zone(0, 0, cellSize, cellSize)
          .setPosition(cellX + cellSize / 2, cellY + cellSize / 2)
          .setInteractive({ useHandCursor: true });
        this.puzzleContainer.add(zone);

        zone.on('pointerdown', () => {
          if (!this.puzzleActive) return;
          this.handlePatternClick(cellId, gfx, gridSize, cellSize, gap, startX, startY);
        });
      }
    }

    // Show the target pattern briefly
    const statusText = this.add.text(width / 2, 15, 'MEMORIZE THIS PATTERN', {
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '14px',
      color: '#ff00aa',
    }).setOrigin(0.5);
    this.puzzleContainer.add(statusText);

    // Draw grid with target highlighted
    this.drawPatternGrid(gfx, gridSize, cellSize, gap, startX, startY, true);

    // Hide pattern after delay
    this.time.delayedCall(2000 + difficulty * 500, () => {
      statusText.setText('SELECT THE MATCHING CELLS');
      statusText.setColor('#00f0ff');
      this.drawPatternGrid(gfx, gridSize, cellSize, gap, startX, startY, false);
    });
  }

  private handlePatternClick(
    cellId: number,
    gfx: Phaser.GameObjects.Graphics,
    gridSize: number,
    cellSize: number,
    gap: number,
    startX: number,
    startY: number
  ): void {
    if (this.selectedPattern.includes(cellId)) {
      this.selectedPattern = this.selectedPattern.filter(c => c !== cellId);
    } else {
      this.selectedPattern.push(cellId);
    }

    this.drawPatternGrid(gfx, gridSize, cellSize, gap, startX, startY, false);

    // Check if complete
    if (this.selectedPattern.length === this.targetPattern.length) {
      const correct = this.targetPattern.every(c => this.selectedPattern.includes(c));
      if (correct) {
        this.puzzleSolved = true;
        this.time.delayedCall(500, () => this.endPuzzle(true));
      } else {
        this.time.delayedCall(500, () => this.endPuzzle(false));
      }
    }
  }

  private drawPatternGrid(
    gfx: Phaser.GameObjects.Graphics,
    gridSize: number,
    cellSize: number,
    gap: number,
    startX: number,
    startY: number,
    showTarget: boolean
  ): void {
    gfx.clear();
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellId = row * gridSize + col;
        const x = startX + col * (cellSize + gap);
        const y = startY + row * (cellSize + gap);

        const isTarget = this.targetPattern.includes(cellId);
        const isSelected = this.selectedPattern.includes(cellId);

        let color: number = COLORS.WHITE_DIM;
        let alpha: number = 0.15;

        if (showTarget && isTarget) {
          color = COLORS.MAGENTA;
          alpha = 0.7;
        } else if (isSelected) {
          color = COLORS.CYAN;
          alpha = 0.6;
        }

        gfx.fillStyle(color, alpha);
        gfx.fillRoundedRect(x, y, cellSize, cellSize, 3);
        gfx.lineStyle(1, color, alpha + 0.2);
        gfx.strokeRoundedRect(x, y, cellSize, cellSize, 3);
      }
    }
  }

  // ============================================================
  // Common
  // ============================================================
  private drawTimerBar(x: number, y: number, width: number): void {
    this.timerBar.clear();
    const pct = this.timeRemaining / this.timeLimit;

    // Background
    this.timerBar.fillStyle(0x1a1a3e, 0.5);
    this.timerBar.fillRoundedRect(x, y, width, 8, 3);

    // Fill
    const fillColor = pct > 0.5 ? COLORS.CYAN : pct > 0.25 ? COLORS.ORANGE : COLORS.RED;
    this.timerBar.fillStyle(fillColor, 0.8);
    this.timerBar.fillRoundedRect(x, y, width * pct, 8, 3);
  }

  private endPuzzle(success: boolean): void {
    this.puzzleActive = false;

    // Flash screen & sound
    if (success) {
      audioService.playHackingSuccess();
      this.cameras.main.flash(200, 0, 255, 102);
    } else {
      audioService.playHackingFail();
      this.cameras.main.flash(200, 255, 51, 68);
    }

    this.time.delayedCall(400, () => {
      eventBus.emit('hacking:complete', { success });
      this.scene.stop();
    });
  }

  update(_time: number, delta: number): void {
    if (!this.puzzleActive || this.puzzleSolved) return;

    // Update timer
    this.timeRemaining -= delta / 1000;
    const { width: sw, height: sh } = this.scale;
    const px = (sw - 500) / 2;
    const panelHeight = 400;
    const py = (sh - panelHeight) / 2;
    this.drawTimerBar(px + 20, py + panelHeight - 30, 460);

    if (this.timeRemaining <= 0) {
      this.endPuzzle(false);
    }
  }
}
