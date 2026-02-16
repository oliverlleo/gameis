# RUN_LOCAL

## Requirements
- Any static server (no backend needed).
- Recommended: Python 3.x.

## Steps
1. Open terminal in project root (`/game`).
2. Start static server:

```bash
python -m http.server 8000
```

3. Open browser:
- `http://localhost:8000`

## Optional deterministic seed
Pass seed in URL:
- `http://localhost:8000/?seed=734001`

## Save file
- Stored in LocalStorage key: `neon_frontier_save_v2`
- Autosave every 20 seconds + manual debug save (F8).

## Troubleshooting
- If audio is silent, click inside the page once (browser audio unlock).
- If controls feel wrong, check `ESC > Rebind Controls`.
- To reset save, clear site LocalStorage.
