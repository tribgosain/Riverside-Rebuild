// localStorage wrapper that degrades transparently to an in-memory store
// when localStorage throws (private browsing, sandboxed iframes, cookies
// blocked, etc.) — same interface either way, callers never need to know
// which one they got. This is not optional (§11 edge case 12).

const STORAGE_KEY = 'boro-window-save-v1';

// Bump whenever GameState's shape changes. A save written under an older
// schema is discarded rather than trusted — loading a stale-shaped object
// into newer code doesn't crash (most fields still exist) but individual
// fields can silently hold garbage, which is worse than a visible reset.
const SCHEMA_VERSION = 2;

function isValidShape(state) {
  return (
    state &&
    typeof state.screen === 'string' &&
    state.manager &&
    typeof state.manager.name === 'string' &&
    Array.isArray(state.squad) &&
    Array.isArray(state.market) &&
    state.tasks &&
    typeof state.tasks.sell === 'boolean'
  );
}

function memoryStoreFactory() {
  let value = null;
  return {
    getItem: () => value,
    setItem: (v) => {
      value = v;
    },
    removeItem: () => {
      value = null;
    },
  };
}

function detectStore() {
  try {
    const testKey = '__boro_window_probe__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return {
      getItem: (k) => window.localStorage.getItem(k),
      setItem: (k, v) => window.localStorage.setItem(k, v),
      removeItem: (k) => window.localStorage.removeItem(k),
    };
  } catch {
    const mem = memoryStoreFactory();
    return {
      getItem: () => mem.getItem(),
      setItem: (_k, v) => mem.setItem(v),
      removeItem: () => mem.removeItem(),
    };
  }
}

const store = detectStore();

export function saveGame(state) {
  try {
    store.setItem(STORAGE_KEY, JSON.stringify({ v: SCHEMA_VERSION, state }));
  } catch {
    // Quota exceeded or serialization failure — non-fatal, just skip the save.
  }
}

export function loadGame() {
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== SCHEMA_VERSION || !isValidShape(parsed.state)) return null;
    return parsed.state;
  } catch {
    // Corrupted save — fall back to a fresh game rather than a white screen.
    return null;
  }
}

export function clearGame() {
  try {
    store.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do if this fails too.
  }
}
