import React from 'react';
import { LENGTHS } from '../utils/constants.js';

function getModeBanner(ageGroup) {
  if (ageGroup === '3–5') {
    return {
      type: 'prereader',
      text: '📖 Pre-reader mode: simple vocabulary (1–2 syllables), short sentences, and word highlighting as each page is read aloud.',
    };
  }
  return null;
}

function getCharLabel(state) {
  if (state.charMode === 'custom') return state.customChar.trim();
  return `${state.presetEmoji} ${state.presetType}`;
}

export default function ModeStep({ state, onChange, onNext, onBack }) {
  const { ageGroup, length, nightMode, isPreReaderMode } = state;
  const banner = nightMode ? null : (isPreReaderMode ? getModeBanner(ageGroup) : null);

  // In bedtime mode, always use listening. In regular mode, always use reading.
  const effectiveStoryMode = nightMode ? 'listen' : 'read';

  return (
    <>
      <div className="card">
        {nightMode ? (
          <>
            <h2 className="card-title">Bedtime Player</h2>
            <p className="card-sub">
              Professional audio narration with sleep timer and speed control
            </p>
          </>
        ) : (
          <>
            <h2 className="card-title">Reading Mode</h2>
            <p className="card-sub">
              {ageGroup === '3–5'
                ? 'Big text, one page at a time. Read aloud with word highlighting.'
                : 'Full story text. Optional audio playback.'}
            </p>
          </>
        )}

        {banner && <div className={`info-banner ${banner.type}`}>{banner.text}</div>}

        {!nightMode && (
          <>
            <div className="section-label">Learning to read?</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
              <button
                className={`chip ${!isPreReaderMode ? 'sel' : ''}`}
                onClick={() => onChange({ isPreReaderMode: false })}
              >
                No, standard vocabulary
              </button>
              <button
                className={`chip ${isPreReaderMode ? 'sel' : ''}`}
                onClick={() => onChange({ isPreReaderMode: true })}
              >
                Yes, simple words & big text
              </button>
            </div>
          </>
        )}

        <div className="section-label">Story length</div>
        <div className="chip-group">
          {Object.entries(LENGTHS).map(([key, val]) => (
            <button
              key={key}
              className={`chip ${length === key ? 'sel' : ''}`}
              onClick={() => onChange({ length: key })}
            >
              {val.label}{' '}
              <span className="chip-hint">{val.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card summary-card">
        <div className="summary-label">Your story</div>
        <div className="badge-row">
          <span className="badge">{getCharLabel(state)}</span>
          <span className="badge">{state.theme}</span>
          <span className="badge">{ageGroup} yrs</span>
          <span className="badge">
            {nightMode
              ? '🎧 Bedtime player'
              : isPreReaderMode
              ? '📖 Pre-reader'
              : '📖 Reading'}
          </span>
          {nightMode && <span className="badge">🌙 Bedtime</span>}
        </div>
      </div>

      <div className="btn-row">
        <button className="btn" onClick={onBack}>← Back</button>
        <button className="btn primary" onClick={onNext}>
          ✨ Create story
        </button>
      </div>
    </>
  );
}
