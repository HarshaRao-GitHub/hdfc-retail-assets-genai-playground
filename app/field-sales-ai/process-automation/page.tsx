'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { PROCESS_APPS } from '@/data/process-automation-config';

export default function ProcessAutomationHub() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-6 py-10 relative">
            <Link href="/field-sales-ai" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-[11px] font-medium mb-4 transition group">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back to Retail Assets AI
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white/90">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                Process Automation
              </div>
              <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black tracking-wider">NEW</span>
              <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-bold border border-white/20">{PROCESS_APPS.length} AI APPS</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Process Automation — AI Apps
            </h1>
            <p className="mt-3 text-white/65 max-w-3xl text-[15px] leading-relaxed">
              One-click end-to-end inter-departmental process automation powered by GenAI. Each app auto-loads relevant
              documents, runs a multi-stage AI pipeline across departments, and produces board-ready outputs — no manual
              work, no document uploads.
            </p>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur border border-white/15 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-black text-white">{PROCESS_APPS.length}</div>
                <div className="text-[10px] text-white/60 font-medium">E2E Apps</div>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/15 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-black text-white">
                  {PROCESS_APPS.reduce((sum, p) => sum + p.stages.length, 0)}
                </div>
                <div className="text-[10px] text-white/60 font-medium">Pipeline Stages</div>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/15 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-black text-white">
                  {new Set(PROCESS_APPS.flatMap(p => p.departments.map(d => d.label))).size}
                </div>
                <div className="text-[10px] text-white/60 font-medium">Departments</div>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/15 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-black text-white">
                  {new Set(PROCESS_APPS.flatMap(p => p.documents.map(d => d.filename))).size}
                </div>
                <div className="text-[10px] text-white/60 font-medium">Data Sources</div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-[11px] text-amber-800">
            <span className="font-bold">&#9888;&#65039; Synthetic Data Only:</span> All process automation apps use synthetic data for demonstration. Do not enter real customer data. AI outputs are subject to bank policy approval.
          </div>
        </div>

        {/* App Cards Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Select a Process to Automate</h2>
          <p className="text-[12px] text-gray-500 mb-6">Each app runs a complete inter-departmental pipeline with one click. Documents are auto-loaded — just select and run.</p>

          <div className="grid md:grid-cols-2 gap-5">
            {PROCESS_APPS.map((app, idx) => (
              <Link
                key={app.id}
                href={`/field-sales-ai/process-automation/${app.id}`}
                className={`group relative bg-white border ${app.borderColor} rounded-xl p-5 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden`}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />

                <div className="relative">
                  {/* Top Row: Icon + Title + Badges */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${app.gradient} rounded-xl flex items-center justify-center text-2xl shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                      {app.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">#{idx + 1}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{app.stages.length} STAGES</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{app.documents.length} DOCS</span>
                      </div>
                      <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-indigo-700 transition leading-tight">{app.title}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-3 line-clamp-2">{app.description}</p>

                  {/* Department Flow */}
                  <div className="flex flex-wrap items-center gap-1 mb-3">
                    {app.departments.map((dept, i) => (
                      <span key={dept.id} className="flex items-center gap-0.5">
                        <span
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold"
                          style={{ backgroundColor: dept.color + '15', color: dept.color }}
                        >
                          {dept.icon} {dept.label}
                        </span>
                        {i < app.departments.length - 1 && (
                          <svg className="w-2.5 h-2.5 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 group-hover:gap-2.5 transition-all">
                    Launch App
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-indigo-900 mb-4">How Process Automation Works</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: '1', icon: '📄', title: 'Auto-Load Documents', desc: 'Relevant data files are automatically associated based on the process. Select all or choose specific documents to include.' },
                { step: '2', icon: '▶️', title: 'One-Click Execute', desc: 'Click "Run" to trigger the complete multi-stage pipeline. AI processes each stage sequentially, passing context forward.' },
                { step: '3', icon: '🔄', title: 'Inter-Department Flow', desc: 'Each stage represents a different department\'s analysis. Watch as the pipeline flows from Sales to Credit to Legal to Compliance.' },
                { step: '4', icon: '📊', title: 'Board-Ready Output', desc: 'Get comprehensive reports with executive summaries, risk matrices, action trackers, and strategic recommendations.' },
              ].map(item => (
                <div key={item.step} className="bg-white rounded-lg p-4 border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">{item.step}</span>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <h4 className="text-[12px] font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Process Automation AI Apps &middot; Synthetic Data Only &middot; Not for Production Use
        </div>
      </footer>
    </>
  );
}
