import { useEffect, useReducer, useState } from 'react';
import { gameReducer, EMPTY_STATE } from './state/gameReducer.js';
import { saveGame, loadGame } from './state/persistence.js';
import { decodeShareState } from './state/shareLink.js';
import Header from './components/Header.jsx';
import Setup from './components/Setup.jsx';
import TaskHub from './components/TaskHub.jsx';
import SellTask from './components/tasks/SellTask.jsx';
import SignTask from './components/tasks/SignTask.jsx';
import XIScreen from './components/tasks/XIScreen.jsx';
import SeasonSim from './components/SeasonSim.jsx';
import PlayoffTask from './components/PlayoffTask.jsx';
import ResultsModal from './components/ResultsModal.jsx';

function initState() {
  const saved = loadGame();
  if (saved && saved.screen) return saved;
  return EMPTY_STATE;
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initState);
  const [challenge] = useState(() => decodeShareState());

  useEffect(() => {
    saveGame(state);
  }, [state]);

  useEffect(() => {
    // Apply the chosen kit colourway as CSS variables for the whole session.
    if (state.kit) {
      document.documentElement.style.setProperty('--kit-primary', state.kit.primary);
      document.documentElement.style.setProperty('--kit-trim', state.kit.trim);
    }
  }, [state.kit]);

  function handleRestart() {
    if (window.confirm('Start a new window? This clears your current squad and progress.')) {
      dispatch({ type: 'NEW_WINDOW' });
    }
  }

  const screen = renderScreen(state, dispatch, challenge);
  const showRestart = state.screen !== 'setup' && state.screen !== 'results';

  return (
    <>
      <Header onRestart={showRestart ? handleRestart : null} />
      {screen}
    </>
  );
}

function renderScreen(state, dispatch, challenge) {
  switch (state.screen) {
    case 'setup':
      return <Setup dispatch={dispatch} challenge={challenge} />;
    case 'hub':
      return <TaskHub state={state} dispatch={dispatch} />;
    case 'sell':
      return <SellTask state={state} dispatch={dispatch} />;
    case 'sign':
      return <SignTask state={state} dispatch={dispatch} />;
    case 'xi':
      return <XIScreen state={state} dispatch={dispatch} />;
    case 'simulating':
      return <SeasonSim state={state} dispatch={dispatch} />;
    case 'playoff_xi':
      return <PlayoffTask state={state} dispatch={dispatch} />;
    case 'results':
      return <ResultsModal state={state} dispatch={dispatch} />;
    default:
      return <Setup dispatch={dispatch} challenge={challenge} />;
  }
}
