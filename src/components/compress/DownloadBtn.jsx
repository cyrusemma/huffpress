import React, { useState } from 'react';
import { Download, Check, Sparkles, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../ui/Button.jsx';
import { downloadBlob } from '../../core/fileUtils.js';

export function DownloadBtn({ packedBlob, fileMeta, stats }) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!packedBlob) return;

    // Trigger Silicon Valley celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#7C3AED', '#06B6D4', '#10B981']
      });
    } catch (e) {
      // ignore
    }

    const huffName = fileMeta.name.replace(/\.[^/.]+$/, '') + '.huff';
    downloadBlob(packedBlob, huffName);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleDownload}
      icon={downloaded ? Check : Download}
      className="w-full sm:w-auto"
    >
      {downloaded ? 'Downloaded .huff File!' : 'Download .huff Archive'}
    </Button>
  );
}
