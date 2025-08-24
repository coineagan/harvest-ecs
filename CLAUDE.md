# Tactical Turn-Based RPG - Development Context

## Project Overview

This is a tactical turn-based RPG built with:

- **Game Engine**: Phaser 3.90.0
- **Desktop Wrapper**: Electron 36.5.0
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 6.3.5
- **Unit Testing**: Vitest 3.2.4
- **E2E Testing**: Playwright 1.53.1
- **Code Quality**: ESLint 9.29.0, Prettier 3.5.3
- **CI/CD**: Husky 9.1.7

## Game Configuration

- **Resolution**: 1920x1080 (scaled to fit)
- **Background Color**: #1a1a2e
- **Renderer**: Phaser.AUTO
- **Scale Mode**: FIT with CENTER_BOTH

## Development Commands

```bash
# Install dependencies
npm install

# Development
npm run dev          # Start Vite dev server
npm run electron-dev # Start Electron with Vite

# Testing
npm run unit         # Run unit tests
npm run unit:watch   # Run unit tests in watch mode
npm run e2e          # Run E2E tests
npm run test         # Run all tests

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run typecheck    # TypeScript type checking

# Build
npm run build        # Build for production
npm run start        # Build and run Electron app
```

## Code Style

- **Tabs**: Yes (4 spaces width)
- **Semicolons**: No
- **Quotes**: Single
- **Trailing Comma**: ES5
- **Print Width**: 200
- **Arrow Parens**: Always
- **End of Line**: Auto

# How the game works

Here’s a detailed breakdown of how each folder interacts with the others which I want you to use for context when asked for help implementing features:

---

# Folder Roles & Interactions

### **1\. `components/`**

* Holds your **ECS-style components** — little bags of data that describe entities.

* Examples: `PositionComponent`, `HealthComponent`, `ConditionComponent`, `PassiveComponent`, `RelationshipComponent`.

* These don’t contain logic; they just describe *what an entity has or is*.

Interactions:

* **Used by systems** to decide what entities to process (e.g., `ConditionSystem` looks for entities with `ConditionComponent`).

* **Defined in terms of config/data** (e.g., a `PassiveComponent` references a `passives.json` entry).

* **Core/world** attaches components when entities spawn.

---

### **2\. `config/`**

* Stores **game-wide configuration values** and tunables.

* Examples: `constants.ts` (like map sizes, turn durations, UI scaling), `phaserConfig.ts`, maybe `balance.json` (numbers for XP curve, stamina regen).

Interactions:

* **Systems** read these to know how to scale behaviors (e.g., condition durations, XP progression).

* **Generators** use configs for map/world constraints (map width/height, biome thresholds).

* **Scenes** pull UI scaling/layout values from here to stay consistent.

---

### **3\. `core/`**

* The **glue** of your architecture — event bus, entity manager, ECS world, system scheduler, and possibly the `PhaserBridge`.

* Examples: `EventBus.ts`, `EntityManager.ts`, `World.ts`, `PhaserBridge.ts`.

Interactions:

* **Systems** register here to get updated each tick.

* **Scenes** call into `core` when they want to trigger game events (`EventBus.emit('PLAYER_MOVE', …)`).

* **Generators** and **data** flow through `core` when new entities/worlds are created.

---

### **4\. `data/`**

* Holds all **data-driven definitions** for abilities, passives, conditions, items, story arcs, etc.

* Examples:

  * `conditions.json` → `"poisoned", "sleep", "burning"`

  * `passives.json` → `"fire_resistance", "extra_damage_when_poisoned"`

  * `abilities.json`

  * `story.json`

Interactions:

* **Components** reference IDs from here (e.g., a `PassiveComponent` might store `["fire_resistance"]`).

* **Systems** load these definitions at runtime to decide how to apply effects.

* **Generators** may reference data to seed the world (e.g., story arcs, factions, conditions).

---

### **5\. `generators/`**

* Responsible for **procedural creation** of world, grid, and story.

* Examples:

  * `WorldGenerator.ts` (macro geography, continents, climates).

  * `GridGenerator.ts` (tile-based maps for dungeons/battles).

  * `StoryGenerator.ts` (questlines, branching events seeded from data).

Interactions:

* **Uses utils/** (algorithms like noise, pathfinding, Voronoi, etc.) for procedural content.

* **Creates components** and populates entities into the **world (core)**.

* **Reads data/** (conditions, factions, story templates) to guide generation.

---

### **6\. `scenes/`**

* Phaser **visual layers** and UI control.

* Examples: `WorldScene.ts`, `BattleScene.ts`, `UIScene.ts`, maybe `MainMenuScene.ts`.

Interactions:

* **Receives events** from `core/EventBus` (e.g., "entity moved", "condition applied") and reflects them visually.

* **Sends player actions** back into `core` (`EventBus.emit("PLAYER_ATTACK", { targetId })`).

* **Uses systems indirectly** via the bridge — doesn’t know game logic, just renders.

---

### **7\. `systems/`**

* Contain **all game rules/logic** for handling events and modifying components.

* Examples:

  * `ConditionSystem.ts`

  * `PassiveSystem.ts`

  * `RelationshipSystem.ts`

  * `CombatSystem.ts`

  * `StorySystem.ts`

Interactions:

* **Listen to events** from `core/EventBus`.

* **Mutate components** on entities (`HealthComponent.hp -= dmg`).

* **Trigger further events** for `scenes` to render.

* **Read from data/** to know how to apply an effect.

---

### **8\. `utils/`**

* All **support algorithms** and helper functions that aren’t ECS-specific.

* Examples:

  * `PerlinNoise.ts`, `Voronoi.ts`, `AStar.ts`, `FloodFill.ts`.

  * Math utilities, random number helpers, biome calculations.

Interactions:

* **Generators** use these heavily for map/world creation.

* **Systems** may use pathfinding or RNG from here (combat AI).

* **Scenes** might use geometry helpers for rendering overlays (like highlighting reachable tiles).

---

## **How it All Flows Together**

1. **Game bootstraps** → `core/World.ts` loads systems, initializes entities.

2. **Generators run** → build world \+ story \+ grid using `utils` \+ `data`, then register entities/components into `core`.

3. **Scenes start** → Phaser handles rendering. `PhaserBridge` syncs ECS entity state to sprites.

4. **Events flow** → Player clicks → `Scene` emits `PLAYER_ATTACK` → `EventBus` → `CombatSystem` → applies damage → `ConditionSystem` checks → `PassiveSystem` reacts → updates components → emits `DAMAGE_TAKEN`.

5. **Scenes update visuals** → `PhaserBridge` tells Phaser what to draw based on updated components.

---

This structure will **handle events cleanly** — because the EventBus and ECS ensure systems and scenes don’t directly depend on each other. Everything is modular and swappable.
