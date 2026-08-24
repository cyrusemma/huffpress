import React from 'react';
import { ArchiveRestore, ShieldCheck, Cpu } from 'lucide-react';
import { DecompressPanel } from '../components/decompress/DecompressPanel.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';

export function Decompress({ fileMeta, packedBlob }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#11111C] border border-[#1E1E2E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ArchiveRestore className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold font-display text-white">
              Decompress & Verify .huff Archives
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Unpacks container headers, parses bitstreams, reconstructs prefix tree paths, and verifies cryptographic SHA-256 integrity.
          </p>
        </div>

        <Badge variant="cyan" size="md" dot>
          Pure Client-Side Decoder
        </Badge>
      </div>

      {/* Main Decompression Panel */}
      <DecompressPanel
        originalMeta={fileMeta}
        packedBlob={packedBlob}
      />
    </div>
  );
}
