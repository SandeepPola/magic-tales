import React from 'react';
import { PRESETS, EXAMPLE_CHARACTERS, AGES } from '../utils/constants.js';

export default function CharacterStep({ state, onChange, onNext }) {
  const { charMode, presetType, presetEmoji, customChar, ageGroup } = state;

  const canAdvance =
    charMode === 'preset' ? !!presetType : customChar.trim().length >= 2;

  return (
    <>
      <div className="card">
        <h2 className="card-title">Who's the hero?</h2>
        <p className="card-sub">Choose a preset or type any character you love</p>

        <div className="mode-tabs">
          <button
            className={`mode-tab ${charMode === 'preset' ? 'active' : ''}`}
            onClick={() => onChange({ charMode: 'preset' })}
          >
            Pick a character
          </button>
          <button
            className={`mode-tab ${charMode === 'custom' ? 'active' : ''}`}
            onClick={() => onChange({ charMode: 'custom' })}
          >
            Type any character
          </button>
        </div>

        {charMode === 'preset' ? (
          <div className="preset-grid">
            {PRESETS.map(([em, label]) => (
              <button
                key={label}
                className={`preset-card ${presetType === label ? 'sel' : ''}`}
                onClick={() => onChange({ presetType: label, presetEmoji: em })}
              >
                <span className="preset-em">{em}</span>
                <span className="preset-label">{label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="custom-char">
            <input
              className="text-input"
              placeholder="e.g. Mickey Mouse, Peppa Pig…"
              value={customChar}
              onChange={(e) => onChange({ customChar: e.target.value })}
              maxLength={40}
            />
            <p className="char-hint">
              The story captures this character's personality in an original adventure.
            </p>
            <div className="char-examples">
              {EXAMPLE_CHARACTERS.map((name) => (
                <button
                  key={name}
                  className="example-pill"
                  onClick={() => onChange({ customChar: name })}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="divider" />

        <div className="section-label">Age group</div>
        <div className="chip-group">
          {AGES.map((age) => (
            <button
              key={age}
              className={`chip ${ageGroup === age ? 'sel' : ''}`}
              onClick={() => onChange({ ageGroup: age })}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      <div className="btn-row">
        <button className="btn primary" disabled={!canAdvance} onClick={onNext}>
          Next →
        </button>
      </div>
    </>
  );
}
