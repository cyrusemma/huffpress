import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, CheckCircle, Award } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';

export function VivaQuiz() {
  const [openCard, setOpenCard] = useState(0);

  const questions = [
    {
      id: 1,
      q: 'Why do we use a Min-Heap (Priority Queue) instead of a simple sorted array?',
      tag: 'Data Structures',
      summary: 'Min-Heap achieves O(C log C) vs O(C²) with sorted list.',
      ans: `In Huffman coding, we repeatedly need to extract the two lowest-frequency nodes and insert the merged parent back into the collection. 

1. With a Min-Heap:
   • extractMin() takes O(log C)
   • insert() takes O(log C)
   • Total time for C-1 merges = O(C log C).

2. With a dynamic Array.sort() after every merge:
   • Each sort takes O(C log C)
   • Total time = O(C² log C) or O(C²) with linear insertion.

The Min-Heap is essential for optimal computational efficiency.`
    },
    {
      id: 2,
      q: 'Why is Huffman coding classified as a Greedy Algorithm?',
      tag: 'Algorithm Strategy',
      summary: 'Makes the locally optimal choice at each step to reach global optimality.',
      ans: `At each step of the tree construction, the algorithm makes a greedy local choice: it selects the two smallest frequency subtrees currently available and joins them.

This locally optimal choice possesses the Greedy Choice Property and Optimal Substructure, meaning that local greedy combinations provably result in a globally optimal prefix-free tree with the minimum expected code length.`
    },
    {
      id: 3,
      q: 'What is a "Prefix-Free Code" and why does it matter for decoding?',
      tag: 'Information Theory',
      summary: 'No character code is a prefix of any other code, ensuring unambiguous streaming decode.',
      ans: `In a prefix-free code (like Huffman codes), no valid character bit-sequence is the prefix of another character's bit-sequence (e.g. if 'A' is '01', no other character code can start with '01').

Because characters are located exclusively at the LEAF NODES of the binary tree, when reading a bitstream from left to right, as soon as a leaf is reached, the symbol is unambiguously determined without needing lookahead or delimiter bits.`
    },
    {
      id: 4,
      q: 'What is Shannon Entropy and how does it relate to Huffman coding?',
      tag: 'Theoretical Bound',
      summary: 'H(X) = -Σ p(x) log2 p(x) is the mathematical minimum bits per character.',
      ans: `Claude Shannon's Source Coding Theorem establishes that the absolute theoretical limit for lossless data compression is given by the Entropy H(X):

H(X) = - Σ (P(x) * log2 P(x))

Huffman coding constructs an instantaneous code whose average length L satisfies:
H(X) ≤ L < H(X) + 1 (per symbol)

It is proven to be the most optimal symbol-by-symbol prefix code possible for known character probability distributions.`
    },
    {
      id: 5,
      q: 'When does Huffman Coding NOT compress well (worst-case scenario)?',
      tag: 'Edge Cases',
      summary: 'Uniform frequency distribution yields 0% savings + container header overhead.',
      ans: `1. Uniform Frequency: When all unique characters occur with equal frequency (e.g. every character appears exactly 5 times), all generated codes will have approximately equal bit-lengths (≈ log2 C). In that case, payload bit savings are near 0%.

2. Small Input Files: For tiny files (< 200 bytes), storing the code table in the file header adds more overhead bytes than the bits saved, resulting in a .huff file larger than the input.`
    },
    {
      id: 6,
      q: 'What is the exact structure of the .huff file header?',
      tag: 'Binary Format',
      summary: 'Magic Bytes + Header Length + JSON Code Table + Padding Bits + Packed Bytes.',
      ans: `The .huff binary container consists of:
1. Magic Bytes [2 bytes]: ASCII 'HP' (0x48, 0x50) to verify file type.
2. Header Length [4 bytes Uint32]: Byte length of the JSON metadata.
3. Metadata JSON [UTF-8]: Serialized code table { 'a': '00', 'b': '01' } and original filename.
4. Padding Bits [1 byte]: Number of trailing padding bits (0..7) in the final byte.
5. Payload [Uint8Array]: The actual packed bitstream.`
    }
  ];

  return (
    <Card
      title="DSA Viva & Technical Interview Prep"
      subtitle="Master the fundamental concepts, proofs, and edge cases for your supervisor evaluation"
      icon={BookOpen}
    >
      <div className="space-y-3">
        {questions.map((item, idx) => {
          const isOpen = openCard === idx;
          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all ${
                isOpen
                  ? 'bg-[#161626] border-purple-500/50 shadow-[0_0_20px_rgba(124,58,237,0.15)]'
                  : 'bg-[#11111C] border-[#1E1E2E] hover:border-[#2E2E44]'
              }`}
            >
              <button
                onClick={() => setOpenCard(isOpen ? null : idx)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-purple-950/60 border border-purple-700/40 text-purple-300 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0">
                    {item.id}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-100 font-display">
                      {item.q}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {item.summary}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="violet" size="sm">
                    {item.tag}
                  </Badge>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-purple-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-[#1E1E2E] text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed">
                  {item.ans}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
