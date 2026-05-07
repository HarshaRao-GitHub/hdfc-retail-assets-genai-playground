'use client';

import { use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ProcessAutomationEngine from '@/components/ProcessAutomationEngine';
import { getProcessById } from '@/data/process-automation-config';

export default function ProcessAppPage({ params }: { params: { appId: string } | Promise<{ appId: string }> }) {
  const resolved = params instanceof Promise ? use(params) : params;
  const { appId } = resolved;
  const process = getProcessById(appId);

  if (!process) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Process Not Found</h1>
            <p className="text-gray-500 mb-6 text-sm">The process automation app &ldquo;{appId}&rdquo; does not exist.</p>
            <Link
              href="/field-sales-ai/process-automation"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back to Process Automation Hub
            </Link>
          </div>
        </div>
      </>
    );
  }

  return <ProcessAutomationEngine process={process} />;
}
