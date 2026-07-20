import { GRADE_BANDS } from '../data/copy.js';

// Finishing position + mandate -> letter grade. Playoff outcomes override
// this (see gradeForSeason below) rather than living in the band tables
// themselves, since promotion isn't a league position.
export function gradeForPosition(mandate, position) {
  const bands = GRADE_BANDS[mandate];
  if (!bands) throw new Error(`Unknown mandate: ${mandate}`);
  const band = bands.find((b) => position <= b.max);
  return band ? band.grade : bands[bands.length - 1].grade;
}

// season: { mandate, position, playoff: null | { result: 'promoted' | 'lost_final' | 'lost_semi' } }
export function gradeForSeason(season) {
  const { mandate, position, playoff } = season;

  if (playoff?.result === 'promoted') {
    return { grade: 'A+' };
  }

  const grade = gradeForPosition(mandate, position);
  return { grade };
}
