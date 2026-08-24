import React from 'react';
import { 
  HardDrive, 
  Zap, 
  TrendingDown, 
  Binary, 
  PieChart, 
  Activity,
  Layers
} from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { formatBytes } from '../../core/fileUtils.js';

export function StatsRow({ stats }) {
  if (!stats) return null;

  const isSaving = stats.fileSavingsPercent > 0;

  const metrics = [
    {
      id: 'original',
      title: 'Original Size',
      value: formatBytes(stats.originalBytes),
      subvalue: `${stats.originalBits.toLocaleString()} bits (${stats.originalChars} chars)`,
      icon: HardDrive,
      accent: 'text-slate-300',
      badge: 'Uncompressed'
    },
    {
      id: 'compressed',
      title: 'Compressed Size',
      value: formatBytes(stats.totalCompressedBytes),
      subvalue: `${stats.compressedBits.toLocaleString()} payload bits`,
      icon: Zap,
      accent: 'text-cyan-400',
      badge: '.huff File'
    },
    {
      id: 'savings',
      title: 'Space Saved',
      value: `${stats.fileSavingsPercent}%`,
      subvalue: `Raw bitstream saving: ${stats.rawSavingsPercent}%`,
      icon: TrendingDown,
      accent: isSaving ? 'text-emerald-400' : 'text-amber-400',
      badge: isSaving ? 'Reduced' : 'Small File Overhead'
    },
    {
      id: 'ratio',
      title: 'Compression Ratio',
      value: stats.compressionRatio,
      subvalue: `Entropy: ${stats.entropy} bits/char`,
      icon: Activity,
      accent: 'text-purple-400',
      badge: `${stats.avgBitsPerChar} avg bits/char`
    }
  ];

  return (
    <div className="stats-grid">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-[#111118] border border-[#1E1E2E] hover:border-[#2E2E44] transition-all relative overflow-hidden group shadow-lg"
          >
            {/* Ambient corner glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#171724] border border-[#262638] text-slate-300">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-slate-400">{m.title}</span>
              </div>
              <Badge size="sm" variant={m.id === 'savings' && isSaving ? 'green' : m.id === 'compressed' ? 'cyan' : 'default'}>
                {m.badge}
              </Badge>
            </div>

            <div className="mt-2">
              <div className={`text-2xl font-bold font-display tracking-tight ${m.accent}`}>
                {m.value}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                {m.subvalue}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
