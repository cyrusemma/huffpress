import React from 'react';
import { PieChart, Layers, CheckCircle2, Zap } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { formatBytes } from '../../core/fileUtils.js';

export function CompressionChart({ stats }) {
  if (!stats) return null;

  const original = Math.max(stats.originalBytes, 1);
  const payload = stats.compressedPayloadBytes;
  const headerOverhead = Math.max(0, stats.totalCompressedBytes - payload);
  const saved = Math.max(0, original - stats.totalCompressedBytes);

  const payloadPct = ((payload / original) * 100).toFixed(1);
  const headerPct = ((headerOverhead / original) * 100).toFixed(1);
  const savedPct = ((saved / original) * 100).toFixed(1);

  // SVG Donut calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89

  const payloadStroke = (Math.min(100, Math.max(0, parseFloat(payloadPct))) / 100) * circumference;
  const headerStroke = (Math.min(100, Math.max(0, parseFloat(headerPct))) / 100) * circumference;
  const savedStroke = (Math.min(100, Math.max(0, parseFloat(savedPct))) / 100) * circumference;

  const payloadOffset = 0;
  const headerOffset = -payloadStroke;
  const savedOffset = -(payloadStroke + headerStroke);

  return (
    <Card
      title="Storage & Redundancy Breakdown"
      subtitle="Visual representation of bytes preserved vs redundant entropy eliminated"
      icon={PieChart}
      className="flex flex-col justify-between"
    >
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        {/* SVG Donut Chart */}
        <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-[#1A1A28]"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Payload segment (Cyan) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-cyan-400 transition-all duration-700"
              strokeWidth="12"
              strokeDasharray={`${payloadStroke} ${circumference}`}
              strokeDashoffset={payloadOffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Header overhead segment (Violet) */}
            {headerStroke > 0 && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-purple-500 transition-all duration-700"
                strokeWidth="12"
                strokeDasharray={`${headerStroke} ${circumference}`}
                strokeDashoffset={headerOffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            )}
            {/* Space saved segment (Emerald) */}
            {savedStroke > 0 && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-emerald-400 transition-all duration-700"
                strokeWidth="12"
                strokeDasharray={`${savedStroke} ${circumference}`}
                strokeDashoffset={savedOffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            )}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-display text-emerald-400">
              {stats.fileSavingsPercent > 0 ? `-${stats.fileSavingsPercent}%` : stats.compressionRatio}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {stats.fileSavingsPercent > 0 ? 'SAVINGS' : 'RATIO'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 w-full max-w-xs text-xs font-mono">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#161622] border border-[#222234]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <span className="text-slate-300">Packed Bitstream:</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-white">{formatBytes(payload)}</span>
              <span className="text-slate-400 ml-1">({payloadPct}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#161622] border border-[#222234]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(124,58,237,0.6)]" />
              <span className="text-slate-300">Header / Table:</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-white">{formatBytes(headerOverhead)}</span>
              <span className="text-slate-400 ml-1">({headerPct}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#161622] border border-[#222234]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-slate-300">Redundancy Saved:</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-emerald-400">{formatBytes(saved)}</span>
              <span className="text-slate-400 ml-1">({savedPct}%)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
