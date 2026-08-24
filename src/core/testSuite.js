import { MinHeap } from './minHeap.js';
import {
  buildFrequencyMap,
  buildHuffmanTree,
  buildCodeTable,
  encode,
  decode,
  getCompressionStats,
  getTreeSteps
} from './huffman.js';
import {
  stringToBinary,
  binaryToString,
  packFile,
  unpackFile,
  reconstructTreeFromCodeTable
} from './bitWriter.js';

export function runTests() {
  console.log('=== Running HuffPress Core DSA Test Suite ===');
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      failed++;
    }
  }

  // 1. MinHeap Tests
  const heap = new MinHeap();
  heap.insert({ id: 1, freq: 10, char: 'a' });
  heap.insert({ id: 2, freq: 3, char: 'b' });
  heap.insert({ id: 3, freq: 7, char: 'c' });
  heap.insert({ id: 4, freq: 1, char: 'd' });

  assert(heap.size() === 4, 'MinHeap size should be 4');
  assert(heap.extractMin().freq === 1, 'MinHeap extractMin should return freq 1');
  assert(heap.extractMin().freq === 3, 'MinHeap extractMin should return freq 3');
  assert(heap.extractMin().freq === 7, 'MinHeap extractMin should return freq 7');
  assert(heap.extractMin().freq === 10, 'MinHeap extractMin should return freq 10');
  assert(heap.isEmpty(), 'MinHeap should be empty');

  // 2. Huffman Frequency & Tree & Encoding
  const text = "BEEP BOOP BEER BEEP";
  const freqMap = buildFrequencyMap(text);
  assert(freqMap['B'] === 4, 'Frequency of B should be 4');
  assert(freqMap['E'] === 6, 'Frequency of E should be 6');
  assert(freqMap['P'] === 3, 'Frequency of P should be 3');
  assert(freqMap['O'] === 2, 'Frequency of O should be 2');
  assert(freqMap[' '] === 3, 'Frequency of space should be 3');
  assert(freqMap['R'] === 1, 'Frequency of R should be 1');

  const tree = buildHuffmanTree(freqMap);
  const codeTable = buildCodeTable(tree);
  console.log('Code Table for "BEEP BOOP BEER BEEP":', codeTable);

  const encoded = encode(text, codeTable);
  const decoded = decode(encoded, tree);
  assert(decoded === text, 'Huffman decode(encode(text)) must match original text perfectly');

  // 3. Step recorder test
  const steps = getTreeSteps(freqMap);
  assert(steps.length >= 6, `Step recorder should have recorded ${steps.length} steps`);
  assert(steps[0].type === 'INIT', 'First step is INIT');
  assert(steps[steps.length - 1].type === 'COMPLETE', 'Final step is COMPLETE');

  // 4. Bit Packing and .huff Container Test
  const { bytes, paddingBits } = stringToBinary(encoded);
  const unpackedBitStr = binaryToString(bytes, paddingBits);
  assert(unpackedBitStr === encoded, 'BitWriter binary string pack/unpack matches original encoded bits');

  const blob = packFile(encoded, codeTable, { originalName: 'test.txt', originalSize: text.length });
  assert(blob.size > 0, `Packed .huff Blob created with size ${blob.size} bytes`);

  // 5. Test Tree Reconstruction from Code Table
  const reconTree = reconstructTreeFromCodeTable(codeTable);
  const reconDecoded = decode(encoded, reconTree);
  assert(reconDecoded === text, 'Reconstructed tree from code table successfully decodes bitstream');

  console.log(`\nTests Summary: ${passed} passed, ${failed} failed.\n`);
  return { passed, failed };
}
