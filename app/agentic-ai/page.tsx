import Link from 'next/link';
import Image from 'next/image';
import { stages } from '@/data/hdfc-agents-config';
import Header from '@/components/Header';

export const metadata = {
  title: 'Agentic AI — HDFC Retail Assets',
  description: '9 AI Agents spanning the complete mortgage lifecycle — from Market Intelligence to Customer Service Excellence.',
};

export default function AgenticAIHubPage() {
  const totalRows = stages.reduce(
    (acc, s) => acc + s.dataSources.reduce((a, d) => a + d.rowEstimate, 0), 0
  );
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
                HDFC Agentic AI Operating System &middot; Enterprise LLM
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                9-Stage Mortgage
                <br />
                <span className="text-hdfc-red">Agentic AI System.</span>
              </h1>
              <p className="mt-4 text-white/75 max-w-2xl text-[15px] leading-relaxed">
                End-to-end AI operating system for HDFC Retail Assets — from Lead Intelligence to Customer Service Excellence,
                with HITL governance. 9 autonomous agents, {totalTools} tools, {totalRows.toLocaleString()}+ data records,
                processing every stage of the mortgage lifecycle.
              </p>
              <p className="mt-2 text-hdfc-red font-semibold italic text-[15px]">
                &ldquo;AI does the work, humans make the calls.&rdquo;
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/agentic-ai/lead-intelligence"
                  className="bg-hdfc-red text-white font-semibold px-5 py-2.5 rounded-md hover:bg-hdfc-redDeep transition"
                >
                  Start with Stage 1: Lead Intelligence
                </Link>
                <Link
                  href="/agentic-ai/workflow"
                  className="border border-white/30 text-white px-5 py-2.5 rounded-md hover:bg-white/10 transition"
                >
                  Sequential Workflow Mode
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat n="9" label="Workflow Stages" />
              <Stat n="9" label="AI Agents" />
              <Stat n={String(totalTools)} label="Agentic Tools" />
              <Stat n={totalRows.toLocaleString()} label="Data Records" />
              <Stat n={String(stages.reduce((a, s) => a + s.dataSources.length, 0))} label="Data Files" />
              <Stat n="LLM" label="Foundation Model" mono />
            </div>
          </div>
        </section>

        {/* Stage Grid */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="text-[11px] font-mono uppercase tracking-wider text-hdfc-redDeep">
              Lead &rarr; Service Pipeline
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-hdfc-navy mt-1">
              9-Stage Agentic AI Agents
            </h2>
            <p className="text-hdfc-slate mt-2 max-w-3xl text-[14px] leading-relaxed">
              Each stage has a dedicated AI agent with specialized tools, operating on real mortgage data.
              Every agent action is governed by HITL controls — approval gates, audit trails, confidence-based escalations, and human override tracking.
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
                        <AgentCard stage={stage} />
                      </div>
                      {colIdx < row.length - 1 && <HorizontalArrow />}
                    </div>
                  ))}
                </div>
                {rowIdx < rows.length - 1 && <RowConnector />}
              </div>
            ))}
          </div>

          {/* Mobile: single column with down arrows */}
          <div className="lg:hidden">
            {stages.map((stage, idx) => (
              <div key={stage.slug}>
                <AgentCard stage={stage} />
                {idx < stages.length - 1 && <MobileArrow />}
              </div>
            ))}
          </div>
        </section>

        {/* HITL Governance Banner */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center text-2xl">
                🛡️
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-red-600">
                  Cross-Cutting Governance
                </div>
                <h3 className="text-lg font-bold text-hdfc-navy">
                  HITL — Human-in-the-Loop Controls
                </h3>
                <p className="text-[13px] text-hdfc-slate mt-1">
                  Every stage has mandatory human approvers — Sales Head, Credit Committee, Legal Head, Compliance Officer, and more.
                  AI outputs are confidence-scored and auto-escalated when below threshold.
                </p>
              </div>
              <div className="hidden md:flex flex-col gap-1 text-[11px]">
                <span className="font-mono bg-white/80 text-red-700 px-2 py-0.5 rounded">🔒 Approval Gates</span>
                <span className="font-mono bg-white/80 text-red-700 px-2 py-0.5 rounded">📊 Confidence Scoring</span>
                <span className="font-mono bg-white/80 text-red-700 px-2 py-0.5 rounded">📋 Audit Trail</span>
              </div>
            </div>
          </div>
        </section>

        {/* Data Backbone */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-hdfc-navy">Data Backbone</h2>
            <p className="text-[13px] text-hdfc-slate mt-1">
              {stages.reduce((a, s) => a + s.dataSources.length, 0)} interlinked data files with referential integrity across all 9 stages.
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {stages.map((s) => (
              <div key={s.slug} className="bg-white border border-hdfc-line rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span>{s.icon}</span>
                  <span className="text-[10px] font-semibold text-hdfc-navy">S{s.number}</span>
                </div>
                <div className="text-[9px] font-mono text-hdfc-slate">{s.dataSources.length} files &middot; {s.dataSources.reduce((a, d) => a + d.rowEstimate, 0)} rows</div>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <p className="text-[11px] text-hdfc-slate/70 text-center leading-relaxed">
            All agents use synthetic data for demonstration purposes. In production, these agents would connect to live HDFC systems
            (LOS, CIBIL, RERA, NPA watchlist, etc.) via secure APIs. AI-generated outputs require human review before operational use.
          </p>
        </div>
      </div>

      <footer className="border-t border-hdfc-line bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-hdfc-slate text-center">
          HDFC Retail Assets — Agentic AI Operating System &middot; Synthetic Data Only &middot; Not for Production Use
        </div>
      </footer>
    </>
  );
}

function Stat({ n, label, mono }: { n: string; label: string; mono?: boolean }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur">
      <div className={`text-2xl md:text-3xl font-bold text-hdfc-red ${mono ? 'font-mono text-xl md:text-2xl' : ''}`}>
        {n}
      </div>
      <div className="text-[11px] uppercase tracking-wider text-white/60 mt-1">{label}</div>
    </div>
  );
}

function AgentCard({ stage }: { stage: (typeof stages)[number] }) {
  const totalRows = stage.dataSources.reduce((a, ds) => a + ds.rowEstimate, 0);

  return (
    <Link
      href={`/agentic-ai/${stage.slug}`}
      className="group relative flex flex-col bg-white rounded-xl border border-hdfc-line shadow-card hover:border-hdfc-red/40 hover:shadow-md transition overflow-hidden"
    >
      {/* Agent avatar banner */}
      <div className="relative h-28 overflow-hidden" style={{ backgroundColor: stage.colorLight }}>
        <Image
          src={stage.agentAvatar}
          alt={stage.agent.name}
          width={400}
          height={200}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
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
            <span className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm bg-hdfc-red text-white">
              AI Agent
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
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-sm"
            style={{ backgroundColor: stage.colorLight }}
          >
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
            <span
              key={t.name}
              className="text-[9px] font-mono bg-hdfc-mist text-hdfc-slate px-1.5 py-0.5 rounded"
            >
              {t.icon} {t.name}
            </span>
          ))}
        </div>

        <div className="mt-3 pt-2.5 border-t border-hdfc-line flex items-center justify-between text-[10px]">
          <div className="text-hdfc-slate">
            <span className="font-semibold">{stage.agent.shortId}</span> &middot; {stage.dataSources.length} data sources &middot; {totalRows} rows
          </div>
          <span className="text-hdfc-redDeep font-semibold group-hover:translate-x-0.5 transition">
            Open &rarr;
          </span>
        </div>
      </div>
    </Link>
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
