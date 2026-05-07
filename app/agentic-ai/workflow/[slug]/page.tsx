import Image from 'next/image';
import Link from 'next/link';
import { stages, getStageBySlug } from '@/data/hdfc-agents-config';
import HdfcStagePageClient from '@/components/HdfcStagePageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return stages.map((s) => ({ slug: s.slug }));
}

export default async function WorkflowStagePage({ params }: Props) {
  const { slug } = await params;
  const stage = getStageBySlug(slug);

  if (!stage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Stage Not Found</h2>
          <p className="text-[14px] text-slate-500 mb-4">No workflow stage found with slug &ldquo;{slug}&rdquo;</p>
          <Link href="/agentic-ai/workflow" className="text-blue-600 hover:underline text-sm">← Back to Workflow Dashboard</Link>
        </div>
      </div>
    );
  }

  const prevStage = stages.find(s => s.number === stage.number - 1);
  const nextStage = stages.find(s => s.number === stage.number + 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero banner */}
      <div className="text-white" style={{ background: `linear-gradient(135deg, ${stage.color}, ${stage.color}dd, #1e293b)` }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-[11px]">
            <Link href="/agentic-ai/workflow" className="text-white/70 hover:text-white transition">Workflow</Link>
            <span className="text-white/40">/</span>
            <span className="text-white/90">Stage {stage.number}: {stage.title}</span>
          </div>

          <div className="flex items-center gap-5">
            <Image src={stage.agentAvatar} alt={stage.agent.name} width={64} height={64} className="rounded-full border-3 border-white/30 shadow-lg" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{stage.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                  Stage {stage.number} · Sequential Mode
                </span>
                {stage.mandatory ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-red-400/20 px-2.5 py-0.5 rounded-full border border-red-300/30 text-red-200">
                    Mandatory
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-sky-400/20 px-2.5 py-0.5 rounded-full border border-sky-300/30 text-sky-200">
                    Optional
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black mb-1">{stage.title}</h1>
              <p className="text-white/70 text-[13px]">{stage.subtitle} · Approver: {stage.hitlApprover}</p>
            </div>
          </div>

          {/* Upstream/Downstream navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            {prevStage ? (
              <Link href={`/agentic-ai/workflow/${prevStage.slug}`} className="flex items-center gap-2 text-white/60 hover:text-white transition text-[12px]">
                <span>←</span>
                <span>Stage {prevStage.number}: {prevStage.title}</span>
              </Link>
            ) : (
              <Link href="/agentic-ai/workflow" className="flex items-center gap-2 text-white/60 hover:text-white transition text-[12px]">
                <span>←</span>
                <span>Dashboard</span>
              </Link>
            )}
            {nextStage ? (
              <Link href={`/agentic-ai/workflow/${nextStage.slug}`} className="flex items-center gap-2 text-white/60 hover:text-white transition text-[12px]">
                <span>Stage {nextStage.number}: {nextStage.title}</span>
                <span>→</span>
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <HdfcStagePageClient stage={stage} />
      </div>
    </div>
  );
}
