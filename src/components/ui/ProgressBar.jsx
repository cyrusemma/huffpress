import React from 'react';

export function ProgressBar({
  progress = 0, // 0 to 100
  color = 'violet', // 'violet' | 'cyan' | 'green' | 'amber'
  height = 'h-2',
  showLabel = false,
  label = '',
  animated = false,
  className = ''
}) {
  const clamped = Math.min(100, Math.max(0, progress));

  const colorStyles = {
    violet: 'bg-gradient-to-r from-purple-600 to-indigo-500 shadow-[0_0_12px_rgba(124,58,237,0.5)]',
    cyan: 'bg-gradient-to-r from-cyan-500 to-teal-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]',
    green: 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    amber: 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1.5">
          <span>{label}</span>
          <span className="font-semibold text-slate-200">{clamped.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full bg-[#1A1A28] rounded-full overflow-hidden border border-[#242436] ${height}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles[color] || colorStyles.violet} ${animated ? 'animate-beam' : ''}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
