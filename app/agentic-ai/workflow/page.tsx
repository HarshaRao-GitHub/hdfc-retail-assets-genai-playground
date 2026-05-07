'use client';

import Link from 'next/link';
import Image from 'next/image';
import { stages } from '@/data/hdfc-agents-config';
import { useHdfcWorkflow } from '@/components/HdfcWorkflowContext';
import type { GateStatus } from '@/components/HdfcWorkflowContext';

const STATUS_CONFIG: Record<GateStatus, { label: string; color: string; bg: string; border: string; icon: string }> = {
  locked: { label: 'Locked', color: 'text-slate-400', bg: 'bg-slate-100', border: 'border-slate-200', icon: '🔒' },
  available: { label: 'Available', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: '▶️' },
  running: { label: 'Running', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: '⏳' },
  awaiting_approval: { label: 'Awaiting Approval', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', icon: '🛡️' },
  approved: { label: 'Approved', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '✓' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: '✕' },
  skipped: { label: 'Skipped', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: '⏭️' },
};

export default function WorkflowDashboardPage() {
  const { flow, loading, resetFlow } = useHdfcWorkflow();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const approved = flow?.stages.filter(s => s.gateStatus === 'approved').length ?? 0;
  const total = stages.length;
  const progressPct = Math.round((approved / total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🔗</span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Sequential Mode — Gated Workflow
            </span>
          </div>
          <h1 className="text-3xl font-black mb-3">Mortgage Lifecycle Workflow</h1>
          <p className="text-blue-100 text-[15px] max-w-2xl leading-relaxed mb-6">
            End-to-end mortgage processing through 9 sequential stages. Each stage requires HITL approval
            before the next unlocks — ensuring human governance at every decision point.
          </p>

          {/* Overall progress */}
          <div className="bg-white/10 rounded-xl p-4 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-white/80">Pipeline Progress</span>
              <span className="text-[14px] font-bold">{approved}/{total} stages approved</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href="/agentic-ai" className="px-5 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition text-sm border border-white/20">
              Switch to Standalone Mode
            </Link>
            <button onClick={() => { if (confirm('Reset the entire workflow? All stage results and approvals will be cleared.')) resetFlow(); }} className="px-5 py-2.5 bg-red-500/20 text-red-200 font-semibold rounded-lg hover:bg-red-500/30 transition text-sm border border-red-400/30">
              Reset Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const flowStage = flow?.stages.find(s => s.slug === stage.slug);
            const gateStatus = flowStage?.gateStatus ?? 'locked';
            const config = STATUS_CONFIG[gateStatus];
            const isLocked = gateStatus === 'locked';

            return (
              <div key={stage.slug} className="relative">
                {/* Connector line */}
                {idx < stages.length - 1 && (
                  <div className="absolute left-[39px] top-[76px] w-0.5 h-4 bg-slate-200 z-0" />
                )}

                <Link
                  href={isLocked ? '#' : `/agentic-ai/workflow/${stage.slug}`}
                  className={`group block rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isLocked
                      ? 'border-slate-200 bg-slate-50/50 opacity-60 cursor-not-allowed'
                      : `${config.border} bg-white hover:shadow-lg hover:border-blue-300`
                  }`}
                  onClick={(e) => { if (isLocked) e.preventDefault(); }}
                >
                  <div className="flex items-center gap-5 p-5">
                    {/* Stage number */}
                    <div className={`w-[54px] h-[54px] rounded-xl flex items-center justify-center text-xl font-black shrink-0 ${config.bg} ${config.color} border ${config.border}`}>
                      {gateStatus === 'approved' ? '✓' : gateStatus === 'locked' ? '🔒' : stage.number}
                    </div>

                    {/* Agent avatar + info */}
                    <Image src={stage.agentAvatar} alt={stage.agent.name} width={40} height={40} className="rounded-full border border-slate-200 shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{stage.icon}</span>
                        <h3 className="text-[15px] font-bold text-slate-800">{stage.title}</h3>
                        {stage.mandatory && (
                          <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">Required</span>
                        )}
                        {!stage.mandatory && (
                          <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">Optional</span>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-500">{stage.subtitle}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                        <span>{stage.tools.length} tools</span>
                        <span>{stage.dataSources.length} data sources</span>
                        <span>Approver: {stage.hitlApprover}</span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold ${config.bg} ${config.color} border ${config.border}`}>
                      {config.icon} {config.label}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Governance note */}
        <div className="mt-10 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🛡️</span>
            <div>
              <h3 className="text-[15px] font-bold text-indigo-800 mb-2">HITL Governance</h3>
              <p className="text-[13px] text-indigo-700 leading-relaxed">
                Each stage in the sequential workflow requires explicit human approval (HITL — Human-in-the-Loop)
                before the downstream stage unlocks. This ensures that AI-generated assessments are reviewed by
                the appropriate authority (Sales Head, Credit Committee, Legal Head, Compliance Officer, etc.)
                before they propagate through the mortgage lifecycle.
              </p>
              <p className="text-[12px] text-indigo-600 mt-2 font-medium italic">
                &ldquo;AI does the work, humans make the calls.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
