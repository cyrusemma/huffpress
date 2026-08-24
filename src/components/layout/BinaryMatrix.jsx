import React, { useMemo } from 'react';

/**
 * Ambient background component with subtle glowing binary stream columns
 */
export function BinaryMatrix() {
  const columns = useMemo(() => {
    const cols = [];
    const charSets = ['0', '1', '0', '1', 'H', 'U', 'F', 'F'];
    for (let i = 0; i < 18; i++) {
      let stream = '';
      for (let j = 0; j < 35; j++) {
        stream += charSets[Math.floor(Math.random() * charSets.length)] + ' ';
      }
      cols.push({
        id: i,
        left: `${(i * 5.8) + (Math.random() * 2)}%`,
        duration: `${14 + (i % 6) * 4}s`,
        delay: `${(i % 5) * 1.5}s`,
        opacity: 0.03 + (i % 3) * 0.02,
        stream
      });
    }
    return cols;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-grid-pattern bg-radial-vignette opacity-70">
      {columns.map((col) => (
        <div
          key={col.id}
          className="absolute top-0 font-mono text-[10px] select-none text-purple-400 whitespace-pre"
          style={{
            left: col.left,
            opacity: col.opacity,
            animation: `matrixScroll ${col.duration} linear infinite`,
            animationDelay: col.delay
          }}
        >
          {col.stream}
          {'\n'}
          {col.stream}
        </div>
      ))}
    </div>
  );
}
