import React, { useState, useMemo } from 'react';
import { BarChart2, ArrowUpDown, Search, Layers } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { formatChar } from '../../core/huffman.js';

export function FrequencyTable({ freqMap = {}, totalChars = 0 }) {
  const [sortKey, setSortKey] = useState('freq'); // 'freq' | 'char'
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'
  const [searchTerm, setSearchTerm] = useState('');

  const rows = useMemo(() => {
    const entries = Object.entries(freqMap);
    const maxFreq = Math.max(...entries.map(([, f]) => f), 1);

    const mapped = entries.map(([char, freq]) => {
      const percentage = totalChars > 0 ? ((freq / totalChars) * 100).toFixed(1) : 0;
      const relativePercent = (freq / maxFreq) * 100;
      const charCode = char.charCodeAt(0);
      const displayLabel = formatChar(char);

      return {
        char,
        freq,
        percentage,
        relativePercent,
        charCode,
        displayLabel
      };
    });

    // Filter
    const filtered = mapped.filter((r) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        r.char.toLowerCase().includes(term) ||
        r.displayLabel.toLowerCase().includes(term) ||
        String(r.charCode).includes(term)
      );
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortKey === 'freq') {
        return sortOrder === 'desc' ? b.freq - a.freq : a.freq - b.freq;
      } else {
        return sortOrder === 'desc' 
          ? b.char.localeCompare(a.char) 
          : a.char.localeCompare(b.char);
      }
    });

    return filtered;
  }, [freqMap, totalChars, sortKey, sortOrder, searchTerm]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <Card
      title="Character Frequency Analysis"
      subtitle={`${Object.keys(freqMap).length} unique characters across ${totalChars} total characters`}
      icon={BarChart2}
      headerAction={
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter char..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#161624] border border-[#26263A] text-slate-200 text-xs font-mono rounded-lg pl-7 pr-2 py-1 w-28 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      }
      bodyClassName="p-0"
    >
      <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead className="sticky top-0 bg-[#161622] border-b border-[#222234] text-slate-400 z-10 select-none">
            <tr>
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => toggleSort('char')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Character</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-2">ASCII</th>
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-white transition-colors text-right"
                onClick={() => toggleSort('freq')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Count (%)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-4 w-32">Weight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A2A]">
            {rows.map((r) => (
              <tr 
                key={r.char}
                className="hover:bg-[#181828] transition-colors group"
              >
                <td className="py-2 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1D1D2C] border border-[#2B2B3E] font-semibold text-purple-300">
                    {r.displayLabel}
                  </span>
                </td>
                <td className="py-2 px-2 text-slate-400">
                  #{r.charCode}
                </td>
                <td className="py-2 px-4 text-right">
                  <span className="font-semibold text-slate-100">{r.freq.toLocaleString()}</span>
                  <span className="text-slate-400 ml-1.5 text-[11px]">({r.percentage}%)</span>
                </td>
                <td className="py-2 px-4">
                  <div className="w-full bg-[#1A1A28] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full"
                      style={{ width: `${r.relativePercent}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
