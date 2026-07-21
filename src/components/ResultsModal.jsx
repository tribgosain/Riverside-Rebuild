import { useRef, useState } from 'react';
import { toBlob } from 'html-to-image';
import { MANDATES, SPONSORS } from '../data/copy.js';
import SponsorBadge from './visuals/SponsorBadge.jsx';
import KitShirt from './visuals/KitShirt.jsx';

const CAN_COPY_IMAGES = typeof window !== 'undefined' && typeof window.ClipboardItem !== 'undefined';

// Feature-detected once at module load with a throwaway file — accurate
// (unlike sniffing the UA) and cheap. True on iOS Safari / Android Chrome,
// false on desktop browsers, which is exactly the primary/fallback split
// this needs: the native OS share sheet on mobile (can save straight to
// Photos, or hand the image directly to the X app, no manual paste), the
// existing clipboard-copy + open-X-tab flow everywhere else.
const SUPPORTS_SHARE_FILES = (() => {
  if (typeof navigator === 'undefined' || !navigator.canShare) return false;
  try {
    return navigator.canShare({ files: [new File(['test'], 'test.png', { type: 'image/png' })] });
  } catch {
    return false;
  }
})();
// A plain, transparent readout of the actual grading logic — not flavour
// text. Round30: one uniform standard regardless of mandate — this club
// reached a real playoff final last season, so playoffs is the floor no
// matter how constrained the budget was. Wording reflects that
// philosophy directly: A+ is the actual goal (promotion), A is the
// minimum acceptable outcome (playoffs), anything below that is a real
// miss, graded on how far below.
const GRADE_EXPLANATION = {
  'A+': 'promotion — the actual goal, delivered',
  A: 'playoffs reached — the floor, minimum acceptable',
  C: 'missed the playoffs — below the minimum expectation',
  D: 'well below what the season needed to deliver',
  F: 'relegation-level underperformance',
};

// Round30: rewritten to be a self-contained recap sentence — the card's
// mandate line and headline (grade+position) already show that context
// elsewhere on the redesigned card, so this doesn't need to repeat them,
// just state the qualitative read plainly for whoever's looking at the
// card with none of that context pre-loaded (e.g. a stranger on X).
function gradeExplanation({ promoted, position, grade }) {
  if (promoted) return "Promoted via the playoffs — the board can't ask for more than that.";
  const posText = `${position}${ordinalSuffix(position)}`;
  return `Finished ${posText} — ${GRADE_EXPLANATION[grade] || 'graded against a uniform playoffs-as-floor standard.'}`;
}

export default function ResultsModal({ state, dispatch }) {
  const [shareStatus, setShareStatus] = useState('');
  const cardRef = useRef(null);
  const { season, playoff } = state;
  const mandate = MANDATES[state.manager.mandate];
  const sponsor = SPONSORS.find((s) => s.id === state.sponsor);
  const kit = state.kit || {};

  const totalIn = state.transfersIn.reduce((s, t) => s + t.fee, 0);
  const totalOut = state.transfersOut.reduce((s, t) => s + t.fee, 0);
  const net = round2(totalIn - totalOut);

  const promoted = playoff?.result === 'promoted';
  const lostFinal = playoff?.result === 'lost_final';
  const lostSemi = playoff?.result === 'lost_semi';

  // The headline outcome, stated unambiguously — grade alone doesn't say
  // whether a playoff run ended in promotion or defeat, so this line has to.
  let positionLabel;
  let outcomeStatement;
  if (promoted) {
    positionLabel = 'PROMOTED';
    outcomeStatement = 'Won the playoff final — promoted.';
  } else if (lostFinal) {
    positionLabel = 'FINAL DEFEAT';
    outcomeStatement = 'Reached the playoff final. Lost it.';
  } else if (lostSemi) {
    positionLabel = 'SEMI-FINAL EXIT';
    outcomeStatement = 'Reached the playoffs. Lost in the semis.';
  } else {
    positionLabel = null;
    outcomeStatement = null;
  }

  const gradeNote = gradeExplanation({
    promoted,
    position: season.boroPosition,
    grade: season.grade,
  });

  // Computed from the actual page, not hardcoded — so this never goes
  // stale again the way the old hardcoded "riverside-rebuild.pages.dev"
  // watermark did (this project has moved hosts more than once).
  const shareDomain = typeof window !== 'undefined' ? window.location.host : 'riverside-rebuild';

  function shareText() {
    const outcome = promoted
      ? 'PROMOTED'
      : lostFinal
        ? 'Lost the playoff final'
        : lostSemi
          ? 'Lost in the playoff semis'
          : `${ordinal(season.boroPosition)} place`;
    return `${state.manager.name}'s Boro window: ${outcome}, grade ${season.grade}. ${season.boroPoints} pts, net spend ${net >= 0 ? '+' : ''}£${net.toFixed(2)}m. Play Riverside Rebuild.`;
  }

  // Render the card to an image, then share it. Primary path on supporting
  // mobile browsers (iOS Safari, Android Chrome): the native OS share sheet
  // via the Web Share API, file support included — "Save Image" there goes
  // straight to Photos, and tapping the X app icon (if installed) hands the
  // image directly to X, no manual paste. Desktop (and any mobile browser
  // without file-share support) falls back to the old flow: copy the image
  // to the clipboard — or download it if that's not supported either, never
  // fail silently — then open X's share intent with clean pre-filled text.
  // No platform lets a site pre-attach media to a post via a plain link, so
  // the fallback's final paste-it-yourself step is a real platform limit,
  // not something to keep trying to automate away.
  async function handleShare() {
    if (!cardRef.current) {
      setShareStatus('error');
      setTimeout(() => setShareStatus(''), 2500);
      return;
    }
    try {
      const blob = await toBlob(cardRef.current, { pixelRatio: 2, skipFonts: true });
      if (!blob) throw new Error('image render failed');

      const filename = `riverside-rebuild-${state.manager.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      if (SUPPORTS_SHARE_FILES) {
        try {
          await navigator.share({ files: [file], text: shareText() });
          setShareStatus('shared');
          setTimeout(() => setShareStatus(''), 3000);
          return;
        } catch (shareErr) {
          // Person cancelled the OS share sheet — not a failure, don't fall
          // through to the desktop flow and pop a second share surface.
          if (shareErr?.name === 'AbortError') return;
          // Any other failure: fall through to the desktop-style flow below.
        }
      }

      let copiedImage = false;
      if (CAN_COPY_IMAGES) {
        try {
          await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
          copiedImage = true;
        } catch {
          copiedImage = false;
        }
      }

      if (!copiedImage) {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(blobUrl);
      }

      setShareStatus(copiedImage ? 'copied' : 'downloaded');
      setTimeout(() => setShareStatus(''), 3000);

      const siteUrl = `${window.location.origin}${window.location.pathname}`;
      const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(siteUrl)}`;
      window.open(intentUrl, '_blank', 'noopener,noreferrer');
    } catch {
      setShareStatus('error');
      setTimeout(() => setShareStatus(''), 2500);
    }
  }

  let shareLabel = 'Share';
  if (shareStatus === 'shared') shareLabel = 'Shared!';
  else if (shareStatus === 'copied') shareLabel = 'Image copied — opening X…';
  else if (shareStatus === 'downloaded') shareLabel = 'Image downloaded — opening X…';
  else if (shareStatus === 'error') shareLabel = "Couldn't generate image";

  return (
    <div className="screen results-screen">
      <div className="wrapped-card" ref={cardRef} style={{ '--kit-primary': kit.primary, '--kit-trim': kit.trim }}>
        <div className="wrapped-card__shirt">
          <KitShirt primary={kit.trim} trim={kit.primary} pattern={kit.pattern} neck={kit.neck} size={340} uid="wrapped" />
        </div>

        {/* Round30 redesign — content hierarchy for a stranger seeing only
            this image with no app context, in this exact order:
            1. brand, 2. grade+position (the headline), 3. stats,
            4. recap text. A mini league table was deliberately left out —
            at social-share thumbnail sizes a table would either be
            illegible or would force everything above it smaller, which
            trades away the hierarchy this was redesigned around. */}
        <div className="wrapped-card__content">
          <div className="wrapped-card__top-block">
            <div className="wrapped-card__brand">
              RIVERSIDE <em>REBUILD</em>
            </div>

            <div className="wrapped-card__mandate-row">
              <SponsorBadge sponsor={sponsor} size={22} />
              <span className="wrapped-card__mandate">
                {mandate.label} mandate &middot; £{mandate.budget}m budget
              </span>
            </div>
          </div>

          <div className="wrapped-card__headline">
            <div className="wrapped-card__grade">{season.grade}</div>
            <div className={`wrapped-card__position${positionLabel ? ' wrapped-card__position--outcome' : ''}`}>
              {positionLabel || (
                <>
                  {season.boroPosition}
                  <sup>{ordinalSuffix(season.boroPosition)}</sup>
                </>
              )}
            </div>
            {outcomeStatement && <div className="wrapped-card__outcome">{outcomeStatement}</div>}
          </div>

          <div className="wrapped-card__bottom-block">
            <div className="wrapped-card__lower">
              <div className="wrapped-card__manager">{state.manager.name}'s Boro</div>
              <div className="wrapped-card__stats">
                <span>{season.boroRecord.w}W {season.boroRecord.d}D {season.boroRecord.l}L</span>
                <span>{season.boroPoints} pts</span>
                <span>Net {net >= 0 ? '+' : ''}£{net.toFixed(2)}m</span>
              </div>

              <p className="wrapped-card__grade-note">{gradeNote}</p>
            </div>

            <div className="wrapped-card__watermark">{shareDomain}</div>
          </div>
        </div>
      </div>

      <p className="share-row__hint share-row__hint--before">
        {SUPPORTS_SHARE_FILES
          ? "Share opens your device's share sheet — save the image to Photos, or send it straight to the X app."
          : CAN_COPY_IMAGES
            ? 'Share does two things: copies this card as an image, then opens X in a new tab.'
            : 'Share does two things: downloads this card as an image, then opens X in a new tab.'}
      </p>
      {!SUPPORTS_SHARE_FILES && (
        <p className="share-row__hint">
          {CAN_COPY_IMAGES
            ? 'Paste the image into the X post that opens before you send it — that last step has to be done by hand.'
            : 'Attach the downloaded image to the X post that opens before you send it — that last step has to be done by hand.'}
        </p>
      )}

      <div className="sticky-bar sticky-bar--footer">
        <button type="button" className="primary-btn share-row__share-btn" onClick={handleShare}>
          {shareLabel}
        </button>
        <button type="button" className="results-footer__replay" onClick={() => dispatch({ type: 'NEW_WINDOW' })}>
          Have another go
        </button>
      </div>
    </div>
  );
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function ordinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
