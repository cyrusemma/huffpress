import React from 'react';
import { 
  FolderUp, 
  Cpu, 
  GitFork, 
  ArchiveRestore, 
  BookOpen, 
  Terminal, 
  Sparkles
} from 'lucide-react';
import { Badge } from '../ui/Badge.jsx';
import { LogoIcon } from '../ui/LogoIcon.jsx';

export function Sidebar({ activeTab, setActiveTab, stats }) {
  const navItems = [
    {
      id: 'home',
      label: 'Upload & Input',
      icon: FolderUp,
      desc: 'Drag & drop or presets'
    },
    {
      id: 'compress',
      label: 'Compression',
      icon: Cpu,
      desc: 'Freq table & bit codes',
      badge: stats ? stats.compressionRatio : null
    },
    {
      id: 'visualizer',
      label: 'Tree Visualizer',
      icon: GitFork,
      desc: 'Step-by-step Min-Heap',
      highlight: true
    },
    {
      id: 'decompress',
      label: 'Decompress',
      icon: ArchiveRestore,
      desc: 'Unpack .huff files'
    },
    {
      id: 'about',
      label: 'DSA & Viva Prep',
      icon: BookOpen,
      desc: 'Theory & flashcards'
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0D0D14] border-r border-[#1E1E2E] flex flex-col justify-between z-20 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#1E1E2E]/80 flex items-center gap-3">
          <LogoIcon size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg tracking-tight gradient-text-hero">
                HuffPress
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Huffman Engine • DSA</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-950/60 to-[#161626] border border-purple-500/40 text-white shadow-[0_0_20px_rgba(124,58,237,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#141420] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1.5 rounded-lg ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.6)]' 
                      : 'bg-[#181824] text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-medium leading-none flex items-center gap-1.5">
                      {item.label}
                      {item.highlight && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">
                      {item.desc}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <Badge variant="cyan" size="sm" className="ml-2">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 m-3 rounded-xl bg-[#11111C] border border-[#1E1E2E] text-xs">
        <div className="flex items-center gap-2 text-purple-300 font-mono mb-1">
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px]">Pied Piper Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Lossless prefix coding with <span className="text-cyan-400 font-mono">O(C log C)</span> heap efficiency.
        </p>
        <div className="mt-2.5 pt-2 border-t border-[#1E1E2E] flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>STATUS: ONLINE</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            READY
          </span>
        </div>
      </div>
    </aside>
  );
}
