# Kabam

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A cooperative, multiplayer, browser-based roguelite set in an isometric world.

![Kabam Gameplay Screenshot](./docs/kabam_gameplay.png)
*(Note: You will need to create this screenshot yourself and place it in a `/docs` folder for this image to display)*

## About The Project

Kabam is a cooperative, multiplayer, browser-based roguelite built with Phaser 3. Players team up to survive increasingly difficult waves of enemies by using a diverse arsenal of weapons and by strategically building walls to control the battlefield. Each session is unique, with players receiving random perks that alter their playstyle, forcing constant adaptation and teamwork to achieve a high score.

This project is currently in the v1.0 development phase, focusing on core mechanics and a stable single-player prototype.

### Core Features

*   **Isometric Action Combat:** Fast-paced combat on a 2.5D grid, emphasizing movement, aiming, and tactical ability usage.
*   **Strategic Construction:** Players use resources to build grid-based walls, dynamically altering the battlefield to funnel enemies and create defensive chokepoints.
*   **High Replayability (Roguelite):** Procedurally generated enemy waves and boss encounters ensure no two games are the same.
*   **Cooperative Survival:** Success depends on teamwork and navigating a shared, chaotic battlefield. (Multiplayer is a post-v1 goal).
*   **Physics-Driven Chaos:** Core mechanics like universal projectile damage and knockback create an unpredictable and emergent gameplay experience.

### Built With

*   [Phaser 3](https://phaser.io/) - A fast, free, and fun open-source HTML5 game framework.
*   JavaScript (ES6+)
*   HTML5

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need a local web server to run the game, as browsers have security restrictions on loading files directly from the local filesystem. The two easiest options are Node.js or Python.

*   **Node.js** (v14 or higher recommended)
*   **Python 3**

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username/kabam-phaser.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd kabam-phaser
    ```
3.  **Start a local web server.** Choose one of the options below:

    *   **Option A (Using Node.js):** The `npx` command runs a package without a global installation.
        ```sh
        npx http-server
        ```

    *   **Option B (Using Python 3):**
        ```sh
        python3 -m http.server
        ```

4.  **Open the game:** Open your web browser and navigate to `http://localhost:8080` (for `http-server`) or `http://localhost:8000` (for Python). The correct address will be shown in your terminal.

## Controls

The game supports both Gamepad (Xbox-style) and Keyboard/Mouse controls. Gamepad is prioritized if connected.

| Action         | Keyboard/Mouse      | Gamepad (Xbox)    |
| :------------- | :------------------ | :---------------- |
| **Move**       | `W`, `A`, `S`, `D`  | Left Stick        |
| **Aim**        | Mouse Movement      | Right Stick       |
| **Fire Weapon**| Left Mouse Button   | Right Trigger (RT)|
| **Build Wall** | `E` (Hold)          | `A` Button (Hold) |
| **Pointer Lock** | Click in Game Window | N/A |
| **Exit Pointer Lock** | `Esc` Key | N/A |

## Project Structure

The codebase is organized to be modular and configuration-driven.

```
/kabam-phaser/
│
├── assets/         # Game assets (sprites, sfx)
├── docs/           # Documentation images (like screenshots)
├── src/            # All JavaScript source code
│   ├── main.js     # Main game entry point, Phaser config
│   ├── config.js   # Centralized game variables & data tables
│   ├── scenes/     # Phaser scene files (Preloader, Game, UI)
│   ├── managers/   # High-level logic (WaveManager)
│   ├── objects/    # Game object classes (Player, Wall, Projectile)
│   ├── components/ # Reusable components (Health)
│   ├── enemies/    # Each file is a unique enemy type
│   ├── weapons/    # Each file is a unique weapon
│   └── perks/      # Each file is a unique perk
│
└── index.html      # The main HTML file
```

## Roadmap

This prototype represents v1.0. Future enhancements are planned as per the project's PRD:

*   **Player-Facing Custom Game Mode:** A UI for players to design their own scenarios.
*   **World-Altering Perks:** An event-driven perk system that can modify global game rules.
*   **Advanced Buildables:** Wall upgrading, placeable traps, and automated turrets.
*   **Full Multiplayer Integration.**

## License

Distributed under the MIT License. See `LICENSE` for more information.
