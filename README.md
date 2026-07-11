# Cyber Heist 2077

A production-ready, browser-playable stealth action game. Infiltrate futuristic facilities, hack security systems, steal AI cores, avoid guards, and escape before lockdown!

## How to Play

### Deployed Game URL
👉 cyber-heist-2077.vercel.app

### Controls
* **W, A, S, D** or **Arrow Keys**: Move
* **Space**: Dash
* **Shift**: Toggle Stealth Mode (drains energy)
* **E / Left Click / Tap**: Interact (Hack terminals, disable cameras, open doors)
* **ESC**: Pause Game / Abort Hack

### Objective
Navigate through 5 handcrafted levels. Avoid security cameras, laser tripwires, patrolling guards, and hunter drones. Find the terminal to unlock the blast doors, steal the AI Core, and reach the exit. Earn credits to spend at the Cybernetics Clinic to upgrade your stats.

---

## Hackathon Submission Details

### What was built during the 24-hour window?
**Everything.** This entire game, including its custom engine integration, React UI, physics handling, and procedural asset generation, was built from scratch during the hackathon window.
* **Core Game Loop**: 5 distinct levels with increasing difficulty, stealth mechanics, line-of-sight detection, and enemy AI pathfinding.
* **Procedural Assets**: ZERO external image or audio files were used! All pixel art, neon glow effects, tilemaps, and synthwave soundtracks are generated procedurally at runtime using HTML5 Canvas graphics and the Web Audio API.
* **React UI HUD**: Complex glassmorphic React components layered over the Phaser canvas for menus, settings, upgrades, and hacking minigames.
* **Hacking Minigames**: 3 unique interactive React-based puzzle minigames (Node Connection, Memory Sequence, Pattern Match) integrated directly into the gameplay loop.


### Credits & Prior Work
* **Engine**: [Phaser 3](https://phaser.io/) for physics, rendering, and game loop.
* **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/) for UI and tooling.
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) for HUD styling.
* **Animations**: [Framer Motion](https://www.framer.com/motion/) for React UI transitions.
* *No pre-existing game templates, asset packs, or starter kits were used.*

---

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Deployment
This project includes a `vercel.json` configuration. Simply import the repository into Vercel and it will automatically build and deploy the React single-page application.
