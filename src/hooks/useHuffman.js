import { useState, useCallback, useEffect } from 'react';
import {
  buildFrequencyMap,
  buildHuffmanTree,
  buildCodeTable,
  encode,
  getCompressionStats,
  getTreeSteps
} from '../core/huffman.js';
import { packFile } from '../core/bitWriter.js';
import { calculateSHA256, SAMPLE_PRESETS } from '../core/fileUtils.js';

export function useHuffman() {
  const [fileMeta, setFileMeta] = useState({
    name: 'pied-piper-monologue.txt',
    size: 0,
    type: 'text/plain',
    sha256: ''
  });

  const [rawText, setRawText] = useState('');
  const [freqMap, setFreqMap] = useState({});
  const [huffmanTree, setHuffmanTree] = useState(null);
  const [codeTable, setCodeTable] = useState({});
  const [encodedBitString, setEncodedBitString] = useState('');
  const [treeSteps, setTreeSteps] = useState([]);
  const [stats, setStats] = useState(null);
  const [packedBlob, setPackedBlob] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Runs the full Huffman compression pipeline on a given text string
   */
  const processText = useCallback(async (text, filename = 'document.txt', fileSize = null) => {
    if (!text || text.length === 0) {
      setStatus('idle');
      setRawText('');
      setFreqMap({});
      setHuffmanTree(null);
      setCodeTable({});
      setEncodedBitString('');
      setTreeSteps([]);
      setStats(null);
      setPackedBlob(null);
      return;
    }

    try {
      setStatus('processing');
      setErrorMessage(null);

      // 1. Frequency Analysis
      const frequencies = buildFrequencyMap(text);
      setFreqMap(frequencies);

      // 2. Tree snapshots for visualizer & final tree
      const steps = getTreeSteps(frequencies);
      setTreeSteps(steps);

      const tree = buildHuffmanTree(frequencies);
      setHuffmanTree(tree);

      // 3. Code Table & Encoding
      const codes = buildCodeTable(tree);
      setCodeTable(codes);

      const encoded = encode(text, codes);
      setEncodedBitString(encoded);

      // 4. Pack into .huff blob
      const actualSize = fileSize !== null ? fileSize : new TextEncoder().encode(text).length;
      const blob = packFile(encoded, codes, {
        originalName: filename,
        originalSize: actualSize,
        originalCharCount: text.length
      });
      setPackedBlob(blob);

      // 5. Compute Stats & SHA-256
      const compressionStats = getCompressionStats(text, encoded, blob.size);
      setStats(compressionStats);

      const hash = await calculateSHA256(text);
      setFileMeta({
        name: filename,
        size: actualSize,
        type: 'text/plain',
        sha256: hash
      });

      setRawText(text);
      setStatus('ready');
    } catch (err) {
      console.error('Huffman processing failed:', err);
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred during compression.');
    }
  }, []);

  /**
   * Loads a built-in sample preset
   */
  const loadPreset = useCallback((presetId) => {
    const preset = SAMPLE_PRESETS.find(p => p.id === presetId) || SAMPLE_PRESETS[0];
    processText(preset.text, `${preset.id}.txt`);
  }, [processText]);

  // Initialize with the Pied Piper preset on mount
  useEffect(() => {
    loadPreset('pied-piper');
  }, [loadPreset]);

  return {
    fileMeta,
    rawText,
    freqMap,
    huffmanTree,
    codeTable,
    encodedBitString,
    treeSteps,
    stats,
    packedBlob,
    status,
    errorMessage,
    processText,
    loadPreset
  };
}
