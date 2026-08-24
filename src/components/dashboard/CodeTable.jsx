import React, { useState, useMemo } from 'react';
import { Binary, Copy, Check, ArrowUpDown, Search } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { formatChar } from '../../core/huffman.js';

export function CodeTable({ codeTable = {} }) {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('length'); // 'length' | 'char' | 'code'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  const rows = useMemo(() => {
    const entries = Object.entries(codeTable);

    const mapped = entries.map(([char, code]) => {
      const length = code.length;
      let badgeVariant = 'green';
      if (length > 8) {
        badgeVariant = 'rose';
      } else if (length > 4) {
        badgeVariant = 'cyan';
      }

      return {
        char,
        displayLabel: formatChar(char),
        code,
        length,
        badgeVariant
      };
    });

    const filtered = mapped.filter((r) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        r.char.toLowerCase().includes(term) ||
        r.displayLabel.toLowerCase().includes(term) ||
        r.code.includes(term)
      );
    });

    filtered.sort((a, b) => {
      if (sortKey === 'length') {
        return sortOrder === 'asc' ? a.length - b.length : b.length - a.length;
      } else if (sortKey === 'code') {
        return sortOrder === 'asc' ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code);
      } else {
        return sortOrder === 'asc' ? a.char.localeCompare(b.char) : b.char.localeCompare(a.char);
      }
    });

    return filtered;
  }, [codeTable, sortKey, sortOrder, searchTerm]);

  const copyAsJson = () => {
    navigator.clipboard.writeText(JSON.stringify(codeTable, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <Card
      title="Prefix-Free Huffman Codes"
      subtitle={`${Object.keys(codeTable).length} generated variable-length bit codes`}
      icon={Binary}
      headerAction={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyAsJson}
            icon={copied ? Check : Copy}
          >
            {copied ? 'Copied' : 'JSON'}
          </Button>
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
                  <span>Char</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => toggleSort('code')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Binary Code</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-white transition-colors text-right"
                onClick={() => toggleSort('length')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Bits</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A2A]">
            {rows.map((r) => (
              <tr 
                key={r.char}
                className="hover:bg-[#181828] transition-colors group"
              >
                <td className="py-2 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#1D1D2C] border border-[#2B2B3E] font-semibold text-cyan-300">
                    {r.displayLabel}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <span className="text-emerald-400 font-semibold tracking-wider bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/30">
                    {r.code}
                  </span>
                </td>
                <td className="py-2 px-4 text-right">
                  <Badge variant={r.badgeVariant} size="sm">
                    {r.length} {r.length === 1 ? 'bit' : 'bits'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
