import Link from 'next/link';
import Image from 'next/image';
import { stages } from '@/data/hdfc-agents-config';

export const metadata = {
  title: 'Agentic AI — Standalone Mode | HDFC Retail Assets',
  description: '9 AI Agents spanning the complete mortgage lifecycle — all unlocked for individual exploration.',
};

export default function AgenticAIHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🤖</span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Standalone Mode — All Agents Unlocked
            </span>
          </div>
          <h1 className="text-3xl font-black mb-3">HDFC Agentic AI</h1>
          <p className="text-blue-100 text-[15px] max-w-2xl leading-relaxed mb-6">
            9 autonomous AI agents spanning the complete HDFC retail mortgage lifecycle — from market intelligence
            to customer service excellence. Each agent uses dedicated tools backed by real operational data.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <div className="text-2xl font-black">9</div>
              <div className="text-blue-200 text-[11px]">AI Agents</div>
            </div>
            <div>
              <div className="text-2xl font-black">27</div>
              <div className="text-blue-200 text-[11px]">Autonomous Tools</div>
            </div>
            <div>
              <div className="text-2xl font-black">30+</div>
              <div className="text-blue-200 text-[11px]">Data Sources</div>
            </div>
            <div>
              <div className="text-2xl font-black">100%</div>
              <div className="text-blue-200 text-[11px]">HITL Governed</div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/agentic-ai/workflow" className="px-5 py-2.5 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition text-sm">
              Switch to Sequential Mode →
            </Link>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((stage) => (
            <Link
              key={stage.slug}
              href={`/agentic-ai/${stage.slug}`}
              className="group block rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="h-2" style={{ background: stage.color }} />
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Image
                    src={stage.agentAvatar}
                    alt={stage.agent.name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-slate-200 group-hover:border-blue-300 transition shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{stage.icon}</span>
                      <span className="text-[10px] font-bold text-slate-400">STAGE {stage.number}</span>
                    </div>
                    <h3 className="text-[15px] font-bold text-slate-800 group-hover:text-blue-700 transition">
                      {stage.title}
                    </h3>
                  </div>
                </div>

                <p className="text-[12px] text-slate-500 leading-relaxed mb-4">
                  {stage.agent.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {stage.tools.map((tool) => (
                    <span key={tool.name} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {tool.icon} {tool.label}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span>{stage.tools.length} tools</span>
                    <span>{stage.dataSources.length} data sources</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    OPEN
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 text-center">
          <p className="text-[11px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
            All agents use synthetic data for demonstration purposes. In production, these agents would connect to live HDFC systems
            (LOS, CIBIL, RERA, NPA watchlist, etc.) via secure APIs. AI-generated outputs require human review before operational use.
          </p>
        </div>
      </div>
    </div>
  );
}
