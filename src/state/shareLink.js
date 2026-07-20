// Encodes just enough state into a URL query param to reconstruct a
// results-screen "challenge" — mandate, squad diff, formation, personalization
// picks, and the outcome. Base64 in a query param, no server needed.

const PARAM = 'w';

export function encodeShareState(state) {
  const payload = {
    n: state.manager.name,
    m: state.manager.mandate,
    sp: state.sponsor,
    kit: state.kit,
    ph: state.philosophy,
    f: state.formation,
    inn: (state.transfersIn || []).map((t) => t.player.id),
    out: (state.transfersOut || []).map((t) => t.player.id),
    grade: state.season?.grade,
    pos: state.season?.standings ? findBoroPosition(state.season.standings) : null,
    pts: state.season?.boroPoints,
  };

  try {
    const json = JSON.stringify(payload);
    const b64 = btoa(encodeURIComponent(json));
    return `${window.location.origin}${window.location.pathname}?${PARAM}=${b64}`;
  } catch {
    return null;
  }
}

function findBoroPosition(standings) {
  const row = standings.find((r) => r.id === 'boro');
  return row ? row.position : null;
}

// Returns the decoded payload, or null if the link is missing/stale/invalid.
// Never throws — a bad link falls through to a fresh Setup screen.
export function decodeShareState(search = window.location.search) {
  try {
    const params = new URLSearchParams(search);
    const raw = params.get(PARAM);
    if (!raw) return null;
    const json = decodeURIComponent(atob(raw));
    const payload = JSON.parse(json);
    if (!payload || typeof payload !== 'object') return null;
    return payload;
  } catch {
    return null;
  }
}
