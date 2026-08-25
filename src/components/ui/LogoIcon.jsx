import React from 'react';

/**
 * Custom HuffPress Brand Icon
 * Represents a binary prefix tree with compression branches and glowing nodes.
 */
export function LogoIcon({ size = 'md', className = '', glow = true }) {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const currentSize = sizeMap[size] || size;

  return (
    <div className={`relative flex-shrink-0 ${currentSize} ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 rounded-xl blur-md opacity-70 animate-pulse pointer-events-none" />
      )}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_2px_12px_rgba(124,58,237,0.6)]"
      >
        <defs>
          <linearGradient id="hpBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1035" />
            <stop offset="50%" stopColor="#0F0F1A" />
            <stop offset="100%" stopColor="#081E2E" />
          </linearGradient>

          <linearGradient id="hpBranchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient id="hpBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>

          <filter id="hpNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Container Rounded Hex/Squircle */}
        <rect
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="12"
          fill="url(#hpBgGrad)"
          stroke="url(#hpBorderGrad)"
          strokeWidth="1.5"
        />

        {/* Tree Branches (Tree Path Lines) */}
        {/* Root (24, 11) -> Left (13, 23) */}
        <path
          d="M24 13 L13 24"
          stroke="url(#hpBranchGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Root (24, 11) -> Right (35, 23) */}
        <path
          d="M24 13 L35 24"
          stroke="url(#hpBranchGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Left (13, 24) -> Leaf 00 (8, 36) */}
        <path
          d="M13 24 L8 36"
          stroke="#9333EA"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Left (13, 24) -> Leaf 01 (18, 36) */}
        <path
          d="M13 24 L18 36"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Right (35, 24) -> Leaf 10 (30, 36) */}
        <path
          d="M35 24 L30 36"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Right (35, 24) -> Leaf 11 (40, 36) */}
        <path
          d="M35 24 L40 36"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Compression Crossbar Clamp Glyph */}
        <path
          d="M16 28 H32"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeDasharray="2 2"
          opacity="0.6"
        />

        {/* Nodes */}
        {/* Root Node (Purple Glow) */}
        <circle
          cx="24"
          cy="13"
          r="4.5"
          fill="#7C3AED"
          stroke="#E9D5FF"
          strokeWidth="1.5"
          filter="url(#hpNodeGlow)"
        />
        <circle cx="24" cy="13" r="1.5" fill="#FFFFFF" />

        {/* Subtree Node 0 (Indigo) */}
        <circle
          cx="13"
          cy="24"
          r="3.5"
          fill="#4F46E5"
          stroke="#C7D2FE"
          strokeWidth="1.2"
        />

        {/* Subtree Node 1 (Cyan) */}
        <circle
          cx="35"
          cy="24"
          r="3.5"
          fill="#0891B2"
          stroke="#A5F3FC"
          strokeWidth="1.2"
        />

        {/* Leaf Nodes */}
        <circle cx="8" cy="36" r="2.5" fill="#C084FC" />
        <circle cx="18" cy="36" r="2.5" fill="#67E8F9" />
        <circle cx="30" cy="36" r="2.5" fill="#22D3EE" />
        <circle cx="40" cy="36" r="2.5" fill="#34D399" />
      </svg>
    </div>
  );
}
