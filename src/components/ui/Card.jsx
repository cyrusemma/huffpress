import React from 'react';

export function Card({
  children,
  title,
  subtitle,
  icon: Icon = null,
  headerAction = null,
  className = '',
  bodyClassName = '',
  glow = 'none', // 'none' | 'violet' | 'cyan' | 'green'
  isGlass = true
}) {
  const glowStyles = {
    none: '',
    violet: 'hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(124,58,237,0.15)]',
    cyan: 'hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]',
    green: 'hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]'
  };

  return (
    <div className={`rounded-xl border border-[#1E1E2E] transition-all duration-300 ${isGlass ? 'bg-[#111118]/90 backdrop-blur-md' : 'bg-[#111118]'} ${glowStyles[glow]} ${className}`}>
      {(title || subtitle || Icon || headerAction) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E2E]/80">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-[#161624] border border-[#262638] text-purple-400">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && <h3 className="text-sm font-semibold text-slate-100 tracking-wide font-display">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}
