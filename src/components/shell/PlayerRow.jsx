import { blurbFor } from '../../engine/blurbs.js';
import { TAG_COPY } from '../../engine/recommendations.js';

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function PlayerRow({ player, tags = [], actionLabel, actionDisabled, actionBlocked, onAction, actionClass, showClub }) {
  return (
    <li className="player-card">
      <div className="player-card__avatar">{initials(player.name)}</div>
      <div className="player-card__body">
        <div className="player-card__top">
          <span className="player-card__name">{player.name}</span>
          {player.localLad && <span className="tag tag--local">Teesside</span>}
        </div>
        <div className="player-card__meta">
          {player.role} &middot; Age {player.age}
          {showClub && player.fromClub ? ` · ${player.fromClub}` : ''}
          {' · '}
          {player.value > 0 ? `£${player.value}m` : 'Free'}
          {showClub ? ` · £${player.wage}k/wk` : ''}
        </div>
        <p className="player-card__blurb">{blurbFor(player)}</p>
        {tags.length > 0 && (
          <div className="tag-row">
            {tags.map((t) => (
              <span key={t} className={`tag ${TAG_COPY[t].className}`}>
                {TAG_COPY[t].label}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className={`action-btn ${actionClass}${actionBlocked ? ' action-btn--blocked' : ''}`}
        disabled={actionDisabled}
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </li>
  );
}
