import { createGame } from './core/Game.js';
import { testSeeds } from './debug/TestScenarios.js';

const params = new URLSearchParams(window.location.search);
const seedParam = params.get('seed');
const seed = seedParam ? Number(seedParam) : Math.floor(Math.random() * 1_000_000_000);

window.__GAME__ = createGame('game-container', seed);
window.__SEEDS__ = testSeeds;
console.log('[Neon Frontier] Running with seed:', seed);
console.log('Use F3 debug overlay, F5/F6/F7/F8 debug commands.');
