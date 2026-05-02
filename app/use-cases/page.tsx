'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { USE_CASES, USE_CASE_CATEGORIES } from '@/data/use-cases';

export default function UseCasesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeAudience, setActiveAudience] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCases = USE_CASES.filter(uc => {
    if (activeCategory && uc.category !== activeCategory) return false;
    if (activeAudience && !uc.audience.includes(activeAudience)) return false;
    if (activeDay && uc.dayNumber !== activeDay) return false;
    return true;
  });

  const audiences = ['Sales', 'Product', 'Portfolio', 'Service'];

  async function copyPrompt(id: string, prompt: string) {
    try { await navigator.clipboard.writeText(prompt); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); } catch {}
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-amber-700 to-amber-500 border-b">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
              <span className="w-2 h-2 bg-amber-200 rounded-full animate-pulse" />
              {USE_CASES.length} Use Cases &middot; 6 Categories
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Use Case Library</h1>
            <p className="mt-1.5 text-white/80 text-sm max-w-xl">Browse all {USE_CASES.length} mortgage business use cases. Filter by category, audience, or day. Each includes a ready-to-run prompt.</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-hdfc-line">
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">Category</span>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setActiveCategory(null)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${!activeCategory ? 'bg-hdfc-blue text-white border-hdfc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}>All</button>
                {USE_CASE_CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${activeCategory === cat.id ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`} style={activeCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}>
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">Audience</span>
              <div className="flex gap-1.5">
                <button onClick={() => setActiveAudience(null)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${!activeAudience ? 'bg-hdfc-blue text-white border-hdfc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}>All</button>
                {audiences.map(a => (
                  <button key={a} onClick={() => setActiveAudience(activeAudience === a ? null : a)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${activeAudience === a ? 'bg-hdfc-blue text-white border-hdfc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}>{a}</button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">Day</span>
              <div className="flex gap-1.5">
                <button onClick={() => setActiveDay(null)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${!activeDay ? 'bg-hdfc-blue text-white border-hdfc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}>Both</button>
                {[1, 2].map(d => (
                  <button key={d} onClick={() => setActiveDay(activeDay === d ? null : d)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${activeDay === d ? 'bg-hdfc-blue text-white border-hdfc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}>Day {d}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[12px] text-gray-500 mb-4">{filteredCases.length} use case{filteredCases.length !== 1 ? 's' : ''} found</div>

          {/* Use Case Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCases.map(uc => {
              const cat = USE_CASE_CATEGORIES.find(c => c.id === uc.category);
              const isCopied = copiedId === uc.id;
              return (
                <div key={uc.id} className="bg-white rounded-xl border border-hdfc-line overflow-hidden hover:shadow-lg transition group">
                  <div className="h-1" style={{ backgroundColor: cat?.color || '#004B87' }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{uc.icon}</span>
                        <div>
                          <h3 className="text-[14px] font-bold text-hdfc-blue group-hover:text-hdfc-red transition leading-tight">{uc.title}</h3>
                          <span className="text-[10px] text-gray-500">{cat?.label}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${uc.coverageLevel === 'hands-on' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : uc.coverageLevel === 'demo' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
                        {uc.coverageLevel}
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-600 leading-relaxed mb-3">{uc.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {uc.audience.map(a => (
                        <span key={a} className="text-[9px] font-semibold text-hdfc-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">{a}</span>
                      ))}
                      <span className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Day {uc.dayNumber}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase">Sample Prompt</span>
                        <button onClick={() => copyPrompt(uc.id, uc.samplePrompt)} className="text-[10px] font-semibold text-hdfc-blue hover:text-hdfc-red transition">
                          {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-700 leading-relaxed line-clamp-3">{uc.samplePrompt}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-gray-800">No use cases match your filters</h3>
              <p className="text-sm text-gray-500 mt-2">Try adjusting the category, audience, or day filter.</p>
            </div>
          )}
        </div>
      </div>
      <footer className="border-t border-hdfc-line bg-white"><div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-hdfc-slate text-center">HDFC Retail Assets GenAI Playground &middot; Use Case Library &middot; {USE_CASES.length} Use Cases</div></footer>
    </>
  );
}
