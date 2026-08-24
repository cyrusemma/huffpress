import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { TopBar } from './components/layout/TopBar.jsx';
import { BinaryMatrix } from './components/layout/BinaryMatrix.jsx';
import { Home } from './pages/Home.jsx';
import { Compress } from './pages/Compress.jsx';
import { Visualizer } from './pages/Visualizer.jsx';
import { Decompress } from './pages/Decompress.jsx';
import { About } from './pages/About.jsx';
import { useHuffman } from './hooks/useHuffman.js';
import { useFileReader } from './hooks/useFileReader.js';

export function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'compress' | 'visualizer' | 'decompress' | 'about'

  const {
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
  } = useHuffman();

  const {
    isDragging,
    reading,
    error: fileReaderError,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput
  } = useFileReader({
    onTextLoaded: (text, filename, size) => {
      processText(text, filename, size);
      setActiveTab('compress');
    },
    onHuffLoaded: () => {
      setActiveTab('decompress');
    }
  });

  const handleTextSubmit = (text, filename) => {
    processText(text, filename);
    setActiveTab('compress');
  };

  const handleSelectPreset = (presetId) => {
    loadPreset(presetId);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0F] text-slate-100 font-body select-none">
      {/* Background Matrix Effect */}
      <BinaryMatrix />

      {/* Fixed Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Sticky Top Bar */}
        <TopBar
          fileMeta={fileMeta}
          stats={stats}
          packedBlob={packedBlob}
          onSelectPreset={handleSelectPreset}
          onNavigateToVisualizer={() => setActiveTab('visualizer')}
        />

        {/* Dynamic Page Router */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-700/60 text-xs font-mono text-rose-200 shadow-lg">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          {activeTab === 'home' && (
            <Home
              onTextSubmit={handleTextSubmit}
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileInput={handleFileInput}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'compress' && (
            <Compress
              rawText={rawText}
              freqMap={freqMap}
              codeTable={codeTable}
              stats={stats}
              encodedBitString={encodedBitString}
              packedBlob={packedBlob}
              fileMeta={fileMeta}
            />
          )}

          {activeTab === 'visualizer' && (
            <Visualizer
              treeSteps={treeSteps}
              codeTable={codeTable}
              fullTree={huffmanTree}
            />
          )}

          {activeTab === 'decompress' && (
            <Decompress
              fileMeta={fileMeta}
              packedBlob={packedBlob}
            />
          )}

          {activeTab === 'about' && (
            <About />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
