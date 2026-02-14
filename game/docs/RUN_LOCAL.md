# Run Instructions

The game is built with vanilla HTML5/JS and Phaser 3 (ES Modules). No build step is required (no Webpack, Vite, etc.).

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge).
- Python 3 (or any static file server like `http-server`).

## Steps

1. Open a terminal in the root `game/` folder.
2. Run a simple HTTP server:
   ```bash
   python -m http.server
   ```
   Or with Node:
   ```bash
   npx http-server .
   ```
3. Open `http://localhost:8000` in your browser.

## Offline Mode

To run completely offline:
1. Download `phaser.min.js` (v3.60+) from https://phaser.io/download/stable
2. Place it in `game/libs/phaser.min.js`.
3. Update `index.html` to point to the local file instead of the CDN.
