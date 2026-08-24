import React from 'react';
import { GitFork, Layers, Info } from 'lucide-react';
import { HuffmanTree } from '../components/visualizer/HuffmanTree.jsx';
import { HeapVisualizer } from '../components/visualizer/HeapVisualizer.jsx';
import { BuildStepper } from '../components/visualizer/BuildStepper.jsx';
import { StepInfo } from '../components/visualizer/StepInfo.jsx';
import { useTreeAnimation } from '../hooks/useTreeAnimation.js';

export function Visualizer({ treeSteps, codeTable, fullTree }) {
  const animationState = useTreeAnimation(treeSteps);

  const {
    currentStepIndex,
    totalSteps,
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    isAtStart,
    isAtEnd,
    nextStep,
    prevStep,
    reset,
    jumpToEnd,
    jumpToStep,
    togglePlay
  } = animationState;

  // Render current step tree or fall back to full completed tree
  const activeTreeRoot = currentStep
    ? (currentStep.mergedNode || currentStep.heapSnapshot?.[0] || fullTree)
    : fullTree;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Visualizer Controls */}
      <BuildStepper
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        speed={speed}
        setSpeed={setSpeed}
        isAtStart={isAtStart}
        isAtEnd={isAtEnd}
        nextStep={nextStep}
        prevStep={prevStep}
        reset={reset}
        jumpToEnd={jumpToEnd}
        jumpToStep={jumpToStep}
        togglePlay={togglePlay}
      />

      {/* Main Interactive D3 Huffman Tree */}
      <HuffmanTree
        rootNode={activeTreeRoot}
        activeNodeIds={currentStep?.activeNodeIds || []}
        codeTable={codeTable}
      />

      {/* 2-Column Info & Min-Heap Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Step Log Narrative */}
        <StepInfo currentStep={currentStep} />

        {/* Right: Priority Queue Min-Heap State */}
        <HeapVisualizer
          heapSnapshot={currentStep?.heapSnapshot || []}
          extractedLeft={currentStep?.extractedLeft}
          extractedRight={currentStep?.extractedRight}
          mergedNode={currentStep?.mergedNode}
        />
      </div>
    </div>
  );
}
