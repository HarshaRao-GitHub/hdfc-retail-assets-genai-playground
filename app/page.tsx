import Link from 'next/link';

export default function ClientSelector() {
  const thermaxUrl = process.env.NEXT_PUBLIC_THERMAX_URL || 'http://localhost:3001';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-[11px] font-mono text-white/70 mb-6 tracking-wide">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              GenAI Leadership Enablement Platform &middot; Powered by Claude AI
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Enterprise GenAI
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Playground Hub
              </span>
            </h1>
            <p className="mt-5 text-white/60 max-w-2xl mx-auto text-[15px] leading-relaxed">
              Select your client workspace to access the AI-powered playground. Each workspace is
              purpose-built with industry-specific use cases, prompt engineering labs, and hands-on
              GenAI tools for leadership teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Thermax Card */}
            <a
              href={thermaxUrl}
              className="group relative bg-gradient-to-br from-[#0A2540] to-[#1F3A5F] rounded-2xl p-8 border border-white/10 hover:border-[#FF7A1A]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,122,26,0.15)] hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-[#FF7A1A] to-[#E5630A]" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-[#FF7A1A] flex items-center justify-center text-2xl font-extrabold text-[#0A2540] shadow-lg group-hover:scale-110 transition-transform">
                  T
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-[#FF7A1A] transition">Thermax</h2>
                  <p className="text-[11px] text-white/50 font-mono">Agentic AI Operating System 2030</p>
                </div>
              </div>
              <p className="text-[13px] text-white/70 leading-relaxed mb-6">
                9-stage enterprise AI system for energy &amp; environment solutions — Market Intelligence to O&amp;M Services with AgentGuard governance, 10 agents, and 4 experience modes.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Prompting', 'Doc Intelligence', 'Agentic AI', 'AI Nexus'].map(tag => (
                  <span key={tag} className="text-[10px] font-semibold text-[#FF7A1A] bg-[#FF7A1A]/10 px-2.5 py-1 rounded-full border border-[#FF7A1A]/20">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#FF7A1A] group-hover:gap-3 transition-all">
                Launch Thermax Playground
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </a>

            {/* HDFC Card */}
            <Link
              href="/dashboard"
              className="group relative bg-gradient-to-br from-[#002D5A] to-[#004B87] rounded-2xl p-8 border border-white/10 hover:border-[#ED1C24]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(237,28,36,0.15)] hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-[#ED1C24] to-[#C41018]" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-[#ED1C24] flex items-center justify-center text-2xl font-extrabold text-white shadow-lg group-hover:scale-110 transition-transform">
                  H
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-[#ED1C24] transition">HDFC Retail Assets</h2>
                  <p className="text-[11px] text-white/50 font-mono">GenAI Leadership Playground</p>
                </div>
              </div>
              <p className="text-[13px] text-white/70 leading-relaxed mb-6">
                GenAI enablement for mortgage business leaders — Home Loans &amp; LAP. 35+ use cases across Sales, Product, Portfolio &amp; Service with hands-on prompt engineering.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Prompt Lab', 'Doc Intelligence', 'Sales AI', 'Use Cases'].map(tag => (
                  <span key={tag} className="text-[10px] font-semibold text-[#ED1C24] bg-[#ED1C24]/10 px-2.5 py-1 rounded-full border border-[#ED1C24]/20">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#ED1C24] group-hover:gap-3 transition-all">
                Launch HDFC Playground
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-6 text-[11px] text-white/40">
              <span>80% Hands-on</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Use Case Driven</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Synthetic Data Only</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Policy Compliant</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-white/30 flex flex-wrap items-center justify-between gap-2">
          <span>
            Enterprise GenAI Playground &middot; Designed &amp; Developed by Harsha Rao | Director - AI Strategy &amp; Consulting | Regenesys School of AI
          </span>
          <span className="font-mono">
            Powered by Claude AI &middot; Anthropic
          </span>
        </div>
      </footer>
    </div>
  );
}
