import React from 'react';
import { 
  Zap, 
  ArrowRight, 
  FileCode, 
  Cpu, 
  GitFork, 
  ShieldCheck, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { DropZone } from '../components/upload/DropZone.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';

export function Home({ 
  onTextSubmit, 
  isDragging, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  onFileInput,
  onNavigate 
}) {
  const steps = [
    {
      step: '01',
      title: 'Frequency Analysis',
      desc: 'Count character occurrences and sort by descending distribution weights.',
      icon: Activity
    },
    {
      step: '02',
      title: 'Min-Heap Priority Queue',
      desc: 'Construct a binary min-heap to repeatedly extract the two lowest frequency nodes in O(log N).',
      icon: Layers
    },
    {
      step: '03',
      title: 'Prefix Tree & Code Generation',
      desc: 'Traverse left (0) and right (1) branches to assign optimal variable-length binary codes.',
      icon: GitFork
    },
    {
      step: '04',
      title: 'Binary Packing & Integrity',
      desc: 'Pack bits into Uint8Array with file header and verify roundtrip SHA-256 hash match.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-b from-[#161626] to-[#0E0E17] border border-[#222238] overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="violet" size="md" dot>
              Silicon Valley Engine
            </Badge>
            <Badge variant="cyan" size="md">
              Pure JavaScript DSA
            </Badge>
            <Badge variant="green" size="md">
              100% Lossless
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            High-Performance <span className="gradient-text-hero">Huffman Coding</span> & Live Tree Visualizer
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 font-mono leading-relaxed">
            Compress files down to their mathematical Shannon Entropy limit. Watch the Min-Heap merge subtrees node-by-node in real-time, generate prefix codes, and unpack binary <code className="text-cyan-400">.huff</code> files.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => document.getElementById('file-upload-input')?.click()}
              icon={Zap}
            >
              Upload & Analyse File
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('visualizer')}
              iconRight={ArrowRight}
            >
              Launch Tree Visualizer
            </Button>
          </div>
        </div>
      </div>

      {/* Main Upload DropZone */}
      <DropZone
        onTextSubmit={onTextSubmit}
        isDragging={isDragging}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onFileInput={onFileInput}
      />

      {/* Workflow Process Steps */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Under The Hood: The 4-Stage Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-5 rounded-2xl bg-[#111118] border border-[#1E1E2E] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-purple-400">
                      STEP {s.step}
                    </span>
                    <div className="p-1.5 rounded-lg bg-[#181824] text-slate-300">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 font-display">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
