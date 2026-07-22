// Round 31 item 3 — prove the Morgan Rogers windfall event actually fires,
// with real numbers, not another assurance. Uses the real engine module
// directly (no browser), so results reflect the actual shipped logic.
import { rollWindfall } from '../src/engine/windfall.js';

function freshState() {
  return { windfallFired: false };
}

// --- Test A: raw per-call fire rate --------------------------------------
// 1,000-iteration loop calling the trigger check exactly as Sell/Sign call
// it, with a fresh (un-fired) state every time. This isolates the trigger
// probability itself from any per-window state effects.
const RAW_ITERATIONS = 1000;
let rawAnyFire = 0;
let rawRogersFire = 0;
let rawAcademyFire = 0;

for (let i = 0; i < RAW_ITERATIONS; i++) {
  const result = rollWindfall(freshState());
  if (result) {
    rawAnyFire++;
    if (result.message.includes('Morgan Rogers')) rawRogersFire++;
    else rawAcademyFire++;
  }
}

console.log('=== Test A: raw single-call fire rate (fresh state each call) ===');
console.log(`Iterations: ${RAW_ITERATIONS}`);
console.log(`Any windfall fired: ${rawAnyFire} (${(rawAnyFire / RAW_ITERATIONS * 100).toFixed(2)}%)`);
console.log(`Morgan Rogers specifically: ${rawRogersFire} (${(rawRogersFire / RAW_ITERATIONS * 100).toFixed(2)}%)`);
console.log(`Academy clause specifically: ${rawAcademyFire} (${(rawAcademyFire / RAW_ITERATIONS * 100).toFixed(2)}%)`);
console.log();

// --- Test B: realistic per-window simulation ------------------------------
// Mirrors real play: rollWindfall is called once per sell/sign/trim/autofill
// action, windfallFired flips true (and stays true) for the rest of the
// window the instant any windfall fires — matching gameReducer's
// WINDFALL_EVENT handler and windfallFired persisting on state. Counts how
// many whole windows see Rogers at least once across a realistic ~15-action
// window, which is the number that actually matters to a real player.
const WINDOWS = 1000;
const ACTIONS_PER_WINDOW = 15;
let windowsWithRogers = 0;
let windowsWithAnyWindfall = 0;
let totalActionsRun = 0;

for (let w = 0; w < WINDOWS; w++) {
  const state = freshState();
  let sawRogersThisWindow = false;
  let sawAnyThisWindow = false;
  for (let a = 0; a < ACTIONS_PER_WINDOW; a++) {
    totalActionsRun++;
    const result = rollWindfall(state);
    if (result) {
      sawAnyThisWindow = true;
      if (result.message.includes('Morgan Rogers')) sawRogersThisWindow = true;
      state.windfallFired = true; // matches WINDFALL_EVENT reducer behavior
    }
  }
  if (sawRogersThisWindow) windowsWithRogers++;
  if (sawAnyThisWindow) windowsWithAnyWindfall++;
}

console.log('=== Test B: realistic per-window simulation ===');
console.log(`Windows simulated: ${WINDOWS}, ${ACTIONS_PER_WINDOW} actions/window (${totalActionsRun} total actions)`);
console.log(`Windows with any windfall: ${windowsWithAnyWindfall} (${(windowsWithAnyWindfall / WINDOWS * 100).toFixed(1)}%)`);
console.log(`Windows with Morgan Rogers specifically: ${windowsWithRogers} (${(windowsWithRogers / WINDOWS * 100).toFixed(1)}%)`);
console.log();

// --- Test C: chance of seeing it within a handful of playthroughs --------
const TRIALS = 10000;
const TRY_COUNTS = [5, 10];
for (const tries of TRY_COUNTS) {
  let sawAtLeastOnce = 0;
  for (let t = 0; t < TRIALS; t++) {
    let saw = false;
    for (let p = 0; p < tries; p++) {
      const state = freshState();
      for (let a = 0; a < ACTIONS_PER_WINDOW; a++) {
        const result = rollWindfall(state);
        if (result && result.message.includes('Morgan Rogers')) {
          saw = true;
          state.windfallFired = true;
        } else if (result) {
          state.windfallFired = true;
        }
      }
    }
    if (saw) sawAtLeastOnce++;
  }
  console.log(`Chance of seeing Rogers within ${tries} playthroughs (${TRIALS} simulated players): ${(sawAtLeastOnce / TRIALS * 100).toFixed(1)}%`);
}
