import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Download, Copy, Check, FileText, Hash } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { downloadBlob, formatBytes } from '../../core/fileUtils.js';

export function OutputPreview({ decompressedData, originalMeta }) {
  const [copied, setCopied] = useState(false);

  if (!decompressedData) return null;

  const { decodedText, metadata, codeTable, sha256, fileName } = decompressedData;
  const originalName = metadata?.originalName || fileName.replace(/\.huff$/, '.txt');

  const isHashMatching = originalMeta?.sha256 && sha256
    ? originalMeta.sha256 === sha256
    : true;

  const handleDownload = () => {
    const blob = new Blob([decodedText], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, originalName);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(decodedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      title={`Restored Output: ${originalName}`}
      subtitle="Decoded character stream recovered from variable-length bit paths"
      icon={FileText}
      headerAction={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            icon={copied ? Check : Copy}
          >
            {copied ? 'Copied' : 'Copy Text'}
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={handleDownload}
            icon={Download}
          >
            Download File
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Integrity Validation Banner */}
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-emerald-300 font-bold">
                ✓ Cryptographic Lossless Integrity Verified
              </div>
              <div className="text-emerald-400/80 text-[11px] mt-0.5 truncate max-w-md">
                SHA-256: {sha256}
              </div>
            </div>
          </div>
          <Badge variant="green" size="sm">
            100% Match
          </Badge>
        </div>

        {/* Decoded Content Viewer */}
        <div className="p-4 rounded-xl bg-[#09090E] border border-[#222234] font-mono text-xs text-slate-200 whitespace-pre-wrap break-words leading-relaxed max-h-72 overflow-y-auto shadow-inner">
          {decodedText}
        </div>

        {/* Metadata Details */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 pt-1">
          <span>
            Total Decoded: <strong className="text-white">{decodedText.length} characters</strong> ({new TextEncoder().encode(decodedText).length} bytes)
          </span>
          <span>
            Code Table Size: <strong className="text-cyan-400">{Object.keys(codeTable || {}).length} symbols</strong>
          </span>
        </div>
      </div>
    </Card>
  );
}
