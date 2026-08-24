import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  FastForward, 
  Sliders,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';

export function BuildStepper({
  currentStepIndex,
  totalSteps,
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
}) {
  const speedOptions = [
    { label: '0.5x (Slow)', value: 1600 },
    { label: '1x (Normal)', value: 900 },
    { label: '2x (Fast)', value: 450 },
    { label: '4x (Turbo)', value: 200 }
  ];

  return (
    <div className="p-4 rounded-2xl bg-[#111118] border border-[#1E1E2E] space-y-4 shadow-xl select-none">
      {/* Top row: timeline scrubber & progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Algorithm Progress: Step <span className="text-cyan-400 font-bold">{currentStepIndex + 1}</span> of <span className="text-slate-200">{totalSteps}</span>
          </span>
          <Badge variant={isAtEnd ? 'green' : 'violet'} size="sm">
            {isAtEnd ? '✓ Tree Completed' : 'Building Subtrees...'}
          </Badge>
        </div>

        {/* Step Slider / Scrubber */}
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => jumpToStep(Number(e.target.value))}
          className="w-full h-2 bg-[#1A1A28] rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>

      {/* Bottom row: playback controls & speed buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Playback action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={isAtStart}
            title="Reset to initial state"
            icon={RotateCcw}
          >
            Reset
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={isAtStart}
            title="Previous Step"
            icon={ChevronLeft}
          >
            Prev
          </Button>

          <Button
            variant={isPlaying ? 'cyan' : 'primary'}
            size="md"
            onClick={togglePlay}
            icon={isPlaying ? Pause : Play}
            className="px-5"
          >
            {isPlaying ? 'Pause' : isAtEnd ? 'Replay' : 'Play Steps'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextStep}
            disabled={isAtEnd}
            title="Next Step"
            iconRight={ChevronRight}
          >
            Next
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={jumpToEnd}
            disabled={isAtEnd}
            title="Jump to complete tree"
            iconRight={FastForward}
          >
            Final
          </Button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">Speed:</span>
          <div className="flex items-center gap-1 bg-[#161624] p-1 rounded-xl border border-[#26263A]">
            {speedOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSpeed(opt.value)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                  speed === opt.value
                    ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(124,58,237,0.5)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
