'use client';

import { useState, useRef, useCallback } from 'react';
import { useDocuments, type SharedDocument } from '@/lib/document-context';

export default function DocumentTray() {
  const {
    documents, removeDocument, clearAll,
    trayOpen, setTrayOpen,
    viewerDoc, setViewerDoc,
    addDocuments,
  } = useDocuments();

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      for (const file of Array.from(files)) {
        if (file.size > 100 * 1024 * 1024) {
          setUploadError(`${file.name} exceeds 100MB limit`);
          continue;
        }
        formData.append('files', file);
      }
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        setUploadError(err.error ?? 'Failed to process files');
      } else {
        const data = await res.json();
        if (data.files && Array.isArray(data.files)) {
          addDocuments(data.files.map((f: { filename: string; text?: string; images?: SharedDocument['images'] }) => ({
            filename: f.filename, text: f.text ?? '', images: f.images ?? [], source: 'upload' as const,
          })));
        }
        if (data.errors?.length) setUploadError(data.errors.join('; '));
      }
    } catch {
      setUploadError('Network error during upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [addDocuments]);

  const count = documents.length;

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setTrayOpen(!trayOpen)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl transition-all duration-300 ${
          count > 0
            ? 'bg-hdfc-blue hover:bg-hdfc-blueDeep text-white'
            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
        }`}
        title="Document Tray"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <span className="text-sm font-bold">Docs</span>
        {count > 0 && (
          <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
            count > 0 ? 'bg-white text-hdfc-blue' : ''
          }`}>
            {count}
          </span>
        )}
      </button>

      {/* Tray panel */}
      {trayOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setTrayOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-hdfc-blueDeep to-hdfc-blue shrink-0">
              <div>
                <h2 className="text-lg font-bold text-white">Document Tray</h2>
                <p className="text-[11px] text-white/70 mt-0.5">
                  {count} document{count !== 1 ? 's' : ''} loaded &middot; Available across all pages
                </p>
              </div>
              <button onClick={() => setTrayOpen(false)} className="text-white/70 hover:text-white text-xl font-bold px-2 transition">
                ✕
              </button>
            </div>

            {/* Upload area */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
              <label className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed cursor-pointer transition text-sm font-semibold ${
                uploading
                  ? 'border-hdfc-blue bg-blue-50 text-hdfc-blue cursor-wait'
                  : 'border-gray-300 hover:border-hdfc-blue text-gray-600 hover:text-hdfc-blue hover:bg-blue-50/50'
              }`}>
                {uploading ? (
                  <><span className="animate-spin">⏳</span> Processing...</>
                ) : (
                  <><span>📁</span> Upload Documents</>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".csv,.txt,.md,.tsv,.log,.json,.pdf,.doc,.docx,.xls,.xlsx,.xml,.png,.jpg,.jpeg,.gif,.webp,.bmp,.tiff"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {uploadError && <p className="text-xs text-red-600 mt-1.5 font-medium">{uploadError}</p>}
              <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                CSV, PDF, DOCX, XLSX, JSON, TXT, Images — up to 100MB each
              </p>
            </div>

            {/* Document list */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
              {count === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="text-5xl mb-4">📂</div>
                  <h3 className="text-lg font-bold text-gray-700">No Documents Loaded</h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-xs leading-relaxed">
                    Upload documents here or load sample data from the Doc Intelligence page. Documents stay available across all pages.
                  </p>
                </div>
              ) : (
                documents.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onView={() => setViewerDoc(doc)}
                    onRemove={() => removeDocument(doc.id)}
                    isViewing={viewerDoc?.id === doc.id}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {count > 0 && (
              <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
                <span className="text-[11px] text-gray-500 font-medium">
                  {count} doc{count !== 1 ? 's' : ''} &middot; {documents.filter(d => d.source === 'sample').length} sample, {documents.filter(d => d.source === 'upload').length} uploaded
                </span>
                <button
                  onClick={clearAll}
                  className="text-[11px] font-semibold text-red-600 hover:text-red-800 px-3 py-1.5 border border-red-200 rounded-md hover:bg-red-50 transition"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewerDoc && (
        <DocumentViewer doc={viewerDoc} onClose={() => setViewerDoc(null)} />
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.25s ease-out;
        }
      `}</style>
    </>
  );
}

function DocumentCard({
  doc, onView, onRemove, isViewing,
}: {
  doc: SharedDocument;
  onView: () => void;
  onRemove: () => void;
  isViewing: boolean;
}) {
  const ext = doc.filename.split('.').pop()?.toLowerCase() ?? '';
  const icon = { csv: '📊', pdf: '📕', docx: '📘', doc: '📘', xlsx: '📗', xls: '📗', txt: '📝', json: '📋', png: '🖼️', jpg: '🖼️', jpeg: '🖼️', md: '📝' }[ext] ?? '📄';
  const sizeKb = new Blob([doc.text]).size / 1024;
  const sizeLabel = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb.toFixed(0)} KB`;

  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 transition ${
      isViewing
        ? 'border-hdfc-blue bg-blue-50/50 shadow-md'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
    }`}>
      <div className="text-2xl shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-900 truncate" title={doc.filename}>
          {doc.filename}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
            doc.source === 'sample'
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
          }`}>
            {doc.source === 'sample' ? 'SAMPLE' : 'UPLOADED'}
          </span>
          <span className="text-[10px] text-gray-400">{sizeLabel}</span>
          {doc.images.length > 0 && (
            <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">{doc.images.length} img</span>
          )}
          {doc.department && (
            <span className="text-[9px] text-gray-400">{doc.department}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onView}
          className="p-1.5 rounded-lg text-hdfc-blue hover:bg-blue-100 transition"
          title="View document"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition"
          title="Remove document"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function DocumentViewer({ doc, onClose }: { doc: SharedDocument; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const isCSV = doc.filename.endsWith('.csv');

  const parseCsvToTable = (text: string) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length === 0) return null;

    const parseLine = (line: string) => {
      const fields: string[] = [];
      let cur = '';
      let inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQ && line[i + 1] === '"') { cur += '"'; i++; } else inQ = !inQ;
        } else if (ch === ',' && !inQ) {
          fields.push(cur.trim());
          cur = '';
        } else {
          cur += ch;
        }
      }
      fields.push(cur.trim());
      return fields;
    };

    const headers = parseLine(lines[0]);
    const rows = lines.slice(1).map(l => parseLine(l));
    return { headers, rows };
  };

  const csvData = isCSV ? parseCsvToTable(doc.text) : null;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(doc.text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch bg-black/50 backdrop-blur-sm p-3 sm:p-5" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full h-full flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-slate-50 rounded-t-xl shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg shrink-0">{isCSV ? '📊' : '📄'}</span>
            <h3 className="font-bold text-gray-900 text-[14px] truncate">{doc.filename}</h3>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
              doc.source === 'sample'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {doc.source === 'sample' ? 'SAMPLE' : 'UPLOADED'}
            </span>
            <span className="text-[10px] font-mono text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shrink-0">
              VIEW ONLY
            </span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xl font-bold px-2 shrink-0">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {csvData ? (
            <div className="h-full overflow-x-auto overflow-y-auto">
              <table className="border-collapse text-[12px]">
                <thead className="bg-hdfc-blueDeep text-white sticky top-0 z-10">
                  <tr>
                    {csvData.headers.map((h, i) => (
                      <th key={i} className="px-3 py-2 text-left font-semibold whitespace-nowrap border-r border-white/20">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.rows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-3 py-1.5 border-r border-b border-gray-200 whitespace-nowrap" title={cell}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2 text-[10px] text-gray-400 bg-slate-50 border-t">
                {csvData.rows.length} rows &times; {csvData.headers.length} columns
              </div>
            </div>
          ) : doc.images.length > 0 ? (
            <div className="h-full overflow-y-auto p-5 space-y-4">
              {doc.images.map((img, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`data:${img.media_type};base64,${img.base64}`}
                    alt={img.label}
                    className="max-w-full"
                  />
                  <div className="px-3 py-1.5 bg-gray-50 text-[10px] text-gray-500">{img.label}</div>
                </div>
              ))}
              {doc.text && (
                <pre className="text-[13px] font-mono text-gray-800 bg-slate-50 rounded-lg p-5 whitespace-pre-wrap leading-relaxed">{doc.text}</pre>
              )}
            </div>
          ) : (
            <div className="h-full overflow-y-auto overflow-x-auto p-5">
              <pre className="text-[13px] font-mono text-gray-800 bg-slate-50 rounded-lg p-5 whitespace-pre-wrap leading-relaxed min-h-full">{doc.text}</pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-slate-50 rounded-b-xl flex items-center justify-between shrink-0">
          <span className="text-[10px] text-gray-400">
            {doc.source === 'sample' ? 'Sample document' : 'Uploaded document'}
            {doc.department ? ` · ${doc.department}` : ''}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-[11px] font-semibold text-gray-700 hover:text-blue-700 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-white transition"
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
            <button
              onClick={onClose}
              className="text-[11px] font-semibold bg-hdfc-blue text-white px-4 py-1.5 rounded-md hover:bg-hdfc-blueDeep transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
