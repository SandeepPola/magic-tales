import React from 'react';
import { THEMES } from '../utils/constants.js';

export default function ThemeStep({ state, onChange, onNext, onBack }) {
  const { theme } = state;

  return (
    <>
      <div className="card">
        <h2 className="card-title">Pick a theme</h2>
        <p className="card-sub">This shapes what the story is really about</p>

        <div className="theme-grid">
          {THEMES.map(({ em, name, desc }) => (
            <button
              key={name}
              className={`theme-card ${theme === name ? 'sel' : ''}`}
              onClick={() => onChange({ theme: name })}
            >
              <div className="theme-em">{em}</div>
              <div className="theme-name">{name}</div>
              <div className="theme-desc">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="btn-row">
        <button className="btn" onClick={onBack}>← Back</button>
        <button className="btn primary" disabled={!theme} onClick={onNext}>
          Next →
        </button>
      </div>
    </>
  );
}
