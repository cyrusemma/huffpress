import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Layers, 
  HardDrive, 
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { formatBytes, SAMPLE_PRESETS, downloadBlob } from '../../core/fileUtils.js';

export function TopBar({ 
  fileMeta, 
  stats, 
  packedBlob, 
  onSelectPreset, 
  onNavigateToVisualizer 
}) {
  const handleDownload = () => {
    if (packedBlob) {
      const huffName = fileMeta.name.replace(/\.[^/.]+$/, '') + '.huff';
      downloadBlob(packedBlob, huffName);
    }
  };

  return (
    <header className="h-16 border-b border-[#1E1E2E] bg-[#0A0A0F]/80 backdrop-blur-md px-6 flex items-center justify-between z-10 sticky top-0">
      {/* File Badge & Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141420] border border-[#222234]">
          <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span className="text-xs font-mono text-slate-200 font-medium truncate max-w-[200px]">
            {fileMeta.name}
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-[#1D1D2C] px-1.5 py-0.5 rounded">
            {formatBytes(fileMeta.size)}
          </span>
        </div>

        {stats && (
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="green" size="sm" dot>
              {stats.fileSavingsPercent > 0 ? `${stats.fileSavingsPercent}% Saved` : 'Packed'}
            </Badge>
            <Badge variant="cyan" size="sm">
              Ratio: {stats.compressionRatio}
            </Badge>
          </div>
        )}
      </div>

      {/* Quick Controls */}
      <div className="flex items-center gap-3">
        {/* Sample Datasets Selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden md:inline font-mono">Sample:</span>
          <select
            aria-label="Select sample dataset"
            onChange={(e) => onSelectPreset(e.target.value)}
            defaultValue="pied-piper"
            className="bg-[#141420] border border-[#222234] text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {SAMPLE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        {packedBlob && (
          <Button
            variant="cyan"
            size="sm"
            onClick={handleDownload}
            icon={Download}
            className="hidden sm:inline-flex"
          >
            .huff File
          </Button>
        )}

        <Button
          variant="primary"
          size="sm"
          onClick={onNavigateToVisualizer}
          icon={Layers}
        >
          View Tree
        </Button>
      </div>
    </header>
  );
}
