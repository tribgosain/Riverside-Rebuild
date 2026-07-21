import { useEffect, useRef, useState } from 'react';
import clubsData from '../data/clubs.json';
import { PHILOSOPHIES, LOADING_FLAVOR } from '../data/copy.js';
import ProgressBar from './visuals/ProgressBar.jsx';
import { xiStrength } from '../engine/strength.js';
import { simulateSeason } from '../engine/simulate.js';
import { computeStandings, findPosition } from '../engine/table.js';
import { gradeForPosition } from '../engine/grade.js';
import { computeStreaks } from '../engine/streaks.js';

const BORO_ID = 'boro';
const TOTAL_DURATION_MS = 1800;
const AUTO_ADVANCE_DELAY_MS = 700;

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Full season computes synchronously, BEFORE the reveal animation starts
// (§12 of the brief) — a refresh mid-reveal loses the animation, never the
// outcome, because the outcome already exists.
function computeSeason(state) {
  const xiPlayers = state.xi.map((id) => state.squad.find((p) => p.id === id)).filter(Boolean);
  const boroStrength = xiStrength(xiPlayers, state.squad.length);
  const philosophy = PHILOSOPHIES.find((p) => p.id === state.philosophy) || PHILOSOPHIES[0];

  const teams = [...clubsData, { id: BORO_ID, name: 'Middlesbrough', short: 'BOR', strength: boroStrength }];
  const matches = simulateSeason(teams, philosophy, BORO_ID);
  const standings = computeStandings(teams, matches);
  const boroRow = standings.find((r) => r.id === BORO_ID);
  const position = findPosition(standings, BORO_ID);
  const playoffEligible = position >= 3 && position <= 6;
  const grade = gradeForPosition(position);

  const boroMatches = matches.filter((m) => m.homeId === BORO_ID || m.awayId === BORO_ID);

  return {
    matches,
    standings,
    boroRow,
    boroPosition: position,
    boroPoints: boroRow.pts,
    boroRecord: { w: boroRow.w, d: boroRow.d, l: boroRow.l },
    boroStrength,
    grade,
    playoffEligible,
    boroMatches: shuffled(boroMatches),
  };
}

// The two "moments" worth surfacing during the reveal — found anywhere in
// the (shuffled) reveal order. Computed once against the full season
// result, not derived live off reveal progress, since the whole point is
// we already know the outcome. Streak detection itself lives in
// engine/streaks.js, shared with the generated results recap.
function findMoments(boroMatches) {
  const { bestWin, bestWinless } = computeStreaks(boroMatches, BORO_ID);
  const moments = [];
  if (bestWin >= 3) moments.push(`${wordFor(bestWin)} IN A ROW`);
  if (bestWinless >= 3) moments.push(`WINLESS IN ${wordFor(bestWinless)}`);
  return moments;
}

export default function SeasonSim({ state, dispatch }) {
  const seasonRef = useRef(null);
  if (!seasonRef.current) seasonRef.current = computeSeason(state);
  const season = seasonRef.current;

  const total = season.boroMatches.length;
  const [tick, setTick] = useState(0);
  const [flavorIndex, setFlavorIndex] = useState(0);
  const momentsRef = useRef(null);
  if (!momentsRef.current) momentsRef.current = findMoments(season.boroMatches);
  const moments = momentsRef.current;

  const done = tick >= total;
  const momentIndex = Math.min(moments.length - 1, Math.floor((tick / Math.max(total, 1)) * moments.length));
  const activeMoment = moments.length > 0 && tick > 2 ? moments[Math.max(0, momentIndex)] : null;

  function finish() {
    dispatch({ type: 'SIMULATION_COMPLETE', payload: { season } });
  }

  useEffect(() => {
    const flavorTimer = setInterval(() => {
      setFlavorIndex((i) => (i + 1) % LOADING_FLAVOR.length);
    }, 900);
    return () => clearInterval(flavorTimer);
  }, []);

  useEffect(() => {
    if (tick >= total) return undefined;
    const stepMs = TOTAL_DURATION_MS / Math.max(total, 1);
    const t = setTimeout(() => setTick((i) => i + 1), stepMs);
    return () => clearTimeout(t);
  }, [tick, total]);

  // Auto-advance once the count finishes — no click required unless the
  // person wants to skip ahead of the animation.
  useEffect(() => {
    if (!done) return undefined;
    const t = setTimeout(finish, AUTO_ADVANCE_DELAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const progress = tick / Math.max(total, 1);

  return (
    <div className="screen sim-screen">
      <h1 className="task-title">Simulating the season&hellip;</h1>
      <p className="loading-flavor">{LOADING_FLAVOR[flavorIndex]}</p>

      <div className="sim-counter">
        <div className="sim-counter__number">{tick}<span className="sim-counter__total">/{total}</span></div>
        <div className="sim-counter__label">fixtures played</div>
        <ProgressBar progress={progress} />
      </div>

      {activeMoment && <div className="streak-banner">{activeMoment}</div>}

      <div className="sticky-bar">
        <button type="button" className="primary-btn" onClick={finish}>
          {done ? 'See the results' : 'Skip ahead'}
        </button>
      </div>
    </div>
  );
}

function wordFor(n) {
  const words = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
  return words[n] || String(n);
}
