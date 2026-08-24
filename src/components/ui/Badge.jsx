import React from 'react';

/**
 * Reusable pill badge component for tags, code lengths, statuses, and file types.
 */
export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  dot = false 
}) {
  const variantStyles = {
    default: 'bg-[#1E1E2E] text-slate-300 border-[#2E2E3E]',
    violet: 'bg-purple-950/40 text-purple-300 border-purple-800/50 shadow-[0_0_10px_rgba(124,58,237,0.2)]',
    cyan: 'bg-cyan-950/40 text-cyan-300 border-cyan-800/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    green: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    amber: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
    rose: 'bg-rose-950/40 text-rose-300 border-rose-800/50'
  };

  const dotColors = {
    default: 'bg-slate-400',
    violet: 'bg-purple-400 animate-pulse',
    cyan: 'bg-cyan-400 animate-pulse',
    green: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-mono',
    md: 'text-xs px-2.5 py-1 font-mono font-medium',
    lg: 'text-sm px-3 py-1.5 font-mono font-semibold'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.md} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />}
      {children}
    </span>
  );
}
