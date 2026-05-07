'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { stages } from '@/data/hdfc-agents-config';
import { useHdfcWorkflow } from '@/components/HdfcWorkflowContext';
import type { GateStatus } from '@/components/HdfcWorkflowContext';

const STATUS_CONFIG: Record<GateStatus, { badge: string; badgeClass: string; overlay: boolean }> = {
  locked: { badge: '🔒 Locked', badgeClass: 'bg-gray-200 text-gray-600', overlay: true },
  available: { badge: 'AI Agent', badgeClass: 'bg-hdfc-red text-white', overlay: false },
  running: { badge: '⏳ Running', badgeClass: 'bg-blue-500 text-white', overlay: false },
  awaiting_approval: { badge: '⏳ Awaiting HITL', badgeClass: 'bg-amber-500 text-white', overlay: false },
  approved: { badge: '✅ Approved', badgeClass: 'bg-emerald-500 text-white', overlay: false },
  rejected: { badge: '❌ Rejected', badgeClass: 'bg-red-500 text-white', overlay: false },
  skipped: { badge: '⏭ Skipped', badgeClass: 'bg-slate-400 text-white', overlay: false },
};

export default function WorkflowDashboardPage() {
  const { flow, loading, resetFlow, skipStage } = useHdfcWorkflow();

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-hdfc-blue border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  const approved = flow?.stages.filter(s => s.gateStatus === 'approved').length ?? 0;
  const total = stages.length;
  const progressPct = Math.round((approved / total) * 100);
  const totalTools = stages.reduce((a, s) => a + s.tools.length, 0);

  const rows = [stages.slice(0, 3), stages.slice(3, 6), stages.slice(6, 9)];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-hdfc-mist">
        {/* Hero */}
        <section className="bg-gradient-to-br from-hdfc-navy via-hdfc-blueDeep to-hdfc-slate text-white">
          <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[11px] font-mono mb-5">
                <span className="w-1.5 h-1.5 bg-hdfc-red rounded-full animate-pulse" />
                Sequential Workflow &middot; Gated Progression &middot; HITL Governed
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                Mortgage Lifecycle
                <br />
                <span className="text-hdfc-red">Sequential Workflow.</span>
              </h1>
              <p className="mt-4 text-white/75 max-w-2xl text-[15px] leading-relaxed">
                End-to-end mortgage processing through 9 sequential stages. Each stage requires HITL approval
                before the next unlocks — ensuring human governance at every decision point.
              </p>
              <p className="mt-2 text-hdfc-red font-semibold italic text-[15px]">
                &ldquo;AI does the work, humans make the calls.&rdquo;
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/agentic-ai"
                  className="border border-white/30 text-white px-5 py-2.5 rounded-md hover:bg-white/10 transition"
                >
                  Switch to Standalone Mode
                </Link>
                <button
                  onClick={() => { if (confirm('Reset the entire workflow? All stage results and approvals will be cleared.')) resetFlow(); }}
                  className="bg-red-500/20 text-red-200 font-semibold px-5 py-2.5 rounded-md hover:bg-red-500/30 transition border border-red-400/30"
                >
                  Reset Workflow
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Progress */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-semibold text-white/80">Pipeline Progress</span>
                  <span className="text-[14px] font-bold">{approved}/{total} approved</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur text-center">
                  <div className="text-xl font-bold text-hdfc-red">9</div>
                  <div className="text-[9px] uppercase tracking-wider text-white/60 mt-0.5">Stages</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur text-center">
                  <div className="text-xl font-bold text-hdfc-red">{totalTools}</div>
                  <div className="text-[9px] uppercase tracking-wider text-white/60 mt-0.5">Tools</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur text-center">
                  <div className="text-xl font-bold text-emerald-400">{approved}</div>
                  <div className="text-[9px] uppercase tracking-wider text-white/60 mt-0.5">Approved</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pipeline Flow Grid */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="text-[11px] font-mono uppercase tracking-wider text-hdfc-redDeep">
              Lead &rarr; Service Pipeline
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-hdfc-navy mt-1">
              9-Stage Sequential Workflow
            </h2>
            <p className="text-hdfc-slate mt-2 max-w-3xl text-[14px] leading-relaxed">
              Each stage must be completed and approved before the next unlocks. Optional stages can be skipped.
            </p>
          </div>

          {/* Desktop: 3-column rows with arrows */}
          <div className="hidden lg:block space-y-0">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx}>
                <div className="flex items-stretch">
                  {row.map((stage, colIdx) => (
                    <div key={stage.slug} className="contents">
                      <div className="flex-1 min-w-0">
                        <WorkflowStageCard stage={stage} flow={flow} skipStage={skipStage} />
                      </div>
                      {colIdx < row.length - 1 && <HorizontalArrow />}
                    </div>
                  ))}
                </div>
                {rowIdx < rows.length - 1 && <RowConnector />}
              </div>
            ))}
          </div>

          {/* Mobile: single column */}
          <div className="lg:hidden">
            {stages.map((stage, idx) => (
              <div key={stage.slug}>
                <WorkflowStageCard stage={stage} flow={flow} skipStage={skipStage} />
                {idx < stages.length - 1 && <MobileArrow />}
              </div>
            ))}
          </div>
        </section>

        {/* HITL Governance */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🛡️</span>
              <div>
                <h3 className="text-[15px] font-bold text-hdfc-navy mb-2">HITL Governance</h3>
                <p className="text-[13px] text-hdfc-slate leading-relaxed">
                  Each stage in the sequential workflow requires explicit human approval (HITL — Human-in-the-Loop)
                  before the downstream stage unlocks. This ensures that AI-generated assessments are reviewed by
                  the appropriate authority (Sales Head, Credit Committee, Legal Head, Compliance Officer, etc.)
                  before they propagate through the mortgage lifecycle.
                </p>
                <p className="text-[12px] text-hdfc-redDeep mt-2 font-medium italic">
                  &ldquo;AI does the work, humans make the calls.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-hdfc-line bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-hdfc-slate text-center">
          HDFC Retail Assets — Sequential Workflow Mode &middot; Synthetic Data Only &middot; Not for Production Use
        </div>
      </footer>
    </>
  );
}

function WorkflowStageCard({
  stage,
  flow,
  skipStage,
}: {
  stage: (typeof stages)[number];
  flow: { stages: { slug: string; gateStatus: GateStatus }[] } | null;
  skipStage: (slug: string) => void;
}) {
  const totalRows = stage.dataSources.reduce((a, ds) => a + ds.rowEstimate, 0);
  const flowStage = flow?.stages.find(s => s.slug === stage.slug);
  const status = flowStage?.gateStatus ?? 'locked';
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.locked;
  const isLocked = status === 'locked';
  const isSkipped = status === 'skipped';
  const isDisabled = isLocked || isSkipped;
  const canSkip = !stage.mandatory && status === 'available';

  const Wrapper = isDisabled ? 'div' : Link;
  const wrapperProps = isDisabled
    ? { className: `group relative flex flex-col bg-white rounded-xl border border-hdfc-line shadow-card overflow-hidden ${isSkipped ? 'opacity-50' : 'opacity-60'} cursor-not-allowed` }
    : { href: `/agentic-ai/workflow/${stage.slug}` as string, className: 'group relative flex flex-col bg-white rounded-xl border border-hdfc-line shadow-card hover:border-hdfc-red/40 hover:shadow-md transition overflow-hidden' };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Wrapper {...(wrapperProps as any)}>
      {/* Agent avatar banner */}
      <div className="relative h-28 overflow-hidden" style={{ backgroundColor: stage.colorLight }}>
        <Image
          src={stage.agentAvatar}
          alt={stage.agent.name}
          width={400}
          height={200}
          className={`w-full h-full object-cover object-top group-hover:scale-105 transition duration-500 ${isDisabled ? 'grayscale opacity-50' : 'opacity-90'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {isLocked && <div className="absolute inset-0 bg-gray-500/30" />}
        {isSkipped && <div className="absolute inset-0 bg-slate-400/30" />}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2.5 flex items-end justify-between">
          <div>
            <div className="text-[10px] font-mono text-white/70 tracking-wide">
              Stage {stage.number}
            </div>
            <div className="font-bold text-white leading-tight text-[15px] drop-shadow-sm">
              {stage.title}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm ${config.badgeClass}`}>
              {config.badge}
            </span>
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${stage.mandatory ? 'bg-red-500/80 text-white' : 'bg-white/25 text-white backdrop-blur-sm'}`}>
              {stage.mandatory ? 'REQUIRED' : 'OPTIONAL'}
            </span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-sm" style={{ backgroundColor: stage.colorLight }}>
            {stage.icon}
          </div>
          <div className="text-[12px] font-semibold text-hdfc-navy leading-tight">
            {stage.agent.name}
          </div>
        </div>

        <p className="text-[12px] text-hdfc-slate leading-relaxed flex-1">
          {stage.subtitle}
        </p>

        <div className="mt-2.5 flex flex-wrap gap-1">
          {stage.tools.map((t) => (
            <span key={t.name} className="text-[9px] font-mono bg-hdfc-mist text-hdfc-slate px-1.5 py-0.5 rounded">
              {t.icon} {t.name}
            </span>
          ))}
        </div>

        <div className="mt-3 pt-2.5 border-t border-hdfc-line flex items-center justify-between text-[10px]">
          <div className="text-hdfc-slate">
            <span className="font-semibold">{stage.agent.shortId}</span> &middot; {stage.dataSources.length} sources &middot; {totalRows} rows
          </div>
          <div className="flex items-center gap-2">
            {canSkip && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); skipStage(stage.slug); }}
                className="text-[10px] text-slate-500 hover:text-slate-700 font-semibold hover:bg-slate-100 px-1.5 py-0.5 rounded transition"
              >
                Skip &rarr;
              </button>
            )}
            {!isDisabled && (
              <span className="text-hdfc-redDeep font-semibold group-hover:translate-x-0.5 transition">
                Open &rarr;
              </span>
            )}
            {isSkipped && (
              <span className="text-slate-400 font-semibold italic">
                Skipped
              </span>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

function HorizontalArrow() {
  return (
    <div className="hidden lg:flex items-center justify-center w-8 shrink-0">
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12H26" stroke="#ED1C24" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 6L28 12L20 18" stroke="#ED1C24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function RowConnector() {
  return (
    <div className="hidden lg:block w-full py-1">
      <svg width="100%" height="48" viewBox="0 0 1000 48" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M920 0 V12 Q920 24 908 24 L92 24 Q80 24 80 36 V48" stroke="#ED1C24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M74 40 L80 48 L86 40" stroke="#ED1C24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

function MobileArrow() {
  return (
    <div className="flex lg:hidden items-center justify-center py-1">
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V22" stroke="#ED1C24" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 17L12 24L18 17" stroke="#ED1C24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
