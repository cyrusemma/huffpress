/**
 * BitWriter and Binary Container (.huff) for HuffPress
 * Handles bit-packing into Uint8Array and unpacks binary files with metadata.
 * 
 * Container Format:
 * [0..1]   : Magic Bytes 'HP' (0x48, 0x50)
 * [2..5]   : Header length in bytes (Uint32 Big-Endian)
 * [6..N]   : Header JSON UTF-8 bytes { version, originalName, originalSize, codeTable, originalCharCount }
 * [N+1]    : Padding bit count (0..7) in the final byte
 * [N+2..End]: Packed payload bytes
 */

const MAGIC_BYTE_1 = 0x48; // 'H'
const MAGIC_BYTE_2 = 0x50; // 'P'
const FORMAT_VERSION = 1;

/**
 * Packs a binary string (e.g. "1011001...") into a Uint8Array
 * @param {string} bitString
 * @returns {{ bytes: Uint8Array, paddingBits: number }}
 */
export function stringToBinary(bitString) {
  if (!bitString) {
    return { bytes: new Uint8Array(0), paddingBits: 0 };
  }

  const remainder = bitString.length % 8;
  const paddingBits = remainder === 0 ? 0 : 8 - remainder;
  const paddedBitString = bitString + '0'.repeat(paddingBits);
  const totalBytes = paddedBitString.length / 8;
  const bytes = new Uint8Array(totalBytes);

  for (let i = 0; i < totalBytes; i++) {
    const byteStr = paddedBitString.substr(i * 8, 8);
    bytes[i] = parseInt(byteStr, 2);
  }

  return { bytes, paddingBits };
}

/**
 * Unpacks a Uint8Array into a binary string ("1011001...") taking padding into account
 * @param {Uint8Array} bytes
 * @param {number} paddingBits
 * @returns {string}
 */
export function binaryToString(bytes, paddingBits = 0) {
  if (!bytes || bytes.length === 0) return '';

  let bitString = '';
  for (let i = 0; i < bytes.length; i++) {
    let byteStr = bytes[i].toString(2).padStart(8, '0');
    // If last byte, slice off the padding bits
    if (i === bytes.length - 1 && paddingBits > 0) {
      byteStr = byteStr.slice(0, 8 - paddingBits);
    }
    bitString += byteStr;
  }
  return bitString;
}

/**
 * Packs encoded bitstream + code table + metadata into a downloadable Blob (.huff file)
 * @param {string} encodedStr
 * @param {Record<string, string>} codeTable
 * @param {Object} metadata { originalName, originalSize, originalCharCount }
 * @returns {Blob}
 */
export function packFile(encodedStr, codeTable, metadata = {}) {
  const headerObj = {
    version: FORMAT_VERSION,
    originalName: metadata.originalName || 'compressed_data.txt',
    originalSize: metadata.originalSize || 0,
    originalCharCount: metadata.originalCharCount || 0,
    codeTable: codeTable
  };

  const headerJsonStr = JSON.stringify(headerObj);
  const headerBytes = new TextEncoder().encode(headerJsonStr);
  const headerLength = headerBytes.length;

  const { bytes: payloadBytes, paddingBits } = stringToBinary(encodedStr);

  // Total file size: 2 (magic) + 4 (header length) + headerBytes.length + 1 (padding byte) + payloadBytes.length
  const totalSize = 2 + 4 + headerLength + 1 + payloadBytes.length;
  const buffer = new ArrayBuffer(totalSize);
  const dataView = new DataView(buffer);
  const uint8View = new Uint8Array(buffer);

  // 1. Magic Bytes 'HP'
  uint8View[0] = MAGIC_BYTE_1;
  uint8View[1] = MAGIC_BYTE_2;

  // 2. Header Length (Uint32 Big-Endian)
  dataView.setUint32(2, headerLength, false);

  // 3. Header JSON Bytes
  uint8View.set(headerBytes, 6);

  // 4. Padding bit count
  const paddingOffset = 6 + headerLength;
  uint8View[paddingOffset] = paddingBits;

  // 5. Payload Bytes
  const payloadOffset = paddingOffset + 1;
  uint8View.set(payloadBytes, payloadOffset);

  return new Blob([buffer], { type: 'application/octet-stream' });
}

/**
 * Unpacks a .huff ArrayBuffer into metadata, code table, and binary encoded string
 * @param {ArrayBuffer} arrayBuffer
 * @returns {{ metadata: Object, codeTable: Record<string, string>, encodedStr: string }}
 */
export function unpackFile(arrayBuffer) {
  if (!arrayBuffer || arrayBuffer.byteLength < 7) {
    throw new Error('Invalid .huff file: File size is too small.');
  }

  const uint8View = new Uint8Array(arrayBuffer);
  const dataView = new DataView(arrayBuffer);

  // 1. Verify Magic Bytes
  if (uint8View[0] !== MAGIC_BYTE_1 || uint8View[1] !== MAGIC_BYTE_2) {
    throw new Error('Invalid file format: Missing "HP" magic bytes. Not a valid HuffPress file.');
  }

  // 2. Read Header Length
  const headerLength = dataView.getUint32(2, false);
  if (6 + headerLength + 1 > arrayBuffer.byteLength) {
    throw new Error('Corrupted .huff file: Header length exceeds file bounds.');
  }

  // 3. Read Header JSON
  const headerBytes = uint8View.slice(6, 6 + headerLength);
  const headerJsonStr = new TextDecoder().decode(headerBytes);
  let headerObj;
  try {
    headerObj = JSON.parse(headerJsonStr);
  } catch (err) {
    throw new Error(`Corrupted .huff file: Malformed header JSON (${err.message}).`);
  }

  // 4. Read Padding Bits
  const paddingOffset = 6 + headerLength;
  const paddingBits = uint8View[paddingOffset];
  if (paddingBits < 0 || paddingBits > 7) {
    throw new Error('Corrupted .huff file: Invalid padding bit count.');
  }

  // 5. Read Payload Bytes & reconstruct bit string
  const payloadOffset = paddingOffset + 1;
  const payloadBytes = uint8View.slice(payloadOffset);
  const encodedStr = binaryToString(payloadBytes, paddingBits);

  return {
    metadata: {
      version: headerObj.version,
      originalName: headerObj.originalName,
      originalSize: headerObj.originalSize,
      originalCharCount: headerObj.originalCharCount
    },
    codeTable: headerObj.codeTable,
    encodedStr: encodedStr
  };
}

/**
 * Reconstructs the Huffman tree structure from an inverted code table
 * @param {Record<string, string>} codeTable
 * @returns {Object} Root node of the reconstructed tree
 */
export function reconstructTreeFromCodeTable(codeTable) {
  let nextId = 1;
  const root = {
    id: `recon-${nextId++}`,
    char: null,
    freq: 0,
    isLeaf: false,
    left: null,
    right: null
  };

  const entries = Object.entries(codeTable);
  if (entries.length === 1) {
    const [char, code] = entries[0];
    return {
      id: `recon-single`,
      char,
      freq: 0,
      isLeaf: true,
      left: null,
      right: null
    };
  }

  for (const [char, code] of entries) {
    let current = root;
    for (let i = 0; i < code.length; i++) {
      const bit = code[i];
      if (bit === '0') {
        if (!current.left) {
          current.left = {
            id: `recon-${nextId++}`,
            char: null,
            freq: 0,
            isLeaf: false,
            left: null,
            right: null
          };
        }
        current = current.left;
      } else if (bit === '1') {
        if (!current.right) {
          current.right = {
            id: `recon-${nextId++}`,
            char: null,
            freq: 0,
            isLeaf: false,
            left: null,
            right: null
          };
        }
        current = current.right;
      }
    }
    current.char = char;
    current.isLeaf = true;
  }

  return root;
}
