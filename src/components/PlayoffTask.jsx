import { useMemo, useRef } from 'react';
import clubsData from '../data/clubs.json';
import { PHILOSOPHIES } from '../data/copy.js';
import { xiStrength } from '../engine/strength.js';
import { simulateTwoLeggedTie, simulateFinal } from '../engine/simulate.js';
import { attributeSeasonGoals } from '../engine/snapshot.js';
import { gradeForSeason } from '../engine/grade.js';
import XITask from './tasks/XITask.jsx';

const BORO_ID = 'boro';
// 3rd vs 6th, 4th vs 5th — standard EFL playoff bracket.
const BRACKET = { 3: 6, 4: 5, 5: 4, 6: 3 };

function teamWithStrength(id, boroStrength) {
  if (id === BORO_ID) return { id, name: 'Middlesbrough', strength: boroStrength };
  const c = clubsData.find((c) => c.id === id);
  return { id: c.id, name: c.name, strength: c.strength };
}

function positionToId(standings, pos) {
  const row = standings.find((r) => r.position === pos);
  return row ? row.id : null;
}

export default function PlayoffTask({ state, dispatch }) {
  const { season } = state;

  const snapshot = useRef(null);
  if (!snapshot.current) {
    const seasonXiPlayers = state.xi.map((id) => state.squad.find((p) => p.id === id)).filter(Boolean);
    snapshot.current = attributeSeasonGoals(seasonXiPlayers, season.boroRow.gf);
  }
  const { topScorer } = snapshot.current;

  const opponentInfo = useMemo(() => {
    const boroPos = season.boroPosition;
    const oppPos = BRACKET[boroPos];
    const oppId = positionToId(season.standings, oppPos);
    const opp = clubsData.find((c) => c.id === oppId);
    return { oppPos, opp };
  }, [season]);

  function handleConfirm() {
    const philosophy = PHILOSOPHIES.find((p) => p.id === state.philosophy) || PHILOSOPHIES[0];
    const playoffXiPlayers = state.playoffXi.map((id) => state.squad.find((p) => p.id === id)).filter(Boolean);
    const boroStrength = xiStrength(playoffXiPlayers, state.squad.length);
    const boroTeam = teamWithStrength(BORO_ID, boroStrength);

    const boroPos = season.boroPosition;
    const oppPos = BRACKET[boroPos];
    const oppId = positionToId(season.standings, oppPos);
    const oppTeam = teamWithStrength(oppId, boroStrength);

    // The other semi (not shown in detail) — just needs a result to know
    // who Boro would face in the final.
    const otherPositions = [3, 4, 5, 6].filter((p) => p !== boroPos && p !== oppPos);
    const otherAId = positionToId(season.standings, otherPositions[0]);
    const otherBId = positionToId(season.standings, otherPositions[1]);
    const otherTie = simulateTwoLeggedTie(
      teamWithStrength(otherAId, boroStrength),
      teamWithStrength(otherBId, boroStrength),
      philosophy
    );

    const semi = simulateTwoLeggedTie(boroTeam, oppTeam, philosophy);

    let result = 'lost_semi';
    let final = null;
    if (semi.winnerId === BORO_ID) {
      const finalOpponent = teamWithStrength(otherTie.winnerId, boroStrength);
      final = simulateFinal(boroTeam, finalOpponent, philosophy);
      result = final.winnerId === BORO_ID ? 'promoted' : 'lost_final';
    }

    const { grade } = gradeForSeason({ position: boroPos, playoff: { result } });

    dispatch({
      type: 'PLAYOFF_COMPLETE',
      payload: {
        playoff: { result, semi, final, opponent: oppTeam, snapshot: snapshot.current },
        grade,
      },
    });
  }

  return (
    <div className="screen task-screen">
      <div className="playoff-snapshot">
        <h1 className="task-title">You made the playoffs.</h1>
        <p>
          Finished {ordinal(season.boroPosition)}. You'll face {opponentInfo.opp?.name} in the semi-final.
        </p>
        {topScorer?.player && (
          <p className="playoff-snapshot__scorer">
            {topScorer.player.name} is your top scorer with {topScorer.goals}. Backed him all window, did you?
          </p>
        )}
      </div>

      <XITask
        squad={state.squad}
        formation={state.playoffFormation}
        xi={state.playoffXi}
        onSetFormation={(f) => dispatch({ type: 'SET_PLAYOFF_FORMATION', payload: { formation: f } })}
        onToggle={(id) => {
          const has = state.playoffXi.includes(id);
          const next = has ? state.playoffXi.filter((x) => x !== id) : [...state.playoffXi, id];
          dispatch({ type: 'SET_PLAYOFF_XI', payload: { playerIds: next } });
        }}
        onSetXi={(ids) => dispatch({ type: 'SET_PLAYOFF_XI', payload: { playerIds: ids } })}
        onConfirm={handleConfirm}
        onBack={null}
        title="Pick your playoff XI"
      />
    </div>
  );
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
