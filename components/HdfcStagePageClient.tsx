'use client';

import { useRouter } from 'next/navigation';
import type { Stage } from '@/data/hdfc-agents-config';
import HdfcAgentChat from './HdfcAgentChat';
import { useHdfcWorkflow } from './HdfcWorkflowContext';
import Link from 'next/link';
import { stages } from '@/data/hdfc-agents-config';

export default function HdfcStagePageClient({ stage }: { stage: Stage }) {
  const { getGateStatus, skipStage, loading } = useHdfcWorkflow();
  const router = useRouter();
  const status = getGateStatus(stage.slug);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-hdfc-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div className="text-[13px] text-hdfc-slate">Loading workflow state...</div>
        </div>
      </div>
    );
  }

  if (status === 'locked') {
    const prevStage = stages.find(s => s.number === stage.number - 1);
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-hdfc-navy mb-2">Stage Locked</h2>
          <p className="text-[14px] text-hdfc-slate leading-relaxed mb-4">
            <strong>Stage {stage.number}: {stage.title}</strong> is locked because the previous stage
            has not been completed and approved yet.
          </p>
          <p className="text-[13px] text-hdfc-slate mb-6">
            The HITL (Human-in-the-Loop) approval for Stage {stage.number - 1} must be granted
            before this stage becomes available. This enforces the governance principle:
            <em className="text-hdfc-redDeep"> &ldquo;AI does the work, humans make the calls.&rdquo;</em>
          </p>
          {prevStage && (
            <Link
              href={`/agentic-ai/workflow/${prevStage.slug}`}
              className="inline-block bg-hdfc-red text-white font-semibold px-5 py-2.5 rounded-md hover:bg-hdfc-redDeep transition"
            >
              Go to Stage {stage.number - 1}: {prevStage.title} &rarr;
            </Link>
          )}
        </div>
      </div>
    );
  }

  function handleSkip() {
    if (!confirm(`Skip "${stage.title}"? This stage is optional. You can proceed to the next stage without running this agent.`)) return;
    skipStage(stage.slug);
    router.push('/agentic-ai/workflow');
  }

  return (
    <div>
      {!stage.mandatory && status === 'available' && (
        <div className="mb-4 flex items-center justify-between bg-sky-50 border border-sky-200 rounded-xl px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
              Optional Stage
            </span>
            <span className="text-[12px] text-sky-800">
              This stage is optional for the mortgage lifecycle. You can skip it or run the agent as needed.
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="shrink-0 ml-4 px-4 py-2 text-[12px] font-semibold text-slate-600 hover:text-white bg-white hover:bg-slate-500 border border-slate-300 hover:border-slate-500 rounded-lg transition"
          >
            Skip Stage &rarr;
          </button>
        </div>
      )}

      {stage.mandatory && (
        <div className="mb-4 flex items-center gap-3 bg-red-50/50 border border-red-100 rounded-xl px-5 py-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
            Required Stage
          </span>
          <span className="text-[12px] text-red-800/70">
            This stage is mandatory. HITL approval is required before the next stage unlocks.
          </span>
        </div>
      )}

      <HdfcAgentChat stage={stage} />
    </div>
  );
}
