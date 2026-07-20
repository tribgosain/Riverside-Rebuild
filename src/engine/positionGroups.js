// Maps a player's specific role to a display group header, used to break
// Sell/Sign player lists into position-category sections (GOALKEEPERS,
// RIGHT-BACKS, CENTRE-BACKS, ...) instead of a flat filterable list.

export const ROLE_GROUP_ORDER = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'AM', 'LW', 'RW', 'ST'];

export const ROLE_GROUP_LABEL = {
  GK: 'Goalkeepers',
  CB: 'Centre-Backs',
  LB: 'Left-Backs',
  RB: 'Right-Backs',
  CDM: 'Defensive Midfielders',
  CM: 'Central Midfielders',
  AM: 'Attacking Midfielders',
  LW: 'Left Wingers',
  RW: 'Right Wingers',
  ST: 'Strikers',
};

export function groupByRole(players) {
  const groups = {};
  for (const p of players) {
    const key = ROLE_GROUP_ORDER.includes(p.role) ? p.role : p.pos;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }
  return ROLE_GROUP_ORDER.filter((r) => groups[r]?.length).map((r) => ({
    role: r,
    label: ROLE_GROUP_LABEL[r] || r,
    players: groups[r],
  }));
}
