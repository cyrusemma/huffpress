import { MinHeap } from './minHeap.js';

/**
 * Builds a frequency map from input text
 * @param {string} text
 * @returns {Record<string, number>}
 */
export function buildFrequencyMap(text) {
  const freqMap = {};
  if (!text) return freqMap;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    freqMap[char] = (freqMap[char] || 0) + 1;
  }
  return freqMap;
}

/**
 * Deep clones a tree node for immutable step snapshots
 */
function cloneNode(node) {
  if (!node) return null;
  return {
    id: node.id,
    char: node.char,
    freq: node.freq,
    isLeaf: node.isLeaf,
    left: cloneNode(node.left),
    right: cloneNode(node.right)
  };
}

/**
 * Generates an array of step snapshots during Huffman Tree construction for visualizer
 * @param {Record<string, number>} freqMap
 * @returns {Array<Object>}
 */
export function getTreeSteps(freqMap) {
  const entries = Object.entries(freqMap);
  if (entries.length === 0) return [];

  let nextId = 1;
  const heap = new MinHeap();
  const initialNodes = [];

  // Sort entries by freq ascending for intuitive initial layout
  entries.sort((a, b) => a[1] - b[1]);

  for (const [char, freq] of entries) {
    const node = {
      id: `node-${nextId++}`,
      char,
      freq,
      isLeaf: true,
      left: null,
      right: null
    };
    heap.insert(node);
    initialNodes.push(cloneNode(node));
  }

  const steps = [];

  // Step 0: Initial forest populated from frequency table
  steps.push({
    stepIndex: 0,
    type: 'INIT',
    description: `Initialized Priority Queue with ${entries.length} unique character leaf nodes.`,
    extractedLeft: null,
    extractedRight: null,
    mergedNode: null,
    heapSnapshot: heap.getHeapArray().map(cloneNode),
    forestSnapshot: heap.getHeapArray().map(cloneNode),
    activeNodeIds: []
  });

  // Edge case: single character in input
  if (heap.size() === 1) {
    const singleNode = heap.peek();
    steps.push({
      stepIndex: 1,
      type: 'COMPLETE',
      description: `Only 1 unique character '${formatChar(singleNode.char)}'. Single node tree complete.`,
      extractedLeft: null,
      extractedRight: null,
      mergedNode: cloneNode(singleNode),
      heapSnapshot: [cloneNode(singleNode)],
      forestSnapshot: [cloneNode(singleNode)],
      activeNodeIds: [singleNode.id]
    });
    return steps;
  }

  let stepCount = 1;

  while (heap.size() > 1) {
    const left = heap.extractMin();
    const right = heap.extractMin();

    const mergedNode = {
      id: `internal-${nextId++}`,
      char: null,
      freq: left.freq + right.freq,
      isLeaf: false,
      left: left,
      right: right
    };

    heap.insert(mergedNode);

    const leftDesc = left.isLeaf ? `'${formatChar(left.char)}' (${left.freq})` : `Internal (${left.freq})`;
    const rightDesc = right.isLeaf ? `'${formatChar(right.char)}' (${right.freq})` : `Internal (${right.freq})`;

    steps.push({
      stepIndex: stepCount++,
      type: 'MERGE',
      description: `Extracted ${leftDesc} and ${rightDesc}. Merged into new parent node with combined weight ${mergedNode.freq}. Inserted back into Min-Heap.`,
      extractedLeft: cloneNode(left),
      extractedRight: cloneNode(right),
      mergedNode: cloneNode(mergedNode),
      heapSnapshot: heap.getHeapArray().map(cloneNode),
      forestSnapshot: heap.getHeapArray().map(cloneNode),
      activeNodeIds: [left.id, right.id, mergedNode.id]
    });
  }

  const root = heap.peek();
  steps.push({
    stepIndex: stepCount,
    type: 'COMPLETE',
    description: `Optimal Prefix Tree constructed! Root node weight: ${root.freq}. Ready for bit code assignment.`,
    extractedLeft: null,
    extractedRight: null,
    mergedNode: cloneNode(root),
    heapSnapshot: [cloneNode(root)],
    forestSnapshot: [cloneNode(root)],
    activeNodeIds: [root.id]
  });

  return steps;
}

/**
 * Builds the complete Huffman tree from a frequency map
 * @param {Record<string, number>} freqMap
 * @returns {Object|null}
 */
export function buildHuffmanTree(freqMap) {
  const entries = Object.entries(freqMap);
  if (entries.length === 0) return null;

  let nextId = 1;
  const heap = new MinHeap();

  for (const [char, freq] of entries) {
    heap.insert({
      id: `node-${nextId++}`,
      char,
      freq,
      isLeaf: true,
      left: null,
      right: null
    });
  }

  if (heap.size() === 1) {
    return heap.extractMin();
  }

  while (heap.size() > 1) {
    const left = heap.extractMin();
    const right = heap.extractMin();

    const merged = {
      id: `internal-${nextId++}`,
      char: null,
      freq: left.freq + right.freq,
      isLeaf: false,
      left,
      right
    };
    heap.insert(merged);
  }

  return heap.extractMin();
}

/**
 * Generates the prefix-free binary code table from the Huffman tree
 * @param {Object} root
 * @returns {Record<string, string>}
 */
export function buildCodeTable(root) {
  const codeTable = {};
  if (!root) return codeTable;

  // Single character edge case
  if (root.isLeaf) {
    codeTable[root.char] = '0';
    return codeTable;
  }

  function traverse(node, currentCode) {
    if (!node) return;

    if (node.isLeaf && node.char !== null) {
      codeTable[node.char] = currentCode;
      return;
    }

    if (node.left) traverse(node.left, currentCode + '0');
    if (node.right) traverse(node.right, currentCode + '1');
  }

  traverse(root, '');
  return codeTable;
}

/**
 * Encodes text into a continuous binary string '0101...'
 * @param {string} text
 * @param {Record<string, string>} codeTable
 * @returns {string}
 */
export function encode(text, codeTable) {
  if (!text) return '';
  let encoded = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = codeTable[char];
    if (code !== undefined) {
      encoded += code;
    } else {
      throw new Error(`Character '${char}' (code ${char.charCodeAt(0)}) not found in Huffman code table.`);
    }
  }
  return encoded;
}

/**
 * Decodes a binary string back into original text using the Huffman tree
 * @param {string} encodedStr
 * @param {Object} root
 * @returns {string}
 */
export function decode(encodedStr, root) {
  if (!encodedStr || !root) return '';

  // Single character edge case
  if (root.isLeaf) {
    return root.char.repeat(encodedStr.length);
  }

  let decoded = '';
  let current = root;

  for (let i = 0; i < encodedStr.length; i++) {
    const bit = encodedStr[i];
    if (bit === '0') {
      current = current.left;
    } else if (bit === '1') {
      current = current.right;
    }

    if (!current) {
      throw new Error(`Invalid bit sequence at index ${i}. Reached null branch.`);
    }

    if (current.isLeaf) {
      decoded += current.char;
      current = root;
    }
  }

  return decoded;
}

/**
 * Helper to display non-printable characters cleanly in UI
 */
export function formatChar(char) {
  if (char === ' ') return 'Space (·)';
  if (char === '\n') return '\\n (Newline)';
  if (char === '\t') return '\\t (Tab)';
  if (char === '\r') return '\\r (Return)';
  if (char === '\0') return '\\0 (Null)';
  return char;
}

/**
 * Computes Shannon Entropy and detailed compression statistics
 */
export function getCompressionStats(originalText, encodedStr, packedByteSize = null) {
  const originalBytes = new TextEncoder().encode(originalText).length;
  const originalBits = originalBytes * 8;
  const compressedBits = encodedStr ? encodedStr.length : 0;
  const compressedPayloadBytes = Math.ceil(compressedBits / 8);
  const totalCompressedBytes = packedByteSize !== null ? packedByteSize : compressedPayloadBytes;

  const rawSavingsPercent = originalBits > 0 
    ? ((1 - (compressedBits / originalBits)) * 100) 
    : 0;

  const fileSavingsPercent = originalBytes > 0 
    ? ((1 - (totalCompressedBytes / originalBytes)) * 100)
    : 0;

  const compressionRatio = compressedBits > 0 
    ? (originalBits / compressedBits).toFixed(2) 
    : '1.00';

  // Calculate Shannon Entropy: H(X) = -sum(p * log2(p))
  const freqMap = buildFrequencyMap(originalText);
  const totalChars = originalText.length;
  let entropy = 0;
  for (const count of Object.values(freqMap)) {
    const p = count / totalChars;
    entropy -= p * Math.log2(p);
  }

  const avgBitsPerChar = totalChars > 0 ? (compressedBits / totalChars).toFixed(2) : '0.00';

  return {
    originalChars: totalChars,
    originalBytes,
    originalBits,
    compressedBits,
    compressedPayloadBytes,
    totalCompressedBytes,
    rawSavingsPercent: Math.max(-999, Math.round(rawSavingsPercent * 100) / 100),
    fileSavingsPercent: Math.max(-999, Math.round(fileSavingsPercent * 100) / 100),
    compressionRatio: `${compressionRatio}:1`,
    entropy: entropy.toFixed(3),
    avgBitsPerChar,
    uniqueCharsCount: Object.keys(freqMap).length
  };
}
