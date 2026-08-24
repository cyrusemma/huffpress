# HuffPress ⚡

> **A browser-based, high-performance file compression tool and live algorithm visualizer powered by the Huffman Coding algorithm.** Built in React + Vite with pure JavaScript DSA.

![HuffPress Preview](public/favicon.svg)

---

## 🚀 Features

- **Pure DSA Engine**:
  - Binary **Min-Heap Priority Queue** from scratch ($O(\log N)$ insert/extract).
  - Frequency analysis & Shannon Entropy $H(X)$ calculation.
  - Prefix-free variable-length code generation via Depth-First Search.
  - Full `.huff` binary container packing (`Uint8Array`) with `HP` magic bytes & embedded code table header.
  - Lossless decompression engine with tree reconstruction from code tables.
  - Cryptographic **SHA-256 integrity verification** (100% exact match).

- **Silicon Valley Dark UI**:
  - Dark terminal-meets-dashboard aesthetic (`#0A0A0F` background, `#7C3AED` violet beam, `#06B6D4` data cyan).
  - Responsive single-page architecture with fixed sidebar navigation.
  - Benchmark datasets (Silicon Valley Pied Piper monologue, Skewed frequency, Code samples, Shakespeare, JSON API).

- **Showstopper Interactive Tree Visualizer**:
  - D3-powered hierarchical SVG prefix tree with smooth pan and zoom.
  - **Node-by-node construction animation**: watch subtrees merge in real-time.
  - Priority Queue (Min-Heap) state array showing active extracted pairs and merged parent nodes.
  - Play/Pause, Step Forward/Backward, Speed control (0.5x, 1x, 2x, 4x), and timeline scrubber.
  - Interactive root-to-leaf binary path highlighter on hover/click.

- **DSA Viva & Interview Preparation**:
  - Theoretical proofs (Greedy Choice Property, Prefix-Free codes, Shannon's Source Coding Theorem).
  - Big-O complexity comparison ($O(C \log C)$ heap vs. $O(C^2)$ naive list).
  - Industry codecs breakdown (DEFLATE, JPEG, MP3).
  - Interactive flashcard quiz for supervisor viva examination prep.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Visualizations**: D3.js (`d3-hierarchy`, `d3-tree`, `d3-zoom`)
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS keyframes
- **Styling**: Modern Vanilla CSS Design System with custom dark theme tokens

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/cyrusemma/huffpress.git
cd huffpress

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

### Run DSA Test Suite

```bash
node -e "import('./src/core/testSuite.js').then(m => m.runTests())"
```

---

## 📜 File Format Specification (`.huff`)

The custom binary container format is structured as follows:
```
[0..1]      : Magic Bytes 'HP' (0x48, 0x50)
[2..5]      : Header length in bytes (Uint32 Big-Endian)
[6..N]      : Header JSON UTF-8 string { version, originalName, originalSize, codeTable }
[N+1]       : Padding bit count (0..7) in the final byte
[N+2..End]  : Packed bitstream payload bytes
```

---

## 🎓 DSA Talking Points (Viva Prep)

1. **Why a Min-Heap?** — Merging the two lowest-frequency nodes takes $O(\log C)$ time with a heap vs $O(C^2)$ with a naive sorted list. Total tree build time is $O(C \log C)$.
2. **Why is Huffman greedy?** — At each step, it chooses the locally optimal pair (two smallest frequencies) to construct a globally optimal prefix-free tree.
3. **What makes it prefix-free?** — Characters exist strictly at leaf nodes; no character code is a prefix of another code, ensuring unambiguous streaming decode without lookahead.

---

## 📄 License

MIT License © 2026 Cyrus
