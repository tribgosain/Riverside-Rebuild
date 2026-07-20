import { COLD_OPEN } from '../data/copy.js';
import HeroPhoto from './visuals/HeroPhoto.jsx';

const NAME_MAX = 24;

// Screen 1 of the Setup flow — a clean first impression, not the start of
// a form. Shows only the hero photo, headline, brief, and the name input;
// every decision (mandate/sponsor/kit/philosophy) lives on Decisions,
// reached only after a name is entered here.
export default function Landing({ name, setName, challenge, onContinue }) {
  const trimmedName = name.trim().slice(0, NAME_MAX);

  return (
    <div className="screen setup-screen">
      <HeroPhoto />

      <div className="masthead-hero">
        <div className="masthead-hero__kicker">MIDDLESBROUGH &middot; SUMMER 2026</div>
        <h1 className="hero-headline">RIVERSIDE REBUILD.</h1>
        <div className="masthead-hero__girder" />
      </div>

      {challenge && (
        <div className="nudge challenge-banner">
          {challenge.n || 'A mate'} finished {challenge.pos ? ordinal(challenge.pos) : '—'} with a {challenge.grade || '?'} grade on {challenge.m || 'a'} mandate. Beat it.
        </div>
      )}

      <div className="pull-quote">
        <div className="pull-quote__label">The Brief</div>
        <p className="pull-quote__text">{COLD_OPEN}</p>
      </div>

      <section className="setup-section">
        <label className="field-label" htmlFor="manager-name">Your name</label>
        <input
          id="manager-name"
          className="text-input"
          type="text"
          value={name}
          maxLength={NAME_MAX}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && trimmedName) onContinue();
          }}
        />
      </section>

      <div className="sticky-bar">
        <button type="button" className="primary-btn" disabled={!trimmedName} onClick={onContinue}>
          {trimmedName ? `Continue as ${trimmedName}` : 'Enter your name to continue'}
        </button>
      </div>
    </div>
  );
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
