// One-line scouting blurb per player row. Named real targets get bespoke
// copy directly on the data entry (`player.blurb`); everything else falls
// back to a small templated bank keyed by role, picked deterministically
// off the player id so it doesn't flicker on re-render and repeat plays
// don't feel identical.

const TEMPLATES = {
  GK: [
    'Commands the box, doesn’t panic under a cross.',
    'Shot-stopper first, distribution a work in progress.',
    'Reliable between the sticks, nothing flashy.',
  ],
  CB: [
    'Wins the first header, reads the second ball.',
    'Comfortable stepping into midfield, occasional lapse in behind.',
    'Old-fashioned stopper — heads it, blocks it, clears it.',
  ],
  LB: [
    'Overlaps well, needs protecting defensively.',
    'Solid one-v-one, limited going forward.',
    'Engine to burn down the left all afternoon.',
  ],
  RB: [
    'Athletic, aggressive in the tackle, exposed on the turn.',
    'Steady rather than spectacular — does the basics well.',
    'Attacking full-back, leaves gaps in behind.',
  ],
  CDM: [
    'Breaks up play, keeps it simple in possession.',
    'Reads the game a beat ahead, not the quickest.',
    'The one who lets the others go and play.',
  ],
  CM: [
    'Box-to-box engine, all-action across 90 minutes.',
    'Tidy in possession, needs a stronger runner alongside.',
    'Dictates tempo when the game lets him.',
  ],
  AM: [
    'Final ball is the whole game — end product is the question.',
    'Sees passes others don’t, occasionally overcooks it.',
    'Presses well for a No.10, good engine off the ball.',
  ],
  LW: [
    'Direct, likes to cut inside onto the right foot.',
    'Pace to burn, end product still developing.',
    'Two-footed, comfortable drifting infield.',
  ],
  RW: [
    'Beats his man, end product needs sharpening.',
    'Tracks back, works both boxes.',
    'Electric in short bursts, a genuine outlet.',
  ],
  ST: [
    'Old-fashioned No.9, wins it, holds it, lays it off.',
    'Pace in behind, needs service to feed off.',
    'Poacher’s instincts, quiet outside the box.',
  ],
};

export function blurbFor(player) {
  if (player.blurb) return player.blurb;
  const pool = TEMPLATES[player.role] || TEMPLATES[player.pos] || ['Squad player, does a job when called on.'];
  const idx = (player.id.charCodeAt(player.id.length - 1) || 0) % pool.length;
  return pool[idx];
}
