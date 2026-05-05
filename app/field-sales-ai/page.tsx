'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import SalesDocumentsPanel from '@/components/SalesDocumentsPanel';
import { FIELD_SALES_USE_CASE_CATEGORIES } from '@/data/field-sales-use-cases';
import { BEFORE_DURING_AFTER_FRAMEWORK } from '@/data/field-sales-scenarios';
import { FIELD_SALES_DISCLAIMER } from '@/data/field-sales-prompts';

const SUB_MODULES = [
  {
    href: '/field-sales-ai/prompting',
    icon: '💬',
    title: 'Prompt Engineering Lab',
    subtitle: 'Simple → CRAFT prompt ladder for field sales scenarios',
    description: 'Master prompt engineering through real retail-asset selling scenarios. See how a vague question transforms into a deal-closing intelligence brief as you layer context, constraints, and structure.',
    gradient: 'from-blue-600 to-blue-500',
    borderColor: 'border-blue-300',
    tag: 'Hands-on',
  },
  {
    href: '/field-sales-ai/doc-intelligence',
    icon: '📄',
    title: 'Document Intelligence & Visualization',
    subtitle: 'Analyze prospect data, pipeline, competitor intel with AI',
    description: 'Upload prospect profiles, competitor cards, pipeline data, and industry reports. AI extracts actionable sales intelligence — pre-meeting briefs, battle cards, pipeline prioritization, and cross-sell maps.',
    gradient: 'from-purple-600 to-purple-500',
    borderColor: 'border-purple-300',
    tag: 'Interactive',
  },
  {
    href: '/field-sales-ai/sales-growth',
    icon: '🚀',
    title: 'Sales & Growth AI',
    subtitle: 'Prospect research, objection handling, deal closing',
    description: 'AI-powered sales acceleration tools. Research prospects in 5 minutes, generate multi-strategy objection responses, create personalized pitches, and build deal-closing strategies — all anchored to HDFC retail asset products.',
    gradient: 'from-emerald-600 to-emerald-500',
    borderColor: 'border-emerald-300',
    tag: 'AI-Powered',
  },
  {
    href: '/field-sales-ai/use-cases',
    icon: '🎯',
    title: 'Use Case Library',
    subtitle: '24+ field sales use cases across 8 categories',
    description: 'Complete library of AI-powered use cases for field sales — from pre-meeting research to post-meeting follow-up. Each use case has a ready-to-use prompt, anchor scenario, and product context.',
    gradient: 'from-amber-600 to-amber-500',
    borderColor: 'border-amber-300',
    tag: 'Library',
  },
];

export default function FieldSalesAIPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_60%)]" />
          <div className="max-w-7xl mx-auto px-6 py-10 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white/90">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                Field Sales AI Enablement
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 font-bold">OUTWARD-LOOKING</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Field Sales AI — Retail Asset Sales Enablement
            </h1>
            <p className="mt-3 text-white/70 max-w-3xl text-[15px] leading-relaxed">
              Make yourself a more enhanced sales professional using AI. Research prospects, understand industries,
              anticipate objections, personalize pitches, and close more deals — all powered by GenAI for HDFC
              Retail Asset product lines.
            </p>

            {/* Anchor Scenario Banner */}
            <div className="mt-6 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center text-xl shrink-0">🏢</div>
                <div>
                  <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-1">Anchor Scenario</p>
                  <p className="text-white/90 text-[14px] leading-relaxed italic">
                    &ldquo;I&rsquo;m sitting in the client&rsquo;s reception lobby, hoping to onboard them today — what services
                    should I talk about, what should I understand about this industry, how do I make myself a more
                    enhanced sales person right now?&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Product Lines */}
            <div className="mt-6 flex flex-wrap gap-2">
              {['Personal Loans', 'Business Loans', 'Auto Loans', 'Tractor Finance', 'CV Loans', 'Home Loans', 'LAP', 'Credit Cards', 'Merchant Acquiring', 'Payment Gateway'].map(p => (
                <span key={p} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/15">{p}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimers */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[11px] text-red-800 leading-relaxed">
            <span className="font-bold">⚠️ Mandatory Disclaimers:</span> {FIELD_SALES_DISCLAIMER}
          </div>
        </div>

        {/* Sub-Modules Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Explore Modules</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {SUB_MODULES.map(mod => (
              <Link
                key={mod.href}
                href={mod.href}
                className={`group relative bg-white border ${mod.borderColor} rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-0.5`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 bg-gradient-to-br ${mod.gradient} rounded-lg flex items-center justify-center text-xl shadow-md`}>
                    {mod.icon}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-700 transition">{mod.title}</h3>
                    <p className="text-[11px] text-gray-500">{mod.subtitle}</p>
                  </div>
                  <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{mod.tag}</span>
                </div>
                <p className="text-[12px] text-gray-600 leading-relaxed">{mod.description}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
                  Open Module
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Before / During / After Framework */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{BEFORE_DURING_AFTER_FRAMEWORK.title}</h2>
            <p className="text-[12px] text-gray-500 mb-5">How GenAI makes you a better sales professional at every stage of the customer interaction</p>
            <div className="grid md:grid-cols-3 gap-4">
              {BEFORE_DURING_AFTER_FRAMEWORK.phases.map(phase => (
                <div key={phase.phase} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{phase.icon}</span>
                    <h3 className="text-[13px] font-bold" style={{ color: phase.color }}>{phase.phase}</h3>
                  </div>
                  <ul className="space-y-2">
                    {phase.capabilities.map(cap => (
                      <li key={cap.title} className="text-[11px]">
                        <span className="font-semibold text-gray-800">{cap.title}:</span>{' '}
                        <span className="text-gray-500">{cap.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Use Case Categories Overview */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sales Use Case Categories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FIELD_SALES_USE_CASE_CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={`/field-sales-ai/use-cases?category=${cat.id}`}
                className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-[12px] font-bold text-gray-800 group-hover:text-blue-700 transition">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sales Reference Documents */}
        <div className="max-w-7xl mx-auto px-6 pb-6">
          <SalesDocumentsPanel />
        </div>

        {/* Strategic Objectives */}
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-emerald-900 mb-3">Session Learning Outcomes</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <div className="text-xl mb-2">🎯</div>
                <h4 className="text-[12px] font-bold text-gray-900 mb-1">Articulate 3+ Ways</h4>
                <p className="text-[11px] text-gray-600">GenAI can sharpen your sales motion before, during, and after a customer meeting.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <div className="text-xl mb-2">✍️</div>
                <h4 className="text-[12px] font-bold text-gray-900 mb-1">Write Effective Prompts</h4>
                <p className="text-[11px] text-gray-600">Independently write prompts for prospect research, industry research, and objection handling using free public GenAI tools.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <div className="text-xl mb-2">🤝</div>
                <h4 className="text-[12px] font-bold text-gray-900 mb-1">Identify One Live Deal</h4>
                <p className="text-[11px] text-gray-600">Identify at least one retail-asset deal in your pipeline where you will apply a technique from this session within 2 weeks.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Field Sales AI Enablement &middot; Synthetic Data Only &middot; Not for Production Use
        </div>
      </footer>
    </>
  );
}
