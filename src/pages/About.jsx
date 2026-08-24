import React from 'react';
import { 
  BookOpen, 
  Cpu, 
  Layers, 
  TrendingUp, 
  GitFork, 
  Binary, 
  CheckCircle2,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import { Card } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { VivaQuiz } from '../components/viva/VivaQuiz.jsx';

export function About() {
  const complexityData = [
    {
      operation: 'Frequency Counting',
      heap: 'O(N)',
      list: 'O(N)',
      notes: 'Iterate over N characters in input'
    },
    {
      operation: 'Initial Heap Build',
      heap: 'O(C log C) or O(C)',
      list: 'O(C log C)',
      notes: 'Insert C unique characters into heap'
    },
    {
      operation: 'Tree Construction (C-1 merges)',
      heap: 'O(C log C)',
      list: 'O(C²)',
      notes: '2x extractMin + 1x insert per merge'
    },
    {
      operation: 'Code Generation (DFS)',
      heap: 'O(C)',
      list: 'O(C)',
      notes: 'Traverse 2C - 1 nodes in tree'
    },
    {
      operation: 'Encoding Phase',
      heap: 'O(N)',
      list: 'O(N)',
      notes: 'Hash table lookup for each char'
    },
    {
      operation: 'Overall Time Complexity',
      heap: 'O(N + C log C)',
      list: 'O(N + C²)',
      highlight: true,
      notes: 'Dominant factor is N reading + C log C merges'
    }
  ];

  const realWorldCodecs = [
    {
      name: 'DEFLATE / GZIP / ZIP',
      role: 'Backend Entropy Coding',
      desc: 'Combines LZ77 (sliding window dictionary search for matching strings) + Huffman coding on the resulting length/literal/distance tokens.'
    },
    {
      name: 'JPEG (Image Format)',
      role: 'Final Quantized Entropy Step',
      desc: 'After Discrete Cosine Transform (DCT) and quantization, JPEG uses Huffman coding to encode run-length encoded AC/DC coefficient pairs.'
    },
    {
      name: 'MP3 (MPEG-1 Audio Layer 3)',
      role: 'Frequency Subband Encoding',
      desc: 'Quantized spectral coefficients derived from MDCT are grouped into frequency subbands and encoded using pre-defined Huffman code tables.'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overview Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-[#161626] to-[#0E0E17] border border-[#222238]">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="violet" size="md">
            DSA Mini Project
          </Badge>
          <Badge variant="cyan" size="md">
            Information Theory
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
          The Mathematics & DSA of Huffman Coding
        </h1>

        <p className="mt-3 text-sm text-slate-300 font-mono leading-relaxed max-w-3xl">
          Invented by David A. Huffman in 1952 while studying at MIT, Huffman Coding is an elegant greedy algorithm for generating optimal prefix-free codes for lossless data compression.
        </p>
      </div>

      {/* 2-Column Core Concepts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="1. The Greedy Strategy"
          subtitle="Locally optimal decisions leading to global optimality"
          icon={GitFork}
        >
          <div className="space-y-3 text-xs font-mono text-slate-300 leading-relaxed">
            <p>
              Huffman coding uses a <strong className="text-purple-300">greedy choice property</strong>: at every step, it chooses the two nodes with the lowest frequencies and merges them into a single parent node with a combined weight equal to their sum.
            </p>
            <p>
              By giving the lowest frequency characters the longest paths from the root, high-frequency characters (e.g. 'e', ' ', 't') end up closest to the root with the shortest bit-codes (e.g. 1–3 bits instead of 8 bits).
            </p>
            <div className="p-3 rounded-lg bg-[#161622] border border-[#262638] text-cyan-300">
              ✓ <strong>Prefix-Free Guarantee:</strong> Since characters only exist as leaf nodes, no code can be a prefix of another code. Decoding never needs lookahead or delimiters.
            </div>
          </div>
        </Card>

        <Card
          title="2. The Priority Queue (Min-Heap)"
          subtitle="Why O(log C) extractMin makes all the difference"
          icon={Layers}
        >
          <div className="space-y-3 text-xs font-mono text-slate-300 leading-relaxed">
            <p>
              A naive priority queue implemented as an unsorted array or re-sorting list requires <strong className="text-rose-400">O(C)</strong> to find minimums or <strong className="text-rose-400">O(C log C)</strong> to re-sort after each merge, resulting in <strong className="text-rose-400">O(C²)</strong> overall tree construction time.
            </p>
            <p>
              A binary <strong className="text-emerald-400">Min-Heap</strong> maintains the minimum element at index 0 and restores the heap property in <strong className="text-emerald-400">O(log C)</strong> during <code className="text-purple-300">extractMin()</code> and <code className="text-purple-300">insert()</code>.
            </p>
            <div className="p-3 rounded-lg bg-[#161622] border border-[#262638] text-emerald-300">
              ✓ <strong>Overall Efficiency:</strong> Tree construction completes in strictly <strong className="text-white">O(C log C)</strong> time and <strong className="text-white">O(C)</strong> space.
            </div>
          </div>
        </Card>
      </div>

      {/* Complexity Comparison Table */}
      <Card
        title="Computational Complexity Analysis"
        subtitle="Step-by-step Big-O time and space breakdown"
        icon={Cpu}
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-[#161622] border-b border-[#222234] text-slate-400">
              <tr>
                <th className="py-3 px-4">Algorithm Phase</th>
                <th className="py-3 px-4 text-emerald-400">Min-Heap (HuffPress)</th>
                <th className="py-3 px-4 text-slate-400">Unsorted / Naive List</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A2A]">
              {complexityData.map((row, idx) => (
                <tr 
                  key={idx}
                  className={`hover:bg-[#181828] transition-colors ${row.highlight ? 'bg-purple-950/20 font-bold' : ''}`}
                >
                  <td className="py-2.5 px-4 text-slate-200">{row.operation}</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-semibold">{row.heap}</td>
                  <td className="py-2.5 px-4 text-rose-300">{row.list}</td>
                  <td className="py-2.5 px-4 text-slate-400 text-[11px]">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Real-World Industry Codecs */}
      <div>
        <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Binary className="w-4 h-4 text-cyan-400" />
          Where Is Huffman Coding Used in Industry?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {realWorldCodecs.map((codec) => (
            <div
              key={codec.name}
              className="p-5 rounded-2xl bg-[#111118] border border-[#1E1E2E]"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="cyan" size="sm">
                  {codec.role}
                </Badge>
              </div>
              <h4 className="text-sm font-bold font-display text-white">
                {codec.name}
              </h4>
              <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed">
                {codec.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Viva & Exam Prep Section */}
      <VivaQuiz />
    </div>
  );
}
