'use client';

import { useState } from 'react';
import { INDUSTRY_NEWS_ITEMS } from '@/data/field-sales-advanced';

export default function IndustryNewsPulse() {
  const [expanded, setExpanded] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  const sectors = Array.from(new Set(INDUSTRY_NEWS_ITEMS.map(n => n.sector)));
  const filtered = filter ? INDUSTRY_NEWS_ITEMS.filter(n => n.sector === filter) : INDUSTRY_NEWS_ITEMS;

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
          <span className="text-[13px] font-bold text-gray-800">Industry News Pulse</span>
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Live</span>
          <span className="text-[10px] text-gray-400">Synthetic intel for sales conversations</span>
        </div>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-gray-200">
          {/* Sector Filters */}
          <div className="px-5 py-2 bg-gray-50 flex flex-wrap gap-1.5 border-b border-gray-100">
            <button
              onClick={() => setFilter(null)}
              className={`px-2.5 py-1 rounded-md text-[9px] font-bold transition ${!filter ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}
            >
              All Sectors
            </button>
            {sectors.map(s => (
              <button
                key={s}
                onClick={() => setFilter(filter === s ? null : s)}
                className={`px-2.5 py-1 rounded-md text-[9px] font-bold transition ${filter === s ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* News Items */}
          <div className="divide-y divide-gray-100 max-h-[320px] overflow-y-auto">
            {filtered.map((item, i) => (
              <div key={i} className="px-5 py-3 hover:bg-blue-50/30 transition group">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.sentiment === 'positive' ? 'bg-green-500' : item.sentiment === 'mixed' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">{item.sector}</span>
                      <span className="text-[9px] text-gray-400">{item.timestamp}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-gray-900 leading-snug">{item.headline}</p>
                    <div className="mt-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-md px-2.5 py-1.5">
                      <p className="text-[10px] text-blue-800 leading-snug">
                        <span className="font-bold text-blue-600">Sales Angle:</span> {item.implication}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[9px] text-gray-400">Synthetic industry intelligence for training purposes only</p>
            <p className="text-[9px] text-gray-400">Use these as conversation starters with prospects</p>
          </div>
        </div>
      )}
    </div>
  );
}
