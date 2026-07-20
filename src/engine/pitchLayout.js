// Slot coordinates (percent of pitch container) for each formation, laid
// out goalkeeper-to-forwards from bottom to top so the pitch reads the way
// a manager would sketch it. `pos` is the broad legality category
// (formationRequirements() in strength.js); `role` is the specific label
// shown on the slot (ST/LW/RW/AM/CDM/CM/CB/LB/RB/GK) so a slot reads as an
// actual position, not a generic "FW"/"MF".

export const PITCH_LAYOUT = {
  '4-3-3': [
    { pos: 'GK', role: 'GK', top: 92, left: 50 },
    { pos: 'DF', role: 'LB', top: 73, left: 15 },
    { pos: 'DF', role: 'CB', top: 76, left: 38 },
    { pos: 'DF', role: 'CB', top: 76, left: 62 },
    { pos: 'DF', role: 'RB', top: 73, left: 85 },
    { pos: 'MF', role: 'CM', top: 47, left: 25 },
    { pos: 'MF', role: 'CDM', top: 50, left: 50 },
    { pos: 'MF', role: 'CM', top: 47, left: 75 },
    { pos: 'FW', role: 'LW', top: 16, left: 18 },
    { pos: 'FW', role: 'ST', top: 12, left: 50 },
    { pos: 'FW', role: 'RW', top: 16, left: 82 },
  ],
  '4-4-2': [
    { pos: 'GK', role: 'GK', top: 92, left: 50 },
    { pos: 'DF', role: 'LB', top: 73, left: 15 },
    { pos: 'DF', role: 'CB', top: 76, left: 38 },
    { pos: 'DF', role: 'CB', top: 76, left: 62 },
    { pos: 'DF', role: 'RB', top: 73, left: 85 },
    { pos: 'MF', role: 'LW', top: 46, left: 14 },
    { pos: 'MF', role: 'CM', top: 49, left: 38 },
    { pos: 'MF', role: 'CM', top: 49, left: 62 },
    { pos: 'MF', role: 'RW', top: 46, left: 86 },
    { pos: 'FW', role: 'ST', top: 14, left: 35 },
    { pos: 'FW', role: 'ST', top: 14, left: 65 },
  ],
  '3-5-2': [
    { pos: 'GK', role: 'GK', top: 92, left: 50 },
    { pos: 'DF', role: 'CB', top: 75, left: 25 },
    { pos: 'DF', role: 'CB', top: 78, left: 50 },
    { pos: 'DF', role: 'CB', top: 75, left: 75 },
    { pos: 'MF', role: 'LW', top: 47, left: 10 },
    { pos: 'MF', role: 'CM', top: 51, left: 30 },
    { pos: 'MF', role: 'CDM', top: 44, left: 50 },
    { pos: 'MF', role: 'CM', top: 51, left: 70 },
    { pos: 'MF', role: 'RW', top: 47, left: 90 },
    { pos: 'FW', role: 'ST', top: 14, left: 35 },
    { pos: 'FW', role: 'ST', top: 14, left: 65 },
  ],
  '5-3-2': [
    { pos: 'GK', role: 'GK', top: 92, left: 50 },
    { pos: 'DF', role: 'LB', top: 74, left: 8 },
    { pos: 'DF', role: 'CB', top: 77, left: 28 },
    { pos: 'DF', role: 'CB', top: 79, left: 50 },
    { pos: 'DF', role: 'CB', top: 77, left: 72 },
    { pos: 'DF', role: 'RB', top: 74, left: 92 },
    { pos: 'MF', role: 'CM', top: 47, left: 25 },
    { pos: 'MF', role: 'CDM', top: 50, left: 50 },
    { pos: 'MF', role: 'CM', top: 47, left: 75 },
    { pos: 'FW', role: 'ST', top: 14, left: 35 },
    { pos: 'FW', role: 'ST', top: 14, left: 65 },
  ],
};
