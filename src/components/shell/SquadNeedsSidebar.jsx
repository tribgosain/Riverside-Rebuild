import { THE_BRIEF, SQUAD_NEEDS } from '../../data/copy.js';

// Persistent across Sell/Sign/XI — a need clears when the player actually
// signs someone in that role this window, so the list visibly reacts to
// what they do rather than just restating fixed squad-depth facts.
export default function SquadNeedsSidebar({ transfersIn }) {
  const signedRoles = new Set(transfersIn.map((t) => t.player.role));

  return (
    <aside className="sidebar rivet-corners">
      <div className="sidebar__block">
        <div className="sidebar__label">The Brief</div>
        <p className="sidebar__brief">&ldquo;{THE_BRIEF}&rdquo;</p>
      </div>
      <div className="girder-divider" />
      <div className="sidebar__block">
        <div className="sidebar__label">Squad Needs</div>
        <ul className="needs-list">
          {SQUAD_NEEDS.map((need) => {
            const cleared = signedRoles.has(need.role);
            return (
              <li key={need.id} className={`needs-list__item${cleared ? ' needs-list__item--cleared' : ''}`}>
                <span className={`needs-list__priority needs-list__priority--${need.priority.toLowerCase()}`}>
                  {cleared ? '✓' : need.priority}
                </span>
                <span className="needs-list__label">{need.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
