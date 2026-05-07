import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { stages, getStageBySlug } from '@/data/hdfc-agents-config';
import HdfcStagePageClient from '@/components/HdfcStagePageClient';

export function generateStaticParams() {
  return stages.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const stage = getStageBySlug(params.slug);
  if (!stage) return { title: 'Stage Not Found' };
  return {
    title: `Stage ${stage.number}: ${stage.title} — HDFC Workflow`,
    description: `${stage.agent.name} — ${stage.subtitle}. Sequential workflow with HITL governance.`,
  };
}

export default function WorkflowStagePage({ params }: { params: { slug: string } }) {
  const stage = getStageBySlug(params.slug);

  if (!stage) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-hdfc-navy mb-2">Stage Not Found</h2>
            <p className="text-[14px] text-hdfc-slate mb-4">No workflow stage found with slug &ldquo;{params.slug}&rdquo;</p>
            <Link href="/agentic-ai/workflow" className="text-hdfc-blue hover:underline text-sm">&larr; Back to Workflow Dashboard</Link>
          </div>
        </div>
      </>
    );
  }

  const totalRows = stage.dataSources.reduce((a, ds) => a + ds.rowEstimate, 0);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-hdfc-mist">
        {/* Hero banner with agent avatar */}
        <div className="relative h-48 md:h-56 overflow-hidden" style={{ backgroundColor: stage.color }}>
          <Image
            src={stage.agentAvatar}
            alt={stage.agent.name}
            width={1200}
            height={400}
            className="w-full h-full object-cover object-top opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-hdfc-navy/90 via-hdfc-blueDeep/80 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full flex items-center gap-6">
              {/* Agent face circle */}
              <div className="hidden md:block shrink-0">
                <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-hdfc-red shadow-xl">
                  <Image
                    src={stage.agentAvatar}
                    alt={stage.agent.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono text-hdfc-red tracking-wider">
                    STAGE {stage.number} OF 9
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-hdfc-red text-white">
                    AI Agent
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/90 text-white">
                    SEQUENTIAL
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${stage.mandatory ? 'bg-red-500/90 text-white' : 'bg-white/20 text-white backdrop-blur-sm border border-white/30'}`}>
                    {stage.mandatory ? 'REQUIRED' : 'OPTIONAL'}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{stage.title}</h1>
                <p className="text-white/70 text-[14px] max-w-2xl">
                  {stage.subtitle} — Powered by <strong className="text-white">{stage.agent.name}</strong> &middot; Approver: {stage.hitlApprover}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="text-[11px] text-white/60 font-mono bg-white/10 px-2.5 py-1 rounded">
                    {stage.agent.shortId}
                  </span>
                  <span className="text-[11px] text-white/60 font-mono bg-white/10 px-2.5 py-1 rounded">
                    {stage.tools.length} Tools
                  </span>
                  <span className="text-[11px] text-white/60 font-mono bg-white/10 px-2.5 py-1 rounded">
                    {stage.dataSources.length} Data Sources &middot; {totalRows.toLocaleString()} Rows
                  </span>
                  <span className="text-[11px] text-white/60 font-mono bg-white/10 px-2.5 py-1 rounded">
                    HITL: {stage.hitlApprover}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage navigation breadcrumb */}
        <div className="bg-white border-b border-hdfc-line">
          <div className="max-w-7xl mx-auto px-6 py-2 flex flex-wrap items-center gap-4 text-[12px]">
            {stage.upstreamStages.map((s) => {
              const up = getStageBySlug(s);
              return up ? (
                <Link key={s} href={`/agentic-ai/workflow/${s}`} className="flex items-center gap-1 text-hdfc-slate hover:text-hdfc-redDeep transition">
                  <span>&larr;</span>
                  <span>{up.icon} Stage {up.number}: {up.title}</span>
                </Link>
              ) : null;
            })}
            <span className="text-hdfc-navy font-semibold">{stage.icon} Stage {stage.number}: {stage.title}</span>
            {stage.downstreamStages.map((s) => {
              const down = getStageBySlug(s);
              return down ? (
                <Link key={s} href={`/agentic-ai/workflow/${s}`} className="flex items-center gap-1 text-hdfc-slate hover:text-hdfc-redDeep transition">
                  <span>{down.icon} Stage {down.number}: {down.title}</span>
                  <span>&rarr;</span>
                </Link>
              ) : null;
            })}
            <div className="flex-1" />
            <Link href="/agentic-ai/workflow" className="text-hdfc-slate hover:text-hdfc-redDeep transition font-medium">
              Dashboard &rarr;
            </Link>
          </div>
        </div>

        {/* Stage Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <HdfcStagePageClient stage={stage} />
        </div>
      </div>
    </>
  );
}
