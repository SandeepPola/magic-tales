import React, { useMemo } from 'react';

export default function Stars({ visible }) {
  const stars = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1.5,
      x: Math.random() * 96,
      y: Math.random() * 80,
      dur: (Math.random() * 2 + 1.5).toFixed(1),
      delay: (Math.random() * 3).toFixed(1),
      opacity: (Math.random() * 0.4 + 0.3).toFixed(2),
    }));
  }, []);

  if (!visible) return null;

  return (
    <div className="stars-container">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            '--dur': `${s.dur}s`,
            '--delay': `${s.delay}s`,
            '--max-opacity': s.opacity,
          }}
        />
      ))}
    </div>
  );
}
