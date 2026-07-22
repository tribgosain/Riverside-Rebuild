import { GRADE_BANDS } from '../data/copy.js';

// Finishing position -> letter grade. One uniform table, no mandate
// adjustment (round30) — see GRADE_BANDS for why. Playoff outcomes
// override this (see gradeForSeason below) rather than living in the
// band table itself, since promotion isn't a league position.
export function gradeForPosition(position) {
  const band = GRADE_BANDS.find((b) => position <= b.max);
  return band ? band.grade : GRADE_BANDS[GRADE_BANDS.length - 1].grade;
}

// season: { position, playoff: null | { result: 'promoted' | 'lost_final' | 'lost_semi' } }
// Round32: A+ is reserved for actually winning the league (position 1,
// via gradeForPosition below) — going up through the playoff is a real
// achievement but not the top mark. Losing in the playoff (final or
// semi) still means reaching it, which stays a genuinely good outcome —
// grade B, not lumped in with missing it entirely.
export function gradeForSeason(season) {
  const { position, playoff } = season;

  if (playoff?.result === 'promoted') {
    return { grade: 'A' };
  }
  if (playoff?.result === 'lost_final' || playoff?.result === 'lost_semi') {
    return { grade: 'B' };
  }

  const grade = gradeForPosition(position);
  return { grade };
}
