import Link from 'next/link';
import Header from '@/components/Header';
import { USE_CASES, USE_CASE_CATEGORIES } from '@/data/use-cases';

export default function Dashboard() {
  const totalUseCases = USE_CASES.length;
  const handsOnCount = USE_CASES.filter(u => u.coverageLevel === 'hands-on').length;
  const demoCount = USE_CASES.filter(u => u.coverageLevel === 'demo').length;

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-hdfc-blueDeep via-hdfc-blue to-hdfc-slate text-white">
          <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[11px] font-mono mb-5">
                <span className="w-1.5 h-1.5 bg-hdfc-red rounded-full animate-pulse" />
                HDFC Retail Assets &middot; GenAI Leadership Playground
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                GenAI for Mortgage
                <br />
                <span className="text-hdfc-red">Business Leaders.</span>
              </h1>
              <p className="mt-4 text-white/75 max-w-2xl text-[15px] leading-relaxed">
                Hands-on GenAI playground for n-1, n-2 leaders across Sales, Product, Portfolio &amp; Service.
                {totalUseCases} use cases, prompt engineering lab, document intelligence, and AI-powered sales tools &mdash;
                all with synthetic data within bank policy guardrails.
              </p>
              <p className="mt-2 text-hdfc-red font-semibold italic text-[15px]">
                &ldquo;80% hands-on. Functional, not technical. Use case language.&rdquo;
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/prompt-lab" className="bg-hdfc-red text-white font-semibold px-5 py-2.5 rounded-md hover:bg-hdfc-redDeep transition">
                  Start Prompt Lab
                </Link>
                <Link href="/use-cases" className="border border-white/30 text-white px-5 py-2.5 rounded-md hover:bg-white/10 transition">
                  Browse {totalUseCases} Use Cases
                </Link>
                <Link href="/sales-ai" className="border border-emerald-400 text-emerald-300 px-5 py-2.5 rounded-md hover:bg-emerald-500/20 transition">
                  Sales &amp; Growth AI
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat n={String(totalUseCases)} label="Use Cases" />
              <Stat n={String(handsOnCount)} label="Hands-on" />
              <Stat n={String(demoCount)} label="Demo + Discussion" />
              <Stat n="4" label="Audience Groups" />
              <Stat n="3" label="Lab Experiments" />
              <Stat n="10" label="Prompt Ladders" />
            </div>
          </div>
        </section>

        {/* Playground Modes */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-6">
            <div className="text-[11px] font-mono uppercase tracking-wider text-hdfc-red">Interactive Playground</div>
            <h2 className="text-2xl md:text-3xl font-bold text-hdfc-blue mt-1">5 Experience Modes</h2>
            <p className="text-hdfc-slate mt-2 max-w-3xl text-[14px] leading-relaxed">
              Each mode is designed for hands-on learning. Pick a prompt, run it live, see the output, tweak, and repeat.
              All powered by Gen-AI with synthetic data only.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              {
                href: '/prompt-lab',
                icon: '💬',
                title: 'Prompt Engineering Lab',
                description: 'The STAR session — master prompt engineering with 4-level experiments. See how answer quality improves as prompt complexity increases.',
                color: '#7C3AED',
                badge: 'STAR'
              },
              {
                href: '/doc-intelligence',
                icon: '📄',
                title: 'Document Intelligence',
                description: 'Process mortgage documents using plain English — sanction letters, ITRs, property docs. Ask questions, get instant reports.',
                color: '#0066B3',
                badge: 'EXTENDED'
              },
              {
                href: '/sales-ai',
                icon: '📈',
                title: 'Sales & Growth AI',
                description: 'Sales forecasting, upselling strategies, cross-sell playbooks, objection handling — AI as your growth co-pilot.',
                color: '#059669',
                badge: 'MORE TIME'
              },
              {
                href: '/use-cases',
                icon: '🎯',
                title: 'Use Case Library',
                description: `Browse all ${totalUseCases} use cases organized by category, audience, and day. Each with a ready-to-run prompt.`,
                color: '#D97706',
                badge: `${totalUseCases} CASES`
              },
              {
                href: '/field-sales-ai',
                icon: '🚀',
                title: 'Field Sales AI',
                description: 'Outward-looking sales enablement — prospect research, competitive positioning, objection handling, pitch personalization & deal closing.',
                color: '#2563EB',
                badge: 'NEW'
              }
            ].map(card => (
              <Link
                key={card.href}
                href={card.href}
                className="group bg-white rounded-xl border border-hdfc-line p-6 hover:shadow-lg transition relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: card.color }} />
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{card.icon}</div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border" style={{ color: card.color, borderColor: card.color + '40', backgroundColor: card.color + '10' }}>
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-bold text-hdfc-blue text-[15px] group-hover:text-hdfc-red transition">{card.title}</h3>
                <p className="text-[12px] text-hdfc-slate mt-2 leading-relaxed">{card.description}</p>
                <div className="mt-4 text-[11px] font-semibold text-hdfc-red">
                  Launch &rarr;
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Use Case Categories Overview */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-6">
            <div className="text-[11px] font-mono uppercase tracking-wider text-hdfc-red">Mortgage Business Use Cases</div>
            <h2 className="text-2xl md:text-3xl font-bold text-hdfc-blue mt-1">6 Use Case Domains</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {USE_CASE_CATEGORIES.map(cat => {
              const count = USE_CASES.filter(u => u.category === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  href={`/use-cases?category=${cat.id}`}
                  className="group bg-white rounded-xl border border-hdfc-line p-5 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: cat.color + '15' }}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-hdfc-blue group-hover:text-hdfc-red transition">{cat.label}</h3>
                      <span className="text-[11px] text-hdfc-slate">{count} use cases</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {USE_CASES.filter(u => u.category === cat.id).slice(0, 3).map(u => (
                      <span key={u.id} className="text-[10px] bg-hdfc-mist text-hdfc-slate px-2 py-0.5 rounded-full">{u.title}</span>
                    ))}
                    {count > 3 && (
                      <span className="text-[10px] text-hdfc-blue font-semibold px-2 py-0.5">+{count - 3} more</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Disclaimer Banner */}
        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 text-xl shrink-0 mt-0.5">⚠️</span>
              <div>
                <h3 className="text-[14px] font-bold text-amber-900">Mandatory Data Policy — All Sessions</h3>
                <p className="text-[12px] text-amber-800 mt-1 leading-relaxed">
                  <strong>Synthetic data only.</strong> This is a concept demo using AI-generated synthetic data.
                  Do NOT use actual bank customer data on any external AI platform.
                  Take due approval from compliance and IT before implementing any GenAI solution.
                  Wait for bank policy clearance before production use.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-amber-700 font-semibold">
                  <span>80% Hands-on</span>
                  <span>&middot;</span>
                  <span>Personal Laptops Only</span>
                  <span>&middot;</span>
                  <span>Non-Technical Delivery</span>
                  <span>&middot;</span>
                  <span>Policy First</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Structure */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-hdfc-blue">2-Day Program Structure</h2>
            <p className="text-[13px] text-hdfc-slate mt-1">
              8 hours/day | Audience: n-1, n-2 Leaders — Sales, Product, Portfolio, Service
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <DayCard
              day={1}
              theme="GenAI Fundamentals + Retail Asset Lifecycle"
              focus="Awareness, Automation, Prompt Engineering"
              sessions={[
                { time: '9:00-10:30', title: 'AI & GenAI Fundamentals for Business Leaders' },
                { time: '10:45-12:30', title: 'Prompt Engineering + Automation — STAR SESSION' },
                { time: '1:30-3:00', title: 'GenAI in Retail Asset Lifecycle' },
                { time: '3:15-4:45', title: 'Document Processing — Extended Session' },
                { time: '4:45-5:30', title: 'Customer Engagement & Personalization' },
                { time: '5:30-6:00', title: 'Day 1 Debrief + Case Studies' },
              ]}
            />
            <DayCard
              day={2}
              theme="Advanced Use Cases + Capstone"
              focus="Upselling, Cross-sell, Service, Roadmaps"
              sessions={[
                { time: '9:00-10:45', title: 'AI for Operational Efficiency' },
                { time: '11:00-12:00', title: 'Fraud Detection & Compliance — Awareness Only' },
                { time: '12:00-1:30', title: 'Sales Forecasting & Upselling — Extended' },
                { time: '2:30-3:30', title: 'Service Branch Use Cases' },
                { time: '3:45-4:45', title: 'Creating AI Roadmap for Teams' },
                { time: '4:45-6:00', title: 'Capstone Group Activity + Presentation' },
              ]}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-hdfc-line bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 text-xs text-hdfc-slate flex flex-wrap items-center justify-between gap-2">
          <span>
            HDFC Retail Assets GenAI Playground &middot; Designed &amp; Developed by Harsha Rao | Director - AI Strategy &amp; Consulting | Regenesys School of AI
          </span>
          <span className="font-mono text-[10px]">
            {totalUseCases} Use Cases &middot; 6 Domains &middot; 4 Modes &middot; Gen-AI
          </span>
        </div>
      </footer>
    </>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur">
      <div className="text-2xl md:text-3xl font-bold text-hdfc-red">{n}</div>
      <div className="text-[11px] uppercase tracking-wider text-white/60 mt-1">{label}</div>
    </div>
  );
}

function DayCard({ day, theme, focus, sessions }: {
  day: number;
  theme: string;
  focus: string;
  sessions: { time: string; title: string }[];
}) {
  return (
    <div className="bg-white rounded-xl border border-hdfc-line overflow-hidden">
      <div className={`px-5 py-4 ${day === 1 ? 'bg-hdfc-blue' : 'bg-hdfc-slate'} text-white`}>
        <div className="text-[10px] font-mono uppercase tracking-wider text-white/60">Day {day}</div>
        <h3 className="text-[15px] font-bold mt-1">{theme}</h3>
        <p className="text-[11px] text-white/70 mt-0.5">{focus}</p>
      </div>
      <div className="divide-y divide-hdfc-line">
        {sessions.map((s, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3">
            <span className="text-[11px] font-mono text-hdfc-slate whitespace-nowrap mt-0.5">{s.time}</span>
            <span className={`text-[13px] ${s.title.includes('STAR') || s.title.includes('Extended') ? 'font-bold text-hdfc-red' : 'text-hdfc-blue font-medium'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
