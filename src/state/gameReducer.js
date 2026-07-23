import squadSeed from '../data/squad.json';
import marketSeed from '../data/market.json';
import { MANDATES, SPONSORS, KIT_COLOURWAYS, PHILOSOPHIES } from '../data/copy.js';
import { SQUAD_FLOOR, SQUAD_CEILING } from '../engine/strength.js';
import { rollWindfall } from '../engine/windfall.js';

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

export const EMPTY_STATE = {
  screen: 'setup',
  setupPayload: null,
  manager: { name: '', mandate: null },
  sponsor: null,
  kit: null,
  awayKit: null,
  philosophy: null,
  boardPatience: 50,
  budget: 0,
  budgetTotal: 0,
  wageCapTotal: 0,
  wageCapRemaining: 0,
  squad: [],
  market: [],
  formation: '4-3-3',
  xi: [],
  tasks: { sell: false, sign: false, xi: false },
  transfersIn: [],
  transfersOut: [],
  season: null,
  playoffFormation: '4-3-3',
  playoffXi: [],
  playoff: null,
  windfallFired: false,
  windfallMessage: null,
};

// Builds a fresh window from a Setup payload.
function mkFreshGame(payload) {
  const mandate = MANDATES[payload.mandateKey];
  const sponsor = SPONSORS.find((s) => s.id === payload.sponsorId) || null;
  const kit = payload.kit || KIT_COLOURWAYS[0];
  const philosophy = PHILOSOPHIES.find((p) => p.id === payload.philosophyId) || PHILOSOPHIES[0];

  const sponsorBudgetBump = sponsor?.effect?.budget || 0;
  let patience = 50 + (sponsor?.effect?.patience || 0);
  if (payload.mandateKey === 'scr_watch' && sponsor?.effect?.patienceScrWatch) {
    patience += sponsor.effect.patienceScrWatch;
  }
  patience = Math.max(0, Math.min(100, patience));

  // Rolled once, right here, before the window opens — so if it hits, it's
  // waiting for the player as breaking news the moment the hub loads, never
  // something that interrupts mid-Sell/Sign (see engine/windfall.js).
  const windfall = rollWindfall();
  const startingBudget = mandate.budget + sponsorBudgetBump;

  return {
    ...EMPTY_STATE,
    screen: 'hub',
    setupPayload: payload,
    manager: { name: payload.name, mandate: payload.mandateKey },
    sponsor: sponsor?.id || null,
    kit,
    awayKit: payload.awayKit || null,
    philosophy: philosophy.id,
    boardPatience: patience,
    budget: windfall ? round2(startingBudget + windfall.amount) : startingBudget,
    budgetTotal: startingBudget,
    wageCapTotal: mandate.wageCap,
    wageCapRemaining: mandate.wageCap,
    squad: clone(squadSeed),
    market: clone(marketSeed),
    formation: '4-3-3',
    xi: [],
    tasks: { sell: false, sign: false, xi: false },
    transfersIn: [],
    transfersOut: [],
    season: null,
    playoffFormation: '4-3-3',
    playoffXi: [],
    playoff: null,
    windfallFired: !!windfall,
    windfallMessage: windfall?.message || null,
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'SETUP_COMPLETE': {
      return mkFreshGame(action.payload);
    }

    case 'GO_TO': {
      return { ...state, screen: action.payload.screen };
    }

    case 'SELL_PLAYER': {
      if (state.squad.length <= SQUAD_FLOOR) return state;
      const player = state.squad.find((p) => p.id === action.payload.playerId);
      if (!player) return state;
      return {
        ...state,
        squad: state.squad.filter((p) => p.id !== player.id),
        xi: state.xi.filter((id) => id !== player.id),
        budget: round2(state.budget + player.value),
        // Selling a player frees the wage they were taking up, same as the
        // wage cap being spent when one is signed (see SIGN_PLAYER below) —
        // without this, cashing in a big earner raised transfer budget but
        // left wage room untouched, so a sell-heavy window could leave you
        // flush with money but still wage-capped.
        wageCapTotal: state.wageCapTotal + player.wage,
        wageCapRemaining: state.wageCapRemaining + player.wage,
        transfersOut: [...state.transfersOut, { player, fee: player.value }],
      };
    }

    case 'SIGN_PLAYER': {
      const player = state.market.find((p) => p.id === action.payload.playerId);
      if (!player) return state;
      if (state.squad.length >= SQUAD_CEILING) return state;
      if (player.value > state.budget + 1e-9) return state;
      if (player.wage > state.wageCapRemaining) return state;
      if (state.squad.some((p) => p.id === player.id)) return state; // guard duplicate signing

      return {
        ...state,
        squad: [...state.squad, player],
        market: state.market.filter((p) => p.id !== player.id),
        budget: round2(state.budget - player.value),
        wageCapRemaining: state.wageCapRemaining - player.wage,
        transfersIn: [...state.transfersIn, { player, fee: player.value }],
      };
    }

    // windfallMessage/windfallFired are set once, at window creation (see
    // mkFreshGame) — DISMISS_WINDFALL just clears the banner once read.
    case 'DISMISS_WINDFALL': {
      return { ...state, windfallMessage: null };
    }

    case 'MARK_TASK_DONE': {
      return { ...state, tasks: { ...state.tasks, [action.payload.task]: true } };
    }

    case 'SET_FORMATION': {
      return { ...state, formation: action.payload.formation };
    }

    case 'SET_XI': {
      return { ...state, xi: action.payload.playerIds };
    }

    case 'SET_PLAYOFF_FORMATION': {
      return { ...state, playoffFormation: action.payload.formation };
    }

    case 'SET_PLAYOFF_XI': {
      return { ...state, playoffXi: action.payload.playerIds };
    }

    case 'SIMULATION_COMPLETE': {
      const nextScreen = action.payload.season.playoffEligible ? 'playoff_xi' : 'results';
      const seeded = action.payload.season.playoffEligible
        ? { playoffFormation: state.formation, playoffXi: state.xi }
        : {};
      return { ...state, season: action.payload.season, screen: nextScreen, ...seeded };
    }

    case 'ENTER_PLAYOFF_XI': {
      return { ...state, screen: 'playoff_xi', playoffFormation: state.formation, playoffXi: state.xi };
    }

    case 'PLAYOFF_COMPLETE': {
      return {
        ...state,
        playoff: action.payload.playoff,
        season: { ...state.season, grade: action.payload.grade },
        screen: 'results',
      };
    }

    case 'NEW_WINDOW': {
      return clone(EMPTY_STATE);
    }

    case 'LOAD_STATE': {
      return action.payload.state;
    }

    default:
      return state;
  }
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
