// Pure, live-recomputed tagging for Sign/Sell lists — answers "who's
// actually worth looking at" instead of leaving the player to eyeball raw
// stats across 25+ rows. Recomputed from current squad state on every
// render; cheap at this squad size, no need to memoize.

import { blurbFor } from './blurbs.js';

// "Healthy" squad depth per position — used for both cover-needed (Sign)
// and overstocked (Sell). Roughly formation max requirement + 2 for rotation.
export const DEPTH_TARGET = { GK: 3, DF: 7, MF: 7, FW: 5 };

// A player this young hasn't had time to bank real tenure — too green to
// be "central to the club's plans" (key asset), and being cheap at this
// age is a development signal, not an expendability one (surplus).
const YOUNG_FLOOR_AGE = 21;

// How far below the role's strongest *eligible* player someone can sit and
// still count as genuinely first-team-quality — lets a proven, established
// second option share key-asset status with the outright best, rather than
// only ever crowning one player per role regardless of how close the gap
// actually is.
const KEY_ASSET_OVR_MARGIN = 5;

// Scouting-blurb language that self-contradicts "central to the club's
// actual plans" — checked against whatever blurb actually renders for the
// player (template or bespoke override), not a per-player exception list.
// Kept deliberately narrow: a single realistic weakness clause is normal
// scouting-report texture (nearly every blurb has one), so only phrases
// that read as genuinely unfinished/inadequate disqualify the tag.
const KEY_ASSET_HEDGE_PHRASES = ['still developing', 'limited going forward', 'needs a stronger'];

function blurbHedges(player) {
  const text = blurbFor(player).toLowerCase();
  return KEY_ASSET_HEDGE_PHRASES.some((phrase) => text.includes(phrase));
}

export function computeSquadStats(squad) {
  const byPos = {};
  for (const p of squad) {
    if (!byPos[p.pos]) byPos[p.pos] = { count: 0, totalOvr: 0, bestOvr: 0 };
    const s = byPos[p.pos];
    s.count += 1;
    s.totalOvr += p.ovr;
    s.bestOvr = Math.max(s.bestOvr, p.ovr);
  }
  const stats = {};
  for (const [pos, s] of Object.entries(byPos)) {
    stats[pos] = { count: s.count, avgOvr: s.totalOvr / s.count, bestOvr: s.bestOvr };
  }
  return stats;
}

// Cheapest ~30% of the market by fee-per-OVR-point counts as a "bargain".
export function computeBargainThreshold(market) {
  if (market.length === 0) return Infinity;
  const ratios = market.map((p) => p.value / p.ovr).sort((a, b) => a - b);
  const idx = Math.floor(ratios.length * 0.3);
  return ratios[Math.min(idx, ratios.length - 1)];
}

// Players genuinely central to the club's actual plans at their specific
// role (not broad position) — only flagged when there's real competition
// for the shirt (role count > 1), otherwise everyone in a one-deep role
// would trivially "win". This is a self-consistency check, not a single
// "highest OVR wins" pick: a candidate is only eligible if their own
// situation and their own scouting blurb actually support "key asset" —
// - not a recent signing (hasn't had time to become established)
// - no real-world future uncertainty (loan-return limbo, live transfer
//   speculation, injury concern) — "central to the plans" contradicts
//   "future unresolved"
// - old enough to have real tenure (YOUNG_FLOOR_AGE) — cheap and young is
//   a development signal, not proof of importance
// - their own blurb doesn't hedge (see KEY_ASSET_HEDGE_PHRASES)
// Any eligible player within KEY_ASSET_OVR_MARGIN of the role's strongest
// eligible player is tagged — not just the single top OVR — so a proven
// #2 (established, no red flags) can share the tag with the outright best
// rather than losing out purely on ranking.
export function computeKeyAssetIds(squad) {
  const byRole = {};
  for (const p of squad) {
    if (!byRole[p.role]) byRole[p.role] = [];
    byRole[p.role].push(p);
  }
  const ids = new Set();
  for (const players of Object.values(byRole)) {
    const eligible = players.filter(
      (p) =>
        p.status !== 'future-uncertain' &&
        p.status !== 'recent-signing' &&
        p.flag !== 'future_in_doubt' &&
        !p.injuryWatch &&
        p.age > YOUNG_FLOOR_AGE &&
        !blurbHedges(p)
    );
    if (eligible.length < 2) continue;
    const bestOvr = Math.max(...eligible.map((p) => p.ovr));
    eligible.filter((p) => p.ovr >= bestOvr - KEY_ASSET_OVR_MARGIN).forEach((p) => ids.add(p.id));
  }
  return ids;
}

// Only the genuinely excess players in an over-depth position — not every
// player who happens to share that position. "Overstocked" means real,
// meaningful surplus (more than formation slots + rotation cover), so only
// the weakest `count - target` players in that position are tagged, and
// only from players who aren't already a key asset or a recent signing
// (a squad regular or a player just brought in isn't what "too many
// bodies" is describing, whatever the raw count says).
export function computeOverstockedIds(squad, keyAssetIds) {
  const byPos = {};
  for (const p of squad) {
    if (!byPos[p.pos]) byPos[p.pos] = [];
    byPos[p.pos].push(p);
  }
  const ids = new Set();
  for (const [pos, players] of Object.entries(byPos)) {
    const target = DEPTH_TARGET[pos] || 5;
    const excess = players.length - target;
    if (excess <= 0) continue;
    const eligible = players
      .filter((p) => !keyAssetIds?.has(p.id) && p.status !== 'recent-signing')
      .sort((a, b) => a.ovr - b.ovr);
    eligible.slice(0, excess).forEach((p) => ids.add(p.id));
  }
  return ids;
}

export function tagSignTarget(player, squadStats, bargainThreshold) {
  const tags = [];
  const posStat = squadStats[player.pos];
  if (!posStat || player.ovr > posStat.avgOvr + 2) tags.push('upgrade');
  if (player.value / player.ovr <= bargainThreshold) tags.push('bargain');
  const depthCount = posStat ? posStat.count : 0;
  if (depthCount < (DEPTH_TARGET[player.pos] || 5)) tags.push('cover_needed');
  if (player.wildcard) tags.push('wildcard');
  if (player.workPermitDoubt) tags.push('work_permit_doubt');
  return tags;
}

export function tagSellCandidate(player, squadStats, keyAssetIds, overstockedIds) {
  const tags = [];
  const posStat = squadStats[player.pos];
  const isRecentSigning = player.status === 'recent-signing';
  const isKeyAsset = keyAssetIds?.has(player.id);
  // Cheap-and-young is a development signal, not an expendability one — a
  // player at/under YOUNG_FLOOR_AGE is only surplus-eligible if there's a
  // genuine reason beyond low value, i.e. their position is independently
  // confirmed to have real excess depth (overstockedIds), not just "young
  // and not the best stats yet".
  const isTooYoungForSurplus = player.age <= YOUNG_FLOOR_AGE && !overstockedIds?.has(player.id);
  // A player the club just brought in can't be "surplus to requirements",
  // and the undisputed starter in their role can't be either — exclude
  // both from eligibility regardless of stats.
  if (
    !isRecentSigning &&
    !isKeyAsset &&
    !isTooYoungForSurplus &&
    posStat &&
    posStat.count > 3 &&
    player.ovr < posStat.avgOvr - 2
  ) {
    tags.push('surplus');
  }
  if (overstockedIds?.has(player.id)) tags.push('overstocked');
  if (player.flag === 'future_in_doubt' || player.status === 'future-uncertain') tags.push('future_in_doubt');
  if (player.injuryWatch) tags.push('injury_watch');
  if (keyAssetIds?.has(player.id)) tags.push('key_asset');
  return tags;
}

export const TAG_COPY = {
  upgrade: { label: 'Upgrade', className: 'tag--upgrade' },
  bargain: { label: 'Bargain', className: 'tag--bargain' },
  cover_needed: { label: 'Cover needed', className: 'tag--cover' },
  surplus: { label: 'Surplus', className: 'tag--surplus' },
  overstocked: { label: 'Overstocked', className: 'tag--overstocked' },
  future_in_doubt: { label: 'Future in doubt', className: 'tag--doubt' },
  key_asset: { label: 'Key asset', className: 'tag--key' },
  injury_watch: { label: 'Injury watch', className: 'tag--doubt' },
  wildcard: { label: 'Wildcard', className: 'tag--wildcard' },
  work_permit_doubt: { label: 'Work permit doubt', className: 'tag--doubt' },
};

// Depth strip summary shown at the top of Sign/Sell — e.g. "DF 7/7 · MF 5/7".
export function depthSummary(squadStats) {
  return Object.keys(DEPTH_TARGET).map((pos) => ({
    pos,
    count: squadStats[pos]?.count || 0,
    target: DEPTH_TARGET[pos],
  }));
}
