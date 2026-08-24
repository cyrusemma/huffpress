import React from 'react';
import { StatsRow } from '../components/dashboard/StatsRow.jsx';
import { FrequencyTable } from '../components/dashboard/FrequencyTable.jsx';
import { CodeTable } from '../components/dashboard/CodeTable.jsx';
import { CompressionChart } from '../components/dashboard/CompressionChart.jsx';
import { CompressPanel } from '../components/compress/CompressPanel.jsx';

export function Compress({
  rawText,
  freqMap,
  codeTable,
  stats,
  encodedBitString,
  packedBlob,
  fileMeta
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Metrics Row */}
      <StatsRow stats={stats} />

      {/* 3-Column Dashboard View */}
      <div className="dashboard-grid">
        {/* Column 1: Frequency Analysis */}
        <FrequencyTable
          freqMap={freqMap}
          totalChars={rawText.length}
        />

        {/* Column 2: Huffman Code Table */}
        <CodeTable
          codeTable={codeTable}
        />

        {/* Column 3: Redundancy & Storage Donut Chart */}
        <CompressionChart
          stats={stats}
        />
      </div>

      {/* Binary Output & Action Bar */}
      <CompressPanel
        encodedBitString={encodedBitString}
        packedBlob={packedBlob}
        fileMeta={fileMeta}
        stats={stats}
        codeTable={codeTable}
      />
    </div>
  );
}
