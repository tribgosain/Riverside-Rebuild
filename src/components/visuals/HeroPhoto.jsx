import heroImg from '../../assets/riverside-hero.webp';

// Real photo, not generated: aerial view of the Riverside Stadium (with the
// Transporter Bridge visible upriver), Arne Müseler, CC BY-SA 3.0 DE, via
// Wikimedia Commons. Treated as a duotone photograph (shadows to ink,
// highlights to cream) via an SVG filter, plus a fade into the page
// background — rather than a full-colour hero, to stay in the cream/
// newsprint identity instead of a glossy saturated photo hero. A visible
// halftone dot overlay was tried and dropped in round27 — it read as a
// heavy-handed filter rather than a considered photo treatment; duotone
// alone reads more premium.
export default function HeroPhoto() {
  return (
    <figure className="setup-hero-photo">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="duotone-ink-cream" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.2126 0.7152 0.0722 0 0
                      0.2126 0.7152 0.0722 0 0
                      0.2126 0.7152 0.0722 0 0
                      0      0      0      1 0"
            />
            {/* Shadows -> ink (#1A1714), highlights -> cream (#F2ECE1) */}
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.102 0.949" />
              <feFuncG type="table" tableValues="0.090 0.925" />
              <feFuncB type="table" tableValues="0.078 0.882" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div className="setup-hero-photo__frame">
        <img
          className="setup-hero-photo__img"
          src={heroImg}
          alt="Aerial view of the Riverside Stadium, Middlesbrough, with the Transporter Bridge visible upriver"
        />
        <div className="setup-hero-photo__fade" aria-hidden="true" />
        <figcaption className="setup-hero-photo__caption">
          Arne Müseler, CC BY-SA 3.0 DE, via Wikimedia Commons
        </figcaption>
      </div>
    </figure>
  );
}
