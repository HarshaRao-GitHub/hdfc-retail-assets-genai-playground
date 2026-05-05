'use client';

import { useState } from 'react';
import { FIELD_SALES_DOC_CATEGORIES } from '@/data/field-sales-doc-config';

interface PreviewData {
  filename: string;
  text: string;
  headers?: string[];
  rows?: string[][];
}

export default function SalesDocumentsPanel() {
  const [expanded, setExpanded] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PreviewData | null>(null);

  async function viewFile(path: string, filename: string) {
    try {
      const res = await fetch(path);
      const text = await res.text();
      let headers: string[] | undefined;
      let rows: string[][] | undefined;
      if (filename.endsWith('.csv')) {
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length > 0) {
          headers = lines[0].split(',').map(h => h.trim());
          rows = lines.slice(1).map(l => l.split(',').map(c => c.trim()));
        }
      }
      setPreviewDoc({ filename, text, headers, rows });
    } catch (e) {
      console.error('Failed to preview:', e);
    }
  }

  const allFiles = FIELD_SALES_DOC_CATEGORIES.flatMap(cat =>
    cat.sampleFiles.map(f => ({ ...f, category: cat.label, icon: cat.icon }))
  );

  return (
    <>
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">📁</span>
            <span className="text-[12px] font-bold text-gray-800">Sales Reference Documents</span>
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">{allFiles.length} files</span>
          </div>
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {expanded && (
          <div className="border-t border-gray-200 px-4 py-3">
            <p className="text-[10px] text-gray-500 mb-3">View or download any pre-provided sales document. These are synthetic datasets for demonstration.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {allFiles.map(file => (
                <div key={file.filename} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:border-purple-300 transition">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm shrink-0">{file.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-gray-800 truncate">{file.label}</p>
                      <p className="text-[9px] text-gray-400 truncate">{file.filename}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => viewFile(file.path, file.filename)}
                      className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition"
                      title="View document"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <a
                      href={file.path}
                      download={file.filename}
                      className="p-1.5 rounded text-emerald-600 hover:bg-emerald-50 transition"
                      title="Download file"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">📄</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{previewDoc.filename}</h3>
                  <p className="text-[10px] text-gray-500">
                    {previewDoc.headers ? `${previewDoc.rows?.length ?? 0} rows × ${previewDoc.headers.length} columns` : `${previewDoc.text.length.toLocaleString()} characters`}
                  </p>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {previewDoc.headers && previewDoc.rows ? (
                <div className="overflow-x-auto">
                  <table className="text-[11px] w-full border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-purple-600 text-white">
                        <th className="px-3 py-2 text-left font-semibold border-r border-white/20 text-[10px]">#</th>
                        {previewDoc.headers.map((h, i) => (
                          <th key={i} className="px-3 py-2 text-left font-semibold whitespace-nowrap border-r border-white/20">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewDoc.rows.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 0 ? 'bg-white hover:bg-purple-50' : 'bg-slate-50 hover:bg-purple-50'}>
                          <td className="px-3 py-1.5 border-r border-b border-gray-200 text-gray-400 font-mono text-[9px]">{ri + 1}</td>
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-3 py-1.5 border-r border-b border-gray-200 whitespace-nowrap max-w-[200px] truncate" title={cell}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-5">
                  <pre className="text-[12px] font-mono text-gray-800 bg-slate-50 rounded-lg p-5 whitespace-pre-wrap leading-relaxed">{previewDoc.text}</pre>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-gray-200 bg-slate-50 rounded-b-xl flex items-center justify-between shrink-0">
              <span className="text-[10px] text-gray-400">Sample document · Synthetic data for demonstration</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { navigator.clipboard.writeText(previewDoc.text); }}
                  className="text-[11px] font-semibold text-gray-700 hover:text-blue-700 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-white transition"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([previewDoc.text], { type: previewDoc.filename.endsWith('.csv') ? 'text/csv' : 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = previewDoc.filename; a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 px-3 py-1.5 border border-emerald-300 rounded-md hover:bg-emerald-50 transition"
                >
                  ⬇ Download
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-[11px] font-semibold bg-purple-600 text-white px-4 py-1.5 rounded-md hover:bg-purple-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
