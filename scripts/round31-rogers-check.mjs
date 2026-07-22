// Round 31 item 3 (+ follow-up #3) — prove the Morgan Rogers windfall event
// actually fires, with real numbers. Uses the real engine module directly
// (no browser), so results reflect the actual shipped logic. Since the
// follow-up #3 change, rollWindfall() is a single flat-probability roll
// made once when a fresh window is created (gameReducer's mkFreshGame),
// not a per-action cumulative roll — so "one window" now literally means
// "one call".
import { rollWindfall } from '../src/engine/windfall.js';

const ITERATIONS = 1000;
let fired = 0;

for (let i = 0; i < ITERATIONS; i++) {
  const result = rollWindfall();
  if (result) fired++;
}

console.log('=== Single-roll-per-window fire rate ===');
console.log(`Windows simulated: ${ITERATIONS}`);
console.log(`Rogers fired: ${fired} (${(fired / ITERATIONS * 100).toFixed(1)}%)`);
console.log();

// Chance of seeing it within a handful of playthroughs
const TRIALS = 10000;
for (const tries of [3, 5, 10]) {
  let sawAtLeastOnce = 0;
  for (let t = 0; t < TRIALS; t++) {
    let saw = false;
    for (let p = 0; p < tries; p++) {
      if (rollWindfall()) { saw = true; break; }
    }
    if (saw) sawAtLeastOnce++;
  }
  console.log(`Chance of seeing Rogers within ${tries} playthroughs (${TRIALS} simulated players): ${(sawAtLeastOnce / TRIALS * 100).toFixed(1)}%`);
}
console.log();

// Sample messages
console.log('=== Sample messages ===');
let shown = 0;
while (shown < 5) {
  const result = rollWindfall();
  if (result) {
    console.log(result.message, '| amount:', result.amount);
    shown++;
  }
}
