// All editorial copy for Riverside Rebuild lives here — cold open, mandate
// flavor, sponsor/kit/philosophy banks, grade narrative, nicknames, loading
// flavor. Keeping it centralized so voice stays consistent as content grows.

export const COLD_OPEN = `Hackney's gone. Fry's gone. You blew a playoff final without registering a single shot on target. Hellberg's spent the second half of last season working with thirteen players he actually trusted, and he wants pace, a plan-B striker, and a squad deep enough to survive a bad month. Sarmiento and Joseph are already through the door. The rest of the window is yours.`;

// Trimmed for the persistent sidebar — same voice as the cold open, short
// enough to sit in a narrow column across all three task screens.
export const THE_BRIEF = `Hackney and Fry are gone. Hellberg trusted thirteen players by the end of last season — pace, a plan-B striker, and squad depth are the brief. Sarmiento and Joseph are already in.`;

export const ROLE_LINE = 'SPORTING DIRECTOR · MIDDLESBROUGH · 2026-27';

// Priority-tagged squad needs shown in the persistent sidebar. `role`
// matches Player.role — a need clears when the player actually signs
// someone in that role this window, not just from existing squad depth,
// so the sidebar visibly reacts to what you do.
export const SQUAD_NEEDS = [
  { id: 'rb_cover', label: 'Right-back cover', priority: 'CRITICAL', role: 'RB' },
  { id: 'striker_depth', label: 'Striker depth / plan-B option', priority: 'CRITICAL', role: 'ST' },
  { id: 'controlling_mid', label: 'A controlling midfielder', priority: 'HIGH', role: 'CDM' },
  { id: 'cb_depth', label: 'Centre-back depth', priority: 'HIGH', role: 'CB' },
];

export const TICKER_OPENING = (name, budget) =>
  `The window's open — ${name} takes the desk with £${budget}m sanctioned. Hellberg's waiting. Sell first.`;

export const TICKER_REACTIONS = {
  sell_key_asset: [
    'Selling a key asset. Hellberg will want to know the plan.',
    'That one stings — better have a replacement lined up.',
  ],
  sell_surplus: [
    'Good business. Nobody will miss that one.',
    'Trimmed the fat. Board will be quietly pleased.',
  ],
  sign_headline: [
    'Now THAT is a signing. Teesside will be buzzing.',
    'Statement of intent, that.',
  ],
  sign_wildcard: [
    'Boom or bust, that one. Bold call.',
    'Nobody quite knows what they’re getting there. Gutsy.',
  ],
  budget_wall: [
    'That would blow the budget. Board says no.',
    'Numbers don’t work. Sell something first.',
  ],
  wage_wall: [
    'Over the wage cap. Even Gibson has limits.',
    'Nice player, wrong number on the payslip.',
  ],
  xi_illegal: [
    'That XI isn’t legal for the shape. Fix it before kickoff.',
    'Formation doesn’t add up yet — count the shirts.',
  ],
};

// Base budgets sit slightly below the old flat figures because sponsor
// tiers (below) now contribute a real, consistent amount on top — the
// combined total (mandate + sponsor) lands in the same overall range as
// the old mandate-alone figures did, rather than every playthrough simply
// getting richer once sponsor money stacks on.
export const MANDATES = {
  backed: {
    key: 'backed',
    label: 'Backed',
    budget: 14,
    wageCap: 185,
    flavor: "Gibson's opened the chequebook. Delivery is now the only excuse.",
  },
  sensible: {
    key: 'sensible',
    label: 'Sensible',
    budget: 8.5,
    wageCap: 150,
    flavor: 'A normal Championship summer. Spend well, not much.',
  },
  scr_watch: {
    key: 'scr_watch',
    label: 'SCR Watch',
    budget: 3.5,
    wageCap: 120,
    flavor: "One bad signing away from a headline about the board.",
  },
};

// Sponsor budget contribution is a clean three-tier system, not a bespoke
// per-sponsor number — local +£0.5m, national +£1.5m, international +£3m.
// Other per-sponsor flavour effects (board patience, kit tie-ins) still
// vary individually; only the budget figure is tier-flat.
export const SPONSOR_BUDGET_BY_TIER = { local: 0.5, national: 1.5, international: 3 };

export const SPONSORS = [
  {
    id: 'gazette',
    name: 'Evening Gazzette',
    tier: 'local',
    real: false,
    copy: "Teesside's paper of record backs the badge.",
    effect: { budget: 0.5, patience: 2 },
    color: '#1b3a5c',
    monogram: 'EG',
  },
  {
    id: 'manjaros',
    name: "Manjarro's",
    tier: 'local',
    real: false,
    copy: 'Flame-grilled peri-peri, straight outta Boro.',
    effect: { budget: 0.5 },
    color: '#d9622b',
    monogram: 'M',
  },
  {
    id: 'sports_direkt',
    name: 'Sports Direkt',
    tier: 'national',
    real: false,
    copy: 'Every shirt, every size, every till receipt as long as your arm.',
    effect: { budget: 1.5 },
    color: '#0057b8',
    monogram: 'SD',
  },
  {
    id: 'bet366',
    name: 'Bet366',
    tier: 'national',
    real: false,
    copy: 'The odds-on favourite for your shirt front.',
    effect: { budget: 1.5, patienceScrWatch: -3 },
    color: '#0a8a3e',
    monogram: '366',
  },
  {
    id: 'greggos',
    name: "Greggo's",
    tier: 'national',
    real: false,
    copy: 'Half-time pasty, full-time loyalty.',
    effect: { budget: 1.5 },
    color: '#005eb8',
    monogram: 'G',
  },
  {
    id: 'emirate',
    name: 'Emirate Airways',
    tier: 'international',
    real: false,
    copy: "Fly the flag. Literally, it's on your sleeve.",
    effect: { budget: 3 },
    restrictedTo: ['backed', 'sensible'],
    color: '#b7862c',
    monogram: 'EA',
  },
  {
    id: 'cryptonite',
    name: 'Cryptonite.io',
    tier: 'international',
    real: false,
    copy: 'Sponsor nobody quite understands, backed by money nobody can explain.',
    effect: { budget: 3, patience: -2 },
    color: '#7c3aed',
    monogram: 'C',
  },
  {
    id: 'justeaten',
    name: 'Just Eaten',
    tier: 'international',
    real: false,
    copy: 'Delivering hope, thirty minutes late.',
    effect: { budget: 3 },
    color: '#ff4f64',
    monogram: 'JE',
  },
  {
    id: 'nyke',
    name: 'Nyke',
    tier: 'international',
    real: false,
    copy: 'The kit manufacturer, not that other one.',
    effect: { budget: 3 },
    pairsWithKit: true,
    color: '#161616',
    monogram: 'N',
  },
];

// Grounded in real Boro kit history, not invented colourways. Red has been
// the home shirt since 1899; the white chest band was introduced by Jack
// Charlton in 1973 and made permanent after a 2008 fan vote — it's the
// closest thing the club has to a kit hallmark. Away has mostly meant white;
// the polka-dot/blue trim nods to the oldest surviving Boro kit, worn
// 1886-1890. Hoops have never featured in the club's living memory, so
// they're not offered as an option.
export const KIT_COLOURWAYS = [
  {
    id: 'home_banded',
    name: 'Home Red (Banded)',
    group: 'home',
    primary: '#E2231A',
    trim: '#FFFFFF',
    pattern: 'band',
    note: "The white chest band Boro fans voted to keep for good in 2008.",
  },
  {
    id: 'home_plain',
    name: 'Home Red (Plain)',
    group: 'home',
    primary: '#E2231A',
    trim: '#FFFFFF',
    pattern: 'solid',
    note: 'Red, no band — the shirt in its plainer years.',
  },
  {
    id: 'away_white',
    name: 'Away White',
    group: 'away',
    primary: '#F4F1EA',
    trim: '#E2231A',
    pattern: 'solid',
    note: 'The clean away read Boro have worn most often.',
  },
  {
    id: 'away_heritage',
    name: 'Heritage White',
    group: 'away',
    primary: '#F4F1EA',
    trim: '#1E4C9A',
    pattern: 'polka',
    note: 'White with blue trim and polka dots — a nod to the oldest surviving Boro kit, worn 1886-1890.',
  },
  {
    id: 'alt_black',
    name: 'Smoggy Black',
    group: 'alternate',
    primary: '#1B1B1D',
    trim: '#E2231A',
    pattern: 'solid',
    note: "Not from the archives — just what the fans call themselves. Alternate-kit energy.",
  },
  {
    id: 'custom',
    name: 'Design your own',
    group: 'custom',
    primary: '#E2231A',
    trim: '#FFFFFF',
    pattern: 'solid',
    note: 'Two colours, one pattern. Your kit, your call.',
  },
];

export const PHILOSOPHIES = [
  {
    id: 'high_press',
    name: 'High Press',
    copy: 'Win it back in their half or die trying.',
    variance: 8,
    homeAdvantage: 3,
  },
  {
    id: 'control_possession',
    name: 'Control Possession',
    copy: "If they don't have the ball, they can't hurt you.",
    variance: 3,
    homeAdvantage: 3,
  },
  {
    id: 'counter_attack',
    name: 'Counter-Attack',
    copy: "Let them come. We'll punish the space.",
    variance: 5,
    varianceAway: 7,
    homeAdvantage: 3,
  },
  {
    id: 'route_one',
    name: 'Route One',
    copy: 'Get it in the mixer.',
    variance: 5,
    homeAdvantage: 4,
  },
];

// Grade bands: finishing position (1-24) -> letter, keyed per mandate.
// Calibrated against a real 25-run balance test, not a narrative guess.
// Round23's original calibration (optimal squad averaging 7.28th, range
// 4th-12th, 28% playoff rate; gutted squad averaging 19.84th, range
// 16th-24th) went stale after round29's balance fix (opponent CLUBS
// strengths shifted down, strength-to-goals slope steepened) compressed
// the whole position distribution — re-run under the new balance, a
// genuinely optimal squad now averages 5.88th (range 3rd-9th, 56%
// playoff rate) and a genuinely gutted squad now averages ~16.5th (range
// 14th-19th). Bands below are shifted to match, so grade still means what
// it did before relative to real play quality, not stale absolute
// positions that predate the fix.
export const GRADE_BANDS = {
  backed: [
    { max: 2, grade: 'A+' },
    { max: 6, grade: 'A' },
    { max: 10, grade: 'B' },
    { max: 13, grade: 'C' },
    { max: 16, grade: 'D' },
    { max: 24, grade: 'F' },
  ],
  sensible: [
    { max: 2, grade: 'A+' },
    { max: 6, grade: 'A' },
    { max: 10, grade: 'B' },
    { max: 14, grade: 'C' },
    { max: 24, grade: 'D' },
  ],
  scr_watch: [
    { max: 2, grade: 'A+' },
    { max: 10, grade: 'B' },
    { max: 14, grade: 'C' },
    { max: 24, grade: 'D' },
  ],
};

export const LOADING_FLAVOR = [
  'Telling the board it will be fine this time.',
  'Getting Hellberg to sign off on the shape.',
  'Double-checking the SCR filing.',
  "Ironing the new kit.",
  'Setting the fixtures for 552 matches nobody asked to watch in real time.',
  "Reminding everyone Hull happened but it's fine now.",
];

export const BOARD_PATIENCE_COPY = {
  steady: "Board Patience: steady. Gibson backs his managers — a rocky spell alone won't change that.",
  wobble: 'Board Patience: a little uneasy after some results, but nowhere near breaking point.',
  furious: "Board Patience: exhausted. It takes relegation form or reckless spending for nothing to get here — and that's where you are.",
};

export const FAN_REACTIONS = {
  bigSale: [
    'sold {player} to fund THAT? sound as.',
    "didn't see that one coming, {player} out the door.",
  ],
  marqueeSign: [
    'actually behaving like a big club for once.',
    '{player} in?! get in Boro.',
  ],
  deadlinePanic: [
    "we've panic bought again haven't we.",
    'deadline day Boro strikes again.',
  ],
  noActivity: [
    'same old boro, all mouth no window.',
    'quietest window in years and it shows.',
  ],
};
