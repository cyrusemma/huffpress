import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon: Icon = null,
  iconRight: IconRight = null,
  className = '',
  type = 'button',
  title = ''
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variantStyles = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] border border-purple-500/30",
    cyan: "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] border border-cyan-500/30",
    success: "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] border border-emerald-500/30",
    outline: "bg-[#111118]/80 hover:bg-[#1A1A26] text-slate-200 border border-[#2E2E3E] hover:border-purple-500/50 hover:text-white",
    ghost: "bg-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-transparent",
    danger: "bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/40"
  };

  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5 font-semibold",
    icon: "p-2 aspect-square"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? "w-3.5 h-3.5" : "w-4 h-4"} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className={size === 'sm' ? "w-3.5 h-3.5" : "w-4 h-4"} />}
    </button>
  );
}
