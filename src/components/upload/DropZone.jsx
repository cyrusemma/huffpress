import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileCode, 
  Type, 
  Sparkles, 
  ArrowRight, 
  FileCheck,
  Zap
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { SAMPLE_PRESETS } from '../../core/fileUtils.js';

export function DropZone({ 
  onTextSubmit, 
  isDragging, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  onFileInput 
}) {
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'editor'
  const [customText, setCustomText] = useState('');
  const [customTitle, setCustomTitle] = useState('custom-input.txt');

  const handleCustomSubmit = () => {
    if (customText.trim()) {
      onTextSubmit(customText, customTitle || 'custom-input.txt');
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMode('upload')}
            className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all ${
              activeMode === 'upload'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-700/50 shadow-[0_0_15px_rgba(124,58,237,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#151520]'
            }`}
          >
            📁 File Drop Zone
          </button>
          <button
            onClick={() => setActiveMode('editor')}
            className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all ${
              activeMode === 'editor'
                ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-700/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#151520]'
            }`}
          >
            ✏️ Direct Text / Code Editor
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Supported:</span>
          <Badge size="sm">.txt</Badge>
          <Badge size="sm">.json</Badge>
          <Badge size="sm">.js</Badge>
          <Badge size="sm">.py</Badge>
          <Badge size="sm">.c / .cpp</Badge>
          <Badge size="sm">.huff</Badge>
        </div>
      </div>

      {activeMode === 'upload' ? (
        /* Drag and Drop Box */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative group rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
            isDragging
              ? 'border-purple-500 bg-purple-950/30 scale-[1.01] shadow-[0_0_40px_rgba(124,58,237,0.4)]'
              : 'border-[#26263A] bg-[#111118]/80 hover:border-purple-500/60 hover:bg-[#131320]'
          }`}
          onClick={() => document.getElementById('file-upload-input')?.click()}
        >
          <input
            id="file-upload-input"
            type="file"
            className="hidden"
            onChange={onFileInput}
            accept=".txt,.js,.jsx,.ts,.tsx,.py,.c,.cpp,.h,.java,.json,.csv,.html,.css,.md,.huff"
          />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-purple-900/60 to-indigo-900/60 border border-purple-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)] group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-8 h-8 text-purple-300 animate-pulse" />
            </div>

            <h3 className="text-xl font-bold font-display text-white mb-2">
              Drag & Drop files here, or <span className="text-purple-400 underline underline-offset-4 decoration-purple-500/50">browse</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono max-w-md mx-auto mb-6">
              Drop any text, source code, JSON, or existing <span className="text-cyan-400">.huff</span> file to analyse and compress.
            </p>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('file-upload-input')?.click();
                }}
                icon={Zap}
              >
                Choose File from Computer
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Text Editor Mode */
        <Card title="Direct Text Input" subtitle="Type or paste custom text to inspect live Huffman tree generation">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-mono text-slate-400">Simulated Filename:</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="sample.txt"
                className="bg-[#161622] border border-[#2A2A3E] text-slate-200 text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 flex-1 max-w-xs"
              />
            </div>

            <textarea
              rows={8}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste or type text here (e.g. AABBCCDD or code snippet)..."
              className="w-full bg-[#0D0D14] border border-[#222234] rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 resize-y"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-400">
                Length: {customText.length} characters ({new TextEncoder().encode(customText).length} bytes)
              </span>
              <Button
                variant="cyan"
                size="md"
                onClick={handleCustomSubmit}
                disabled={!customText.trim()}
                iconRight={ArrowRight}
              >
                Analyse & Compress
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Sample Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Preset Benchmark Datasets
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">Click to test instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SAMPLE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onTextSubmit(preset.text, `${preset.id}.txt`)}
              className="p-4 rounded-xl bg-[#111118] border border-[#1E1E2E] hover:border-purple-500/50 hover:bg-[#141422] transition-all cursor-pointer group select-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="violet" size="sm">
                    {preset.category}
                  </Badge>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {preset.tag}
                  </span>
                </div>
                <h5 className="text-sm font-semibold text-slate-100 font-display group-hover:text-purple-300 transition-colors">
                  {preset.title}
                </h5>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 font-mono">
                  "{preset.text.replace(/\n/g, ' ').slice(0, 75)}..."
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1E1E2E] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{preset.text.length} chars</span>
                <span className="text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Load <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
