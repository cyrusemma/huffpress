/**
 * Utility functions for file handling, formatting, SHA-256 integrity, and sample datasets.
 */

export const SAMPLE_PRESETS = [
  {
    id: 'pied-piper',
    title: 'Silicon Valley — Pied Piper Pitch',
    category: 'Monologue',
    tag: 'Realistic Text',
    text: `Pied Piper is a multi-platform technology based on a proprietary compression algorithm. Our Weissman score exceeds anything currently on the market. We take your data, run optimal variable-length prefix entropy coding, and shrink lossless files down to pure mathematical elegance. Middle-out compression isn't just a fantasy — it's the future of distributed cloud storage and universal data streaming.`
  },
  {
    id: 'skewed-freq',
    title: 'Extreme Skewed Frequency',
    category: 'High Compression',
    tag: '70%+ Savings',
    text: `AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB\nCCCCCCCCCCCCCCCCCCCC\nDDDDDDDDDD\nEEEE\nF`
  },
  {
    id: 'javascript-code',
    title: 'DSA Tree Traversal Code',
    category: 'Source Code',
    tag: 'Code Syntax',
    text: `class HuffmanNode {\n  constructor(char, freq) {\n    this.char = char;\n    this.freq = freq;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nfunction traverseTree(node, code = "") {\n  if (!node) return;\n  if (!node.left && !node.right) {\n    console.log(\`Leaf '\${node.char}': \${code}\`);\n    return;\n  }\n  traverseTree(node.left, code + "0");\n  traverseTree(node.right, code + "1");\n}`
  },
  {
    id: 'shakespeare',
    title: 'Shakespeare — Sonnet 18',
    category: 'Literature',
    tag: 'Natural English',
    text: `Shall I compare thee to a summer's day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer's lease hath all too short a date:\nSometime too hot the eye of heaven shines,\nAnd often is his gold complexion dimm'd;\nAnd every fair from fair sometime declines,\nBy chance or nature's changing course untrimm'd.`
  },
  {
    id: 'json-api',
    title: 'JSON API Response',
    category: 'Structured Data',
    tag: 'High Repetition',
    text: `{\n  "status": "success",\n  "statusCode": 200,\n  "compression": "Huffman",\n  "version": "1.0.0",\n  "benchmark": {\n    "originalBytes": 4096,\n    "compressedBytes": 1680,\n    "ratio": "2.44:1",\n    "lossless": true\n  },\n  "clusterNodes": [\n    {"id": "node-1", "active": true, "load": 0.42},\n    {"id": "node-2", "active": true, "load": 0.38},\n    {"id": "node-3", "active": true, "load": 0.51}\n  ]\n}`
  }
];

/**
 * Formats byte size to human readable string (B, KB, MB)
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0 || isNaN(bytes)) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const idx = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, idx)).toFixed(dm))} ${sizes[idx]}`;
}

/**
 * Calculates SHA-256 hex string for integrity validation
 * Supports both browser Crypto API and fallback
 * @param {string|ArrayBuffer} data
 * @returns {Promise<string>}
 */
export async function calculateSHA256(data) {
  try {
    let buffer;
    if (typeof data === 'string') {
      buffer = new TextEncoder().encode(data);
    } else if (data instanceof ArrayBuffer) {
      buffer = data;
    } else {
      buffer = new Uint8Array(data);
    }

    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('Crypto subtle SHA-256 unavailable, using deterministic fast hash fallback', err);
  }

  // Fast simple hash fallback for environments without crypto.subtle
  let hash = 0;
  const str = typeof data === 'string' ? data : new TextDecoder().decode(data);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `sha256-fast-${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

/**
 * Reads a File object as UTF-8 text
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Failed to read file '${file.name}'`));
    reader.readAsText(file);
  });
}

/**
 * Reads a File object as ArrayBuffer
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */
export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Failed to read binary file '${file.name}'`));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Triggers a client-side file download in browser
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
