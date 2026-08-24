import React from 'react';
import { Layers, ArrowRight, GitCommit } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { formatChar } from '../../core/huffman.js';

export function HeapVisualizer({ heapSnapshot = [], extractedLeft, extractedRight, mergedNode }) {
  return (
    <Card
      title="Priority Queue (Min-Heap State)"
      subtitle="Array representation of heap nodes ordered by lowest frequency first (O(1) peek)"
      icon={Layers}
      headerAction={
        <Badge variant="cyan" size="sm">
          Heap Size: {heapSnapshot.length}
        </Badge>
      }
    >
      {/* Visual representation of extracted nodes and merge */}
      {(extractedLeft || extractedRight) && (
        <div className="mb-5 p-3.5 rounded-xl bg-[#161626] border border-purple-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Extracted Min Pair:</span>
            {extractedLeft && (
              <span className="px-2.5 py-1 rounded bg-purple-950/60 text-purple-300 border border-purple-700/40">
                Left: {extractedLeft.isLeaf ? `'${formatChar(extractedLeft.char)}'` : 'Subtree'} (freq: {extractedLeft.freq})
              </span>
            )}
            <span className="text-slate-400">+</span>
            {extractedRight && (
              <span className="px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-700/40">
                Right: {extractedRight.isLeaf ? `'${formatChar(extractedRight.char)}'` : 'Subtree'} (freq: {extractedRight.freq})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-purple-400" />
            {mergedNode && (
              <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                New Parent Weight: {mergedNode.freq}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Heap Array Elements */}
      {heapSnapshot.length === 0 ? (
        <div className="py-6 text-center text-xs font-mono text-slate-400">
          Priority queue is empty (Tree construction complete).
        </div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {heapSnapshot.map((node, idx) => {
            const isMin = idx === 0;
            return (
              <div
                key={node.id || idx}
                className={`flex-shrink-0 p-3 rounded-xl border text-center transition-all ${
                  isMin
                    ? 'bg-gradient-to-b from-purple-950/80 to-[#1A1A2C] border-purple-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]'
                    : 'bg-[#141420] border-[#222234] text-slate-300'
                }`}
                style={{ minWidth: '95px' }}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-mono text-slate-400">
                    [{idx}]
                  </span>
                  {isMin && (
                    <span className="text-[9px] font-mono uppercase px-1 rounded bg-purple-600 text-white font-bold">
                      MIN
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold font-display text-slate-100 truncate">
                  {node.isLeaf ? formatChar(node.char) : 'Internal'}
                </div>

                <div className="text-xs font-mono text-cyan-400 mt-1">
                  freq: <span className="font-semibold">{node.freq}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
