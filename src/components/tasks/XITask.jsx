import { useEffect, useState } from 'react';
import { FORMATIONS, formationRequirements, bestXI } from '../../engine/strength.js';
import { checkXILegality } from '../../state/taskGate.js';
import { PITCH_LAYOUT } from '../../engine/pitchLayout.js';
import Pitch from '../visuals/Pitch.jsx';

function shortName(name) {
  const parts = name.split(' ');
  return parts.length > 1 ? parts[parts.length - 1] : name;
}

// Assigns xi players to layout slots by position, in xi array order — used
// only to seed/reseed slotMap (on mount and whenever formation changes).
// Once seeded, individual slot edits go straight into slotMap by index so a
// tap on a SPECIFIC slot always binds to that slot, not "next available".
function deriveSlotMap(layout, xiPlayers) {
  const byPos = { GK: [], DF: [], MF: [], FW: [] };
  xiPlayers.forEach((p) => byPos[p.pos]?.push(p));
  const cursor = { GK: 0, DF: 0, MF: 0, FW: 0 };
  const map = {};
  layout.forEach((slot, i) => {
    const player = byPos[slot.pos][cursor[slot.pos]++];
    if (player) map[i] = player.id;
  });
  return map;
}

// Visual, tap-to-assign pitch — the mobile-friendly alternative to drag and
// drop. Explicit two-step: tap a slot, then tap a player from the roster
// list to fill it — never implicit ordering, which is what previously let
// right-side slots silently fill from the left. Reused for both the
// regular Sell→Sign→XI task and the playoff XI screen, which is the same
// UI on a frozen squad.
export default function XITask({
  squad,
  formation,
  xi,
  onSetFormation,
  onToggle,
  onSetXi,
  onConfirm,
  onBack,
  title,
  confirmLabel,
  onIllegalAttempt,
}) {
  const [activeSlotIndex, setActiveSlotIndex] = useState(null);
  const layout = PITCH_LAYOUT[formation];

  const [slotMap, setSlotMap] = useState(() =>
    deriveSlotMap(layout, xi.map((id) => squad.find((p) => p.id === id)).filter(Boolean))
  );

  // Re-seed only when the formation actually changes — never on every xi
  // change, otherwise our own onToggle calls below would immediately stomp
  // the explicit slot binding we just set.
  useEffect(() => {
    const xiPlayers = xi.map((id) => squad.find((p) => p.id === id)).filter(Boolean);
    setSlotMap(deriveSlotMap(PITCH_LAYOUT[formation], xiPlayers));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formation]);

  const required = formationRequirements(formation);
  const xiPlayers = xi.map((id) => squad.find((p) => p.id === id)).filter(Boolean);
  const { legal, reasons } = checkXILegality(xiPlayers);
  // Counted by which SLOT is filled, not the filled-in player's own listed
  // position — a player can be fielded anywhere regardless of what the
  // system thinks their natural position is, so a forward filling a
  // midfield slot correctly counts as that slot's requirement being met.
  const counts = layout.reduce((acc, slot, i) => {
    if (slotMap[i]) acc[slot.pos] = (acc[slot.pos] || 0) + 1;
    return acc;
  }, {});

  const bySquadId = Object.fromEntries(squad.map((p) => [p.id, p]));
  const renderSlots = layout.map((slot, i) => ({
    ...slot,
    index: i,
    player: slotMap[i] ? bySquadId[slotMap[i]] || null : null,
  }));

  const slottedIds = new Set(Object.values(slotMap));
  const overflow = xiPlayers.filter((p) => !slottedIds.has(p.id));

  const activeSlot = activeSlotIndex !== null ? renderSlots[activeSlotIndex] : null;
  // Any squad player can fill any slot — no pos/role restriction. Natural
  // fits (matching role, then matching broad pos) sort to the top purely
  // as a convenience, not a limit on who's selectable.
  const pickerOptions = activeSlot
    ? squad
        .filter((p) => !xi.includes(p.id))
        .sort((a, b) => {
          const aFit = a.role === activeSlot.role ? 2 : a.pos === activeSlot.pos ? 1 : 0;
          const bFit = b.role === activeSlot.role ? 2 : b.pos === activeSlot.pos ? 1 : 0;
          if (aFit !== bFit) return bFit - aFit;
          return b.ovr - a.ovr;
        })
    : [];

  function handleSlotClick(slot) {
    if (slot.player) {
      onToggle(slot.player.id);
      setSlotMap((prev) => {
        const next = { ...prev };
        delete next[slot.index];
        return next;
      });
      return;
    }
    setActiveSlotIndex(slot.index);
  }

  function handlePick(playerId) {
    onToggle(playerId);
    setSlotMap((prev) => ({ ...prev, [activeSlotIndex]: playerId }));
    setActiveSlotIndex(null);
  }

  function handleBenchOverflow(playerId) {
    onToggle(playerId);
  }

  function handleAutoPick() {
    if (!onSetXi) return;
    const map = bestXI(squad, formation);
    setSlotMap(map);
    onSetXi(Object.values(map));
  }

  function handleClear() {
    setSlotMap({});
    if (onSetXi) onSetXi([]);
  }

  function handleConfirmClick() {
    if (!legal) {
      onIllegalAttempt?.();
      return;
    }
    onConfirm();
  }

  return (
    <>
      {onBack && (
        <button type="button" className="back-link" onClick={onBack}>
          &larr; Back
        </button>
      )}
      <h1 className="task-title">{title || 'Pick your XI'}</h1>

      <div className="chip-row chip-row--filters">
        {Object.keys(FORMATIONS).map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-chip${formation === f ? ' filter-chip--active' : ''}`}
            onClick={() => onSetFormation(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {onSetXi && (
        <div className="chip-row">
          <button type="button" className="secondary-btn" onClick={handleAutoPick}>
            Auto-pick XI
          </button>
          <button type="button" className="secondary-btn" onClick={handleClear}>
            Clear
          </button>
        </div>
      )}

      <div className="xi-progress">
        {Object.entries(required).map(([pos, need]) => (
          <span key={pos} className={`xi-progress__item${(counts[pos] || 0) === need ? ' xi-progress__item--met' : ''}`}>
            {pos} {counts[pos] || 0}/{need}
          </span>
        ))}
        <span className="xi-progress__total">{xi.length}/11 selected</span>
      </div>

      {!legal && xi.length > 0 && <div className="nudge nudge--warn">{reasons.join(' ')}</div>}

      <div className="pitch">
        <Pitch />
        {renderSlots.map((slot) => (
          <button
            key={slot.index}
            type="button"
            className={`pitch-slot${slot.player ? ' pitch-slot--filled' : ' pitch-slot--empty'}`}
            style={{ top: `${slot.top}%`, left: `${slot.left}%` }}
            onClick={() => handleSlotClick(slot)}
          >
            {slot.player ? (
              <>
                <span className="pitch-slot__name">{shortName(slot.player.name)}</span>
                <span className="pitch-slot__ovr">{slot.player.ovr}</span>
              </>
            ) : (
              <>
                <span className="pitch-slot__plus">+</span>
                <span className="pitch-slot__pos">{slot.role}</span>
              </>
            )}
          </button>
        ))}
      </div>

      {overflow.length > 0 && (
        <div className="overflow-strip">
          <div className="overflow-strip__label">Doesn't fit this formation — tap to bench</div>
          <div className="chip-row">
            {overflow.map((p) => (
              <button key={p.id} type="button" className="filter-chip filter-chip--active" onClick={() => handleBenchOverflow(p.id)}>
                {shortName(p.name)} ({p.role})
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSlot && (
        <>
          <div className="sheet-backdrop" onClick={() => setActiveSlotIndex(null)} />
          <div className="sheet">
            <div className="sheet__header">
              <span>Pick your {activeSlot.role}</span>
              <button type="button" className="sheet__close" onClick={() => setActiveSlotIndex(null)}>
                Close
              </button>
            </div>
            <ul className="player-list sheet__list">
              {pickerOptions.length === 0 && (
                <li className="task-subtitle">No available {activeSlot.role} players — sign more, or bench one already on the pitch.</li>
              )}
              {pickerOptions.map((p) => (
                <li key={p.id} className="player-row">
                  <div className="player-row__info">
                    <div className="player-row__name">
                      {p.name}
                      {p.role === activeSlot.role && <span className="tag tag--upgrade">Natural fit</span>}
                      {p.localLad && <span className="tag tag--local">Teesside</span>}
                    </div>
                    <div className="player-row__meta">{p.role} &middot; OVR {p.ovr}</div>
                  </div>
                  <button type="button" className="action-btn action-btn--add" onClick={() => handlePick(p.id)}>
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="sticky-bar">
        <button
          type="button"
          className={`primary-btn${!legal ? ' action-btn--blocked' : ''}`}
          onClick={handleConfirmClick}
        >
          {legal ? confirmLabel || 'Confirm XI' : 'XI not legal yet'}
        </button>
      </div>
    </>
  );
}
