import { useEffect, useState } from 'react';
import { SPONSORS, KIT_COLOURWAYS } from '../data/copy.js';
import Landing from './Landing.jsx';
import Decisions from './Decisions.jsx';

const NAME_MAX = 24;

// Flow controller for the two-screen Setup experience — Landing (photo,
// headline, brief, name) then Decisions (mandate/sponsor/kit/philosophy),
// a hard split rather than a scroll position: `stage` decides which one
// actually renders, so Landing's content isn't present in the DOM at all
// while on Decisions and vice versa. All picks stay local state here,
// owned by neither child, until the final "Take charge" dispatches
// SETUP_COMPLETE and the game actually begins.
export default function Setup({ dispatch, challenge }) {
  const [stage, setStage] = useState('landing');
  const [name, setName] = useState('');
  const [mandateKey, setMandateKey] = useState(challenge?.m || null);
  const [sponsorId, setSponsorId] = useState(challenge?.sp || null);
  const [homeKitId, setHomeKitId] = useState(challenge?.kit?.id || null);
  const [awayKitId, setAwayKitId] = useState(null);
  const [customPrimary, setCustomPrimary] = useState('#E2231A');
  const [customTrim, setCustomTrim] = useState('#FFFFFF');
  const [customPattern, setCustomPattern] = useState('solid');
  const [customNeck, setCustomNeck] = useState('v');
  const [awayCustomPrimary, setAwayCustomPrimary] = useState('#F2C230');
  const [awayCustomTrim, setAwayCustomTrim] = useState('#1E2A5A');
  const [awayCustomPattern, setAwayCustomPattern] = useState('solid');
  const [awayCustomNeck, setAwayCustomNeck] = useState('v');
  const [philosophyId, setPhilosophyId] = useState(null);

  // Landing <-> Decisions is a local stage switch, not a state.screen
  // change, so App.jsx's global scroll reset never fires for it — needs
  // its own reset here.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage]);

  const sponsor = sponsorId ? SPONSORS.find((s) => s.id === sponsorId) : null;
  const sponsorAllowed = !sponsor || !sponsor.restrictedTo || sponsor.restrictedTo.includes(mandateKey);
  const trimmedName = name.trim().slice(0, NAME_MAX);

  const homeKitPreview =
    homeKitId === 'custom'
      ? { id: 'custom', name: 'Design your own', primary: customPrimary, trim: customTrim, pattern: customPattern, neck: customNeck }
      : KIT_COLOURWAYS.find((k) => k.id === homeKitId) || null;
  const awayKitPreview =
    awayKitId === 'custom'
      ? { id: 'custom', name: 'Design your own', primary: awayCustomPrimary, trim: awayCustomTrim, pattern: awayCustomPattern, neck: awayCustomNeck }
      : KIT_COLOURWAYS.find((k) => k.id === awayKitId) || null;

  const allChosen = Boolean(
    trimmedName && mandateKey && sponsorId && sponsorAllowed && homeKitId && awayKitId && philosophyId
  );

  function handleSponsorPick(id) {
    const s = SPONSORS.find((sp) => sp.id === id);
    if (s.restrictedTo && !s.restrictedTo.includes(mandateKey)) return;
    setSponsorId(id);
  }

  function handleMandatePick(key) {
    setMandateKey(key);
    // A sponsor picked under a different mandate can become invalid here —
    // don't leave a now-disallowed sponsor silently selected.
    if (sponsorId) {
      const s = SPONSORS.find((sp) => sp.id === sponsorId);
      if (s?.restrictedTo && !s.restrictedTo.includes(key)) setSponsorId(null);
    }
  }

  function handleStart() {
    if (!allChosen) return;
    dispatch({
      type: 'SETUP_COMPLETE',
      payload: {
        name: trimmedName || 'Gaffer',
        mandateKey,
        sponsorId,
        kit: homeKitPreview,
        awayKit: awayKitPreview,
        philosophyId,
      },
    });
  }

  if (stage === 'landing') {
    return (
      <Landing
        name={name}
        setName={setName}
        challenge={challenge}
        onContinue={() => trimmedName && setStage('decisions')}
      />
    );
  }

  const ctaLabel = allChosen ? `Take charge, ${trimmedName}` : 'Complete every choice above to start';

  return (
    <Decisions
      name={trimmedName}
      onBack={() => setStage('landing')}
      mandateKey={mandateKey}
      onMandatePick={handleMandatePick}
      sponsorId={sponsorId}
      onSponsorPick={handleSponsorPick}
      homeKitId={homeKitId}
      setHomeKitId={setHomeKitId}
      awayKitId={awayKitId}
      setAwayKitId={setAwayKitId}
      homeKitPreview={homeKitPreview}
      awayKitPreview={awayKitPreview}
      customPrimary={customPrimary}
      setCustomPrimary={setCustomPrimary}
      customTrim={customTrim}
      setCustomTrim={setCustomTrim}
      customPattern={customPattern}
      setCustomPattern={setCustomPattern}
      customNeck={customNeck}
      setCustomNeck={setCustomNeck}
      awayCustomPrimary={awayCustomPrimary}
      setAwayCustomPrimary={setAwayCustomPrimary}
      awayCustomTrim={awayCustomTrim}
      setAwayCustomTrim={setAwayCustomTrim}
      awayCustomPattern={awayCustomPattern}
      setAwayCustomPattern={setAwayCustomPattern}
      awayCustomNeck={awayCustomNeck}
      setAwayCustomNeck={setAwayCustomNeck}
      philosophyId={philosophyId}
      setPhilosophyId={setPhilosophyId}
      allChosen={allChosen}
      ctaLabel={ctaLabel}
      onStart={handleStart}
    />
  );
}
