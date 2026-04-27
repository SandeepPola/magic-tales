import React from 'react';

const STEP_LABELS = ['Character', 'Theme', 'Mode', 'Story'];

export default function StepDots({ current }) {
  return (
    <div className="step-dots">
      {STEP_LABELS.map((_, i) => (
        <div
          key={i}
          className={`step-dot ${i < current ? 'done' : i === current ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}
