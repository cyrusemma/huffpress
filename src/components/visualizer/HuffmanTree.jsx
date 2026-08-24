import React, { useMemo, useState, useRef } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Sparkles, Info } from 'lucide-react';
import { formatChar } from '../../core/huffman.js';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';

export function HuffmanTree({ rootNode, activeNodeIds = [], codeTable = {} }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedLeaf, setSelectedLeaf] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });

  // Compute D3 Tree Layout
  const { nodes, links, bounds } = useMemo(() => {
    if (!rootNode) return { nodes: [], links: [], bounds: { width: 800, height: 500 } };

    // Convert custom tree to D3 hierarchy
    const hierarchyData = d3.hierarchy(rootNode, (d) => {
      const children = [];
      if (d.left) children.push(d.left);
      if (d.right) children.push(d.right);
      return children.length > 0 ? children : null;
    });

    const leafCount = hierarchyData.leaves().length;
    const treeDepth = hierarchyData.height;

    const width = Math.max(700, leafCount * 75);
    const height = Math.max(450, (treeDepth + 1) * 110);

    const treeLayout = d3.tree()
      .size([width - 120, height - 120])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 1.6));

    const root = treeLayout(hierarchyData);
    const calculatedNodes = root.descendants();
    const calculatedLinks = root.links();

    return {
      nodes: calculatedNodes,
      links: calculatedLinks,
      bounds: { width, height }
    };
  }, [rootNode]);

  // Compute active highlight path from root to selected/hovered leaf
  const highlightedNodeIds = useMemo(() => {
    const target = selectedLeaf || hoveredNode;
    if (!target) return new Set();

    const ids = new Set();
    let curr = target;
    while (curr) {
      ids.add(curr.data.id);
      curr = curr.parent;
    }
    return ids;
  }, [hoveredNode, selectedLeaf]);

  // Pan interaction handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // only main left click
    setIsPanning(true);
    startPanRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - startPanRef.current.x,
      y: e.clientY - startPanRef.current.y
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedLeaf(null);
  };

  if (!rootNode) {
    return (
      <div className="w-full h-[450px] rounded-2xl bg-[#0D0D14] border border-[#1E1E2E] flex flex-col items-center justify-center text-slate-400 font-mono">
        <Info className="w-8 h-8 text-purple-400 mb-2 animate-bounce" />
        <p>No tree loaded. Upload a file or select a preset to generate the Huffman Tree.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl bg-[#0B0B12] border border-[#1E1E2E] overflow-hidden shadow-2xl select-none group">
      {/* Visualizer Canvas Controls Header */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#12121D]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#26263A] shadow-lg">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.5))}
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.4))}
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
          title="Reset Zoom & Pan"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Legend & Hover Info Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <Badge variant="violet" size="sm">
          <span className="w-2 h-2 rounded-full bg-purple-400 mr-1" />
          Leaf Character
        </Badge>
        <Badge variant="cyan" size="sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1" />
          Internal Merge Node
        </Badge>
        {hoveredNode && (
          <Badge variant="amber" size="sm">
            {hoveredNode.data.isLeaf
              ? `Char: '${formatChar(hoveredNode.data.char)}' | Freq: ${hoveredNode.data.freq} | Code: ${codeTable[hoveredNode.data.char] || 'N/A'}`
              : `Internal Subtree Weight: ${hoveredNode.data.freq}`}
          </Badge>
        )}
      </div>

      {/* SVG Tree Viewport */}
      <div
        className="w-full h-[520px] overflow-hidden cursor-grab active:cursor-grabbing bg-grid-pattern relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${bounds.width} ${bounds.height}`}
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          <defs>
            {/* Glow filters */}
            <filter id="violetGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Links / Branches */}
          <g className="links" transform="translate(60, 60)">
            {links.map((link, idx) => {
              const isSourceHighlighted = highlightedNodeIds.has(link.source.data.id);
              const isTargetHighlighted = highlightedNodeIds.has(link.target.data.id);
              const isPathActive = isSourceHighlighted && isTargetHighlighted;

              // Determine if this is a left (0) or right (1) branch
              const isLeftChild = link.source.data.left && link.source.data.left.id === link.target.data.id;
              const bitLabel = isLeftChild ? '0' : '1';

              // Midpoint for bit label
              const midX = (link.source.x + link.target.x) / 2;
              const midY = (link.source.y + link.target.y) / 2;

              // Smooth curved link path
              const pathD = `M ${link.source.x} ${link.source.y} C ${link.source.x} ${(link.source.y + link.target.y) / 2}, ${link.target.x} ${(link.source.y + link.target.y) / 2}, ${link.target.x} ${link.target.y}`;

              return (
                <g key={`link-${idx}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isPathActive ? '#F59E0B' : '#2A2A3E'}
                    strokeWidth={isPathActive ? 3.5 : 2}
                    strokeDasharray={isPathActive ? 'none' : 'none'}
                    className="transition-all duration-300"
                    filter={isPathActive ? 'url(#goldGlow)' : undefined}
                  />

                  {/* Bit Label Badge (0 or 1) */}
                  <g transform={`translate(${midX + (isLeftChild ? -14 : 14)}, ${midY})`}>
                    <circle
                      r="10"
                      fill="#12121E"
                      stroke={isPathActive ? '#F59E0B' : isLeftChild ? '#7C3AED' : '#06B6D4'}
                      strokeWidth="1.5"
                    />
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fill={isPathActive ? '#FCD34D' : isLeftChild ? '#C084FC' : '#67E8F9'}
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {bitLabel}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes" transform="translate(60, 60)">
            {nodes.map((node) => {
              const { data } = node;
              const isLeaf = data.isLeaf;
              const isHighlighted = highlightedNodeIds.has(data.id);
              const isActiveStep = activeNodeIds.includes(data.id);

              return (
                <g
                  key={data.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer group/node transition-all duration-300"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLeaf(selectedLeaf?.data.id === data.id ? null : node);
                  }}
                >
                  {/* Outer glow ring for active node */}
                  {isActiveStep && (
                    <circle
                      r="28"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="2"
                      className="animate-ping opacity-75"
                    />
                  )}

                  {/* Node Base Circle */}
                  <circle
                    r={isLeaf ? 22 : 20}
                    fill={
                      isHighlighted
                        ? '#F59E0B'
                        : isLeaf
                        ? '#7C3AED'
                        : '#06B6D4'
                    }
                    stroke={
                      isHighlighted
                        ? '#FEF08A'
                        : isLeaf
                        ? '#C084FC'
                        : '#67E8F9'
                    }
                    strokeWidth={isHighlighted ? 3 : 2}
                    filter={isHighlighted ? 'url(#goldGlow)' : isLeaf ? 'url(#violetGlow)' : 'url(#cyanGlow)'}
                    className="transition-all duration-300 hover:scale-110"
                  />

                  {/* Node Inner Label */}
                  {isLeaf ? (
                    <>
                      <text
                        textAnchor="middle"
                        dy="-2"
                        fill="#FFFFFF"
                        fontSize="13"
                        fontFamily="Space Grotesk"
                        fontWeight="bold"
                      >
                        {formatChar(data.char)}
                      </text>
                      <text
                        textAnchor="middle"
                        dy="12"
                        fill="#E9D5FF"
                        fontSize="9"
                        fontFamily="JetBrains Mono"
                      >
                        {data.freq}
                      </text>
                    </>
                  ) : (
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill="#FFFFFF"
                      fontSize="12"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {data.freq}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
