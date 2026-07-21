import { MANDATES, SPONSORS, KIT_COLOURWAYS, HOME_CUSTOM_PALETTE, AWAY_CUSTOM_PALETTE, PHILOSOPHIES, ROLE_LINE } from '../data/copy.js';
import SponsorMark from './visuals/SponsorMark.jsx';
import KitShirt from './visuals/KitShirt.jsx';
import PhilosophyIcon from './visuals/PhilosophyIcon.jsx';

const SPONSOR_TIERS = ['local', 'national', 'international'];

function ColourSwatchRow({ label, options, value, onChange }) {
  return (
    <label>
      {label}
      <div className="colour-swatch-row">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`colour-swatch${value === o.value ? ' colour-swatch--active' : ''}`}
            style={{ background: o.value }}
            title={o.label}
            aria-label={o.label}
            onClick={() => onChange(o.value)}
          />
        ))}
      </div>
    </label>
  );
}

// Screen 2 of the Setup flow — every decision (mandate, sponsor, home +
// away kit, philosophy), all unselected by default per round17. The name
// entered on Landing carries forward into the identity strip up top,
// matching the header pattern from Sell/Sign/XI, so it's clear whose
// window this is throughout.
export default function Decisions({
  name,
  onBack,
  mandateKey,
  onMandatePick,
  sponsorId,
  onSponsorPick,
  homeKitId,
  setHomeKitId,
  awayKitId,
  setAwayKitId,
  homeKitPreview,
  awayKitPreview,
  customPrimary,
  setCustomPrimary,
  customTrim,
  setCustomTrim,
  customPattern,
  setCustomPattern,
  customNeck,
  setCustomNeck,
  awayCustomPrimary,
  setAwayCustomPrimary,
  awayCustomTrim,
  setAwayCustomTrim,
  awayCustomPattern,
  setAwayCustomPattern,
  awayCustomNeck,
  setAwayCustomNeck,
  philosophyId,
  setPhilosophyId,
  allChosen,
  ctaLabel,
  onStart,
}) {
  return (
    <div className="screen setup-screen">
      <div className="decisions-header">
        <div className="game-shell__identity">
          <div className="game-shell__name">{name}</div>
          <div className="game-shell__role">{ROLE_LINE}</div>
        </div>
        <button type="button" className="masthead__restart" onClick={onBack}>
          Change name
        </button>
      </div>

      <section className="setup-section">
        <h2 className="section-title">Board mandate</h2>
        <div className="card-grid mandate-grid">
          {Object.values(MANDATES).map((m) => (
            <button
              key={m.key}
              type="button"
              className={`pick-card${mandateKey === m.key ? ' pick-card--active' : ''}`}
              onClick={() => onMandatePick(m.key)}
            >
              <div className="pick-card__title">{m.label}</div>
              <div className="pick-card__stat">£{m.budget}m &middot; £{m.wageCap}k/wk</div>
              <div className="pick-card__flavor">{m.flavor}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="setup-section">
        <h2 className="section-title">Kit sponsor</h2>
        {SPONSOR_TIERS.map((tier) => (
          <div key={tier} className="sponsor-tier">
            <div className="sponsor-tier__label">{tier}</div>
            <div className="sponsor-grid">
              {SPONSORS.filter((s) => s.tier === tier).map((s) => {
                const disabled = s.restrictedTo && !s.restrictedTo.includes(mandateKey);
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={disabled}
                    className={`sponsor-card${sponsorId === s.id ? ' sponsor-card--active' : ''}${disabled ? ' sponsor-card--disabled' : ''}`}
                    onClick={() => onSponsorPick(s.id)}
                    title={disabled ? 'Not available on this mandate' : undefined}
                  >
                    <SponsorMark sponsor={s} />
                    <div className="sponsor-card__stat">+£{s.effect.budget}m budget</div>
                    <div className="sponsor-card__flavor">{s.copy}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="setup-section">
        <h2 className="section-title">Home kit</h2>
        <div className="kit-preview-hero">
          {homeKitPreview ? (
            <>
              <KitShirt primary={homeKitPreview.primary} trim={homeKitPreview.trim} pattern={homeKitPreview.pattern} neck={homeKitPreview.neck} size={110} uid="home-hero" />
              <div className="kit-preview-hero__name">{homeKitPreview.name}</div>
              <div className="kit-preview-hero__note">{homeKitPreview.note}</div>
            </>
          ) : (
            <div className="kit-preview-hero__placeholder">Pick a home kit below</div>
          )}
        </div>

        <div className="kit-grid">
          {KIT_COLOURWAYS.filter((k) => k.group === 'home').map((k) => (
            <button
              key={k.id}
              type="button"
              className={`pick-card pick-card--visual pick-card--kit${homeKitId === k.id ? ' pick-card--active' : ''}`}
              onClick={() => setHomeKitId(k.id)}
            >
              <KitShirt primary={k.primary} trim={k.trim} pattern={k.pattern} size={48} uid={k.id} />
              <div className="pick-card__title">{k.name}</div>
            </button>
          ))}
          <button
            type="button"
            className={`pick-card pick-card--visual pick-card--kit${homeKitId === 'custom' ? ' pick-card--active' : ''}`}
            onClick={() => setHomeKitId('custom')}
          >
            <KitShirt primary={customPrimary} trim={customTrim} pattern={customPattern} neck={customNeck} size={48} uid="custom-chip" />
            <div className="pick-card__title">Design your own</div>
          </button>
        </div>

        {homeKitId === 'custom' && (
          <div className="custom-kit-editor">
            <p className="custom-kit-editor__note">Home stays red and white — the shirt colour, not a style choice.</p>
            <ColourSwatchRow
              label="Body colour"
              options={HOME_CUSTOM_PALETTE.primary}
              value={customPrimary}
              onChange={setCustomPrimary}
            />
            <ColourSwatchRow
              label="Trim (neck & sleeves)"
              options={HOME_CUSTOM_PALETTE.trim}
              value={customTrim}
              onChange={setCustomTrim}
            />
            <label>
              Neck style
              <select value={customNeck} onChange={(e) => setCustomNeck(e.target.value)}>
                <option value="v">V-neck</option>
                <option value="crew">Crew</option>
                <option value="collar">Collar</option>
              </select>
            </label>
            <label>
              Pattern
              <select value={customPattern} onChange={(e) => setCustomPattern(e.target.value)}>
                <option value="solid">Plain</option>
                <option value="band">Chest band</option>
                <option value="pinstripe">Pinstripes</option>
              </select>
            </label>
          </div>
        )}
      </section>

      <section className="setup-section">
        <h2 className="section-title">Away kit</h2>
        <div className="kit-preview-hero">
          {awayKitPreview ? (
            <>
              <KitShirt primary={awayKitPreview.primary} trim={awayKitPreview.trim} pattern={awayKitPreview.pattern} neck={awayKitPreview.neck} size={110} uid="away-hero" />
              <div className="kit-preview-hero__name">{awayKitPreview.name}</div>
              <div className="kit-preview-hero__note">{awayKitPreview.note}</div>
            </>
          ) : (
            <div className="kit-preview-hero__placeholder">Pick an away kit below</div>
          )}
        </div>

        <div className="kit-grid">
          {KIT_COLOURWAYS.filter((k) => k.group === 'away').map((k) => (
            <button
              key={k.id}
              type="button"
              className={`pick-card pick-card--visual pick-card--kit${awayKitId === k.id ? ' pick-card--active' : ''}`}
              onClick={() => setAwayKitId(k.id)}
            >
              <KitShirt primary={k.primary} trim={k.trim} pattern={k.pattern} size={48} uid={k.id} />
              <div className="pick-card__title">{k.name}</div>
            </button>
          ))}
          <button
            type="button"
            className={`pick-card pick-card--visual pick-card--kit${awayKitId === 'custom' ? ' pick-card--active' : ''}`}
            onClick={() => setAwayKitId('custom')}
          >
            <KitShirt primary={awayCustomPrimary} trim={awayCustomTrim} pattern={awayCustomPattern} neck={awayCustomNeck} size={48} uid="away-custom-chip" />
            <div className="pick-card__title">Design your own</div>
          </button>
        </div>

        {awayKitId === 'custom' && (
          <div className="custom-kit-editor">
            <p className="custom-kit-editor__note">Away has more room to move — pick from colours Boro have actually worn on the road.</p>
            <ColourSwatchRow
              label="Body colour"
              options={AWAY_CUSTOM_PALETTE.primary}
              value={awayCustomPrimary}
              onChange={setAwayCustomPrimary}
            />
            <ColourSwatchRow
              label="Trim (neck & sleeves)"
              options={AWAY_CUSTOM_PALETTE.trim}
              value={awayCustomTrim}
              onChange={setAwayCustomTrim}
            />
            <label>
              Neck style
              <select value={awayCustomNeck} onChange={(e) => setAwayCustomNeck(e.target.value)}>
                <option value="v">V-neck</option>
                <option value="crew">Crew</option>
                <option value="collar">Collar</option>
              </select>
            </label>
            <label>
              Pattern
              <select value={awayCustomPattern} onChange={(e) => setAwayCustomPattern(e.target.value)}>
                <option value="solid">Plain</option>
                <option value="band">Chest band</option>
                <option value="pinstripe">Pinstripes</option>
              </select>
            </label>
          </div>
        )}
      </section>

      <div className="girder-divider" />

      <section className="setup-section">
        <h2 className="section-title">Manager philosophy</h2>
        <div className="philosophy-grid">
          {PHILOSOPHIES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`philosophy-card${philosophyId === p.id ? ' philosophy-card--active' : ''}`}
              onClick={() => setPhilosophyId(p.id)}
            >
              <PhilosophyIcon id={p.id} />
              <div className="philosophy-card__body">
                <div className="pick-card__title">{p.name}</div>
                <div className="pick-card__flavor">{p.copy}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer className="setup-footer">
        Unofficial fan project, not affiliated with Middlesbrough FC.
      </footer>

      <div className="sticky-bar">
        <button type="button" className="primary-btn" disabled={!allChosen} onClick={onStart}>
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
