import React from 'react';
import { Terminal, GitMerge, CheckCircle2, Database, HelpCircle } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';

export function StepInfo({ currentStep }) {
  if (!currentStep) return null;

  const typeConfig = {
    INIT: {
      label: 'Initial Priority Queue Forest',
      variant: 'cyan',
      icon: Database,
      tip: 'Each distinct character begins as an independent 1-node tree in the Min-Heap priority queue.'
    },
    MERGE: {
      label: 'Greedy Minimum Merge',
      variant: 'violet',
      icon: GitMerge,
      tip: 'The greedy choice property guarantees that merging the two lowest frequencies yields an optimal prefix code.'
    },
    COMPLETE: {
      label: 'Optimal Tree Constructed',
      variant: 'green',
      icon: CheckCircle2,
      tip: 'Every character now has an unambiguous binary prefix path: left branches assign 0, right branches assign 1.'
    }
  };

  const config = typeConfig[currentStep.type] || typeConfig.MERGE;
  const Icon = config.icon;

  return (
    <Card
      title={`Step ${currentStep.stepIndex + 1} Log`}
      subtitle="DSA Algorithmic Trace"
      icon={Terminal}
      headerAction={
        <Badge variant={config.variant} size="sm" dot>
          {config.label}
        </Badge>
      }
    >
      <div className="space-y-3 font-mono text-xs">
        {/* Narrative Box */}
        <div className="p-3.5 rounded-xl bg-[#161624] border border-[#26263A] text-slate-200 leading-relaxed">
          {currentStep.description}
        </div>

        {/* DSA Educational Note */}
        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 flex items-start gap-2.5 text-[11px] text-purple-300">
          <HelpCircle className="w-4 h-4 flex-shrink-0 text-purple-400 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-purple-200">DSA Insight: </strong>
            {config.tip}
          </p>
        </div>
      </div>
    </Card>
  );
}
