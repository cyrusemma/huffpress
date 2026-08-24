import React, { useState } from 'react';
import { ArchiveRestore, UploadCloud, AlertTriangle, FileCode, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { OutputPreview } from './OutputPreview.jsx';
import { readFileAsArrayBuffer } from '../../core/fileUtils.js';
import { unpackFile, reconstructTreeFromCodeTable } from '../../core/bitWriter.js';
import { decode } from '../../core/huffman.js';
import { calculateSHA256 } from '../../core/fileUtils.js';

export function DecompressPanel({ originalMeta, packedBlob }) {
  const [decompressedData, setDecompressedData] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleProcessBuffer = async (buffer, filename) => {
    try {
      setIsProcessing(true);
      setError(null);

      const { metadata, codeTable, encodedStr } = unpackFile(buffer);
      const tree = reconstructTreeFromCodeTable(codeTable);
      const decodedText = decode(encodedStr, tree);
      const sha256 = await calculateSHA256(decodedText);

      setDecompressedData({
        fileName: filename,
        metadata,
        codeTable,
        encodedStr,
        decodedText,
        sha256
      });
    } catch (err) {
      console.error('Decompression error:', err);
      setError(err.message || 'Corrupted or invalid .huff archive file.');
      setDecompressedData(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInput = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buffer = await readFileAsArrayBuffer(file);
    await handleProcessBuffer(buffer, file.name);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const buffer = await readFileAsArrayBuffer(file);
      await handleProcessBuffer(buffer, file.name);
    }
  };

  const handleDecompressCurrentPackedBlob = async () => {
    if (packedBlob) {
      const buffer = await packedBlob.arrayBuffer();
      await handleProcessBuffer(buffer, `${originalMeta.name.replace(/\.[^/.]+$/, '')}.huff`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload .huff drop box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-cyan-500 bg-cyan-950/30'
            : 'border-[#26263A] bg-[#111118]/80 hover:border-cyan-500/60'
        }`}
        onClick={() => document.getElementById('huff-file-input')?.click()}
      >
        <input
          id="huff-file-input"
          type="file"
          accept=".huff"
          className="hidden"
          onChange={handleFileInput}
        />

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 mb-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <ArchiveRestore className="w-7 h-7 text-cyan-300 animate-pulse" />
          </div>

          <h3 className="text-lg font-bold font-display text-white mb-1">
            Upload <span className="text-cyan-400">.huff</span> Archive to Decompress
          </h3>
          <p className="text-xs text-slate-400 font-mono max-w-sm mb-4">
            Reads the embedded header code table, reconstructs the prefix tree, and decodes the packed bitstream.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="cyan"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('huff-file-input')?.click();
              }}
              icon={UploadCloud}
            >
              Select .huff File
            </Button>

            {packedBlob && (
              <Button
                variant="outline"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDecompressCurrentPackedBlob();
                }}
                icon={CheckCircle2}
              >
                Auto-Test Current Active File
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-700/50 flex items-center gap-3 text-xs font-mono text-rose-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <div>
            <strong>Decompression Failed: </strong>
            {error}
          </div>
        </div>
      )}

      {/* Output preview */}
      {decompressedData && (
        <OutputPreview
          decompressedData={decompressedData}
          originalMeta={originalMeta}
        />
      )}
    </div>
  );
}
