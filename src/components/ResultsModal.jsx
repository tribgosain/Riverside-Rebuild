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
// A plain, transparent readout of the actual grading logic — position
// relative to the chosen mandate's grade bands (engine/grade.js) — not
// flavour text. Wording is keyed off the letter grade itself, since that
// letter is already computed relative to the mandate (see GRADE_BANDS).
// Calibrated against round23's real 25-run test: even genuinely optimal
// play only reached the playoffs 28% of the time, so a B here explicitly
// says missing them isn't a letdown — it's the normal outcome of a good
// window, not a shortfall.
const GRADE_EXPLANATION = {
  'A+': 'a huge overachievement — very few windows reach this',
  A: 'genuinely strong form, right in playoff contention',
  B: "a good season — missing the playoffs from here is the normal outcome of strong play, not a shortfall",
  C: 'below what a well-run window should produce',
  D: 'well below what the board backed you to deliver',
  F: 'relegation-level underperformance',
};

function gradeExplanation({ promoted, mandateLabel, position, grade }) {
  if (promoted) return `Promoted via the playoffs on a ${mandateLabel} mandate — the board can't ask for more than that.`;
  const posText = `${position}${ordinalSuffix(position)}`;
  return `${posText} on a ${mandateLabel} mandate — ${GRADE_EXPLANATION[grade] || 'graded against the board mandate.'}`;
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
    mandateLabel: mandate.label,
    position: season.boroPosition,
    grade: season.grade,
  });

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
        <div className="wrapped-card__wedge" />

        <div className="wrapped-card__shirt">
          <KitShirt primary={kit.trim} trim={kit.primary} pattern={kit.pattern} neck={kit.neck} size={340} uid="wrapped" />
        </div>

        <div className="wrapped-card__top">
          <SponsorBadge sponsor={sponsor} size={30} />
          <span className="wrapped-card__mandate">{mandate.label}</span>
        </div>

        <div className="wrapped-card__grade">{season.grade}</div>

        <div className={`wrapped-card__position${positionLabel ? ' wrapped-card__position--outcome' : ''}`}>
          {positionLabel || (
            <>
              {season.boroPosition}
              <sup>{ordinalSuffix(season.boroPosition)}</sup>
            </>
          )}
        </div>

        <div className="wrapped-card__bottom">
          {outcomeStatement && <div className="wrapped-card__outcome">{outcomeStatement}</div>}
          <div className="wrapped-card__manager">{state.manager.name}'s Boro</div>

          <div className="wrapped-card__stats">
            <span>{season.boroRecord.w}W {season.boroRecord.d}D {season.boroRecord.l}L</span>
            <span>{season.boroPoints} pts</span>
            <span>Net {net >= 0 ? '+' : ''}£{net.toFixed(2)}m</span>
          </div>

          <p className="wrapped-card__grade-note">{gradeNote}</p>
        </div>

        <div className="wrapped-card__watermark">riverside-rebuild.pages.dev</div>
      </div>

      <p className="share-row__hint share-row__hint--before">
        {SUPPORTS_SHARE_FILES
          ? "Share opens your device's share sheet — save the image to Photos, or send it straight to the X app."
          : CAN_COPY_IMAGES
            ? 'Share does two things: copies this card as an image, then opens X in a new tab.'
            : 'Share does two things: downloads this card as an image, then opens X in a new tab.'}
      </p>
      <div className="share-row">
        <button type="button" className="secondary-btn share-row__share-btn" onClick={handleShare}>
          {shareLabel}
        </button>
      </div>
      {!SUPPORTS_SHARE_FILES && (
        <p className="share-row__hint">
          {CAN_COPY_IMAGES
            ? 'Paste the image into the X post that opens before you send it — that last step has to be done by hand.'
            : 'Attach the downloaded image to the X post that opens before you send it — that last step has to be done by hand.'}
        </p>
      )}

      <div className="sticky-bar">
        <button type="button" className="primary-btn" onClick={() => dispatch({ type: 'NEW_WINDOW' })}>
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
