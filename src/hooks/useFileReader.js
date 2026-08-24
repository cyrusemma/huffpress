import { useState, useCallback } from 'react';
import { readFileAsText, readFileAsArrayBuffer } from '../core/fileUtils.js';
import { unpackFile } from '../core/bitWriter.js';
import { decode } from '../core/huffman.js';
import { reconstructTreeFromCodeTable } from '../core/bitWriter.js';
import { calculateSHA256 } from '../core/fileUtils.js';

export function useFileReader({ onTextLoaded, onHuffLoaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processUploadedFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback(async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processUploadedFile(files[0]);
    }
  }, []);

  const processUploadedFile = async (file) => {
    try {
      setReading(true);
      setError(null);

      // Check if it's a .huff file
      if (file.name.endsWith('.huff')) {
        const buffer = await readFileAsArrayBuffer(file);
        const { metadata, codeTable, encodedStr } = unpackFile(buffer);
        const tree = reconstructTreeFromCodeTable(codeTable);
        const decodedText = decode(encodedStr, tree);
        const sha256 = await calculateSHA256(decodedText);

        if (onHuffLoaded) {
          onHuffLoaded({
            fileName: file.name,
            fileSize: file.size,
            metadata,
            codeTable,
            encodedStr,
            decodedText,
            sha256
          });
        }
      } else {
        // Plain text or code file
        const text = await readFileAsText(file);
        if (onTextLoaded) {
          onTextLoaded(text, file.name, file.size);
        }
      }
    } catch (err) {
      console.error('File reading failed:', err);
      setError(err.message || 'Failed to read file.');
    } finally {
      setReading(false);
    }
  };

  return {
    isDragging,
    reading,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    processUploadedFile
  };
}
