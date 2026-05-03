'use client';

import { useState, useCallback } from 'react';

export type HITLDecision = 'approved' | 'modified' | 'rejected' | 'pending';

export interface HITLEvent {
  approvalId: string;
  title: string;
  approverRole: string;
  confidence: number;
  confidenceThreshold: number;
  isMandatory: boolean;
  reason: string;
  reviewCheckpoints: string[];
}

interface HITLReviewPanelProps {
  hitl: HITLEvent;
  originalContent?: string;
  onDecision: (decision: HITLDecision, detail: string) => void;
  onModifiedContent?: (content: string) => void;
  accentColor?: string;
}

export default function HITLReviewPanel({
  hitl,
  originalContent,
  onDecision,
  onModifiedContent,
  accentColor = '#004B87',
}: HITLReviewPanelProps) {
  const [decision, setDecision] = useState<HITLDecision>('pending');
  const [modifications, setModifications] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [checkResults, setCheckResults] = useState<Record<string, boolean>>({});
  const [showModifyPanel, setShowModifyPanel] = useState(false);
  const [showRejectPanel, setShowRejectPanel] = useState(false);

  const allChecked = hitl.reviewCheckpoints.every(cp => checkResults[cp] === true);
  const someChecked = Object.values(checkResults).some(v => v);
  const confidencePct = Math.round(hitl.confidence * 100);
  const thresholdPct = Math.round(hitl.confidenceThreshold * 100);
  const isLowConfidence = hitl.confidence < hitl.confidenceThreshold;

  const toggleCheck = useCallback((cp: string) => {
    setCheckResults(prev => ({ ...prev, [cp]: !prev[cp] }));
  }, []);

  function handleApprove() {
    setDecision('approved');
    onDecision('approved', `Approved by reviewer. ${Object.entries(checkResults).filter(([, v]) => v).length}/${hitl.reviewCheckpoints.length} checkpoints verified.`);
  }

  function handleModify() {
    if (!modifications.trim()) return;
    setDecision('modified');
    onDecision('modified', modifications.trim());
    onModifiedContent?.(modifications.trim());
  }

  function handleReject() {
    if (!rejectionReason.trim()) return;
    setDecision('rejected');
    onDecision('rejected', rejectionReason.trim());
  }

  if (decision !== 'pending') {
    const decisionConfig = {
      approved: { bg: 'bg-emerald-50', border: 'border-emerald-300', icon: '✅', label: 'APPROVED', text: 'text-emerald-800' },
      modified: { bg: 'bg-amber-50', border: 'border-amber-300', icon: '✏️', label: 'MODIFIED & APPROVED', text: 'text-amber-800' },
      rejected: { bg: 'bg-red-50', border: 'border-red-300', icon: '❌', label: 'REJECTED', text: 'text-red-800' },
      pending: { bg: 'bg-gray-50', border: 'border-gray-300', icon: '⏳', label: 'PENDING', text: 'text-gray-800' },
    }[decision];

    return (
      <div className={`${decisionConfig.bg} border ${decisionConfig.border} rounded-xl p-5`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{decisionConfig.icon}</span>
          <div>
            <h4 className={`text-sm font-bold ${decisionConfig.text}`}>HITL Decision: {decisionConfig.label}</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Reviewed by: {hitl.approverRole} &middot; Confidence: {confidencePct}% &middot; {hitl.reviewCheckpoints.length} checkpoints
            </p>
          </div>
        </div>
        {decision === 'modified' && modifications && (
          <div className="mt-2 bg-white/70 rounded-lg p-3 border border-amber-200">
            <p className="text-xs font-semibold text-amber-700 mb-1">Modifications Applied:</p>
            <p className="text-xs text-gray-700">{modifications}</p>
          </div>
        )}
        {decision === 'rejected' && rejectionReason && (
          <div className="mt-2 bg-white/70 rounded-lg p-3 border border-red-200">
            <p className="text-xs font-semibold text-red-700 mb-1">Rejection Reason:</p>
            <p className="text-xs text-gray-700">{rejectionReason}</p>
          </div>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-500 bg-white/60 px-2 py-0.5 rounded-full border border-gray-200">
            HITL Gate Complete
          </span>
          <span className="text-[10px] text-gray-400">
            {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-amber-600 to-orange-500 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
            <span className="text-xl">🔍</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Human-in-the-Loop Review Gate</h3>
            <p className="text-[11px] text-white/80 mt-0.5">{hitl.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hitl.isMandatory && (
            <span className="text-[10px] font-bold text-red-100 bg-red-500/30 px-2.5 py-1 rounded-full border border-red-300/30">
              MANDATORY
            </span>
          )}
          <span className="text-[10px] font-bold text-white bg-white/20 px-2.5 py-1 rounded-full">
            {hitl.approverRole}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Confidence Score */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-gray-600">AI Confidence Score</span>
              <span className={`text-sm font-bold ${isLowConfidence ? 'text-red-600' : 'text-emerald-600'}`}>
                {confidencePct}%
              </span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isLowConfidence ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                }`}
                style={{ width: `${confidencePct}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-gray-400">Threshold: {thresholdPct}%</span>
              {isLowConfidence && (
                <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  Below threshold — escalation triggered
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
          <p className="text-[11px] font-semibold text-amber-700 mb-1">Review Reason</p>
          <p className="text-xs text-gray-700 leading-relaxed">{hitl.reason}</p>
        </div>

        {/* Review Checkpoints */}
        <div>
          <p className="text-[11px] font-semibold text-gray-600 mb-2">Review Checkpoints ({Object.values(checkResults).filter(v => v).length}/{hitl.reviewCheckpoints.length})</p>
          <div className="space-y-1.5">
            {hitl.reviewCheckpoints.map((cp, i) => (
              <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!checkResults[cp]}
                  onChange={() => toggleCheck(cp)}
                  className="w-4 h-4 rounded border-2 border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className={`text-xs transition ${checkResults[cp] ? 'text-gray-800 font-medium' : 'text-gray-500 group-hover:text-gray-700'}`}>
                  {cp}
                </span>
                {checkResults[cp] && <span className="text-emerald-500 text-xs">✓</span>}
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-amber-200">
          <button
            onClick={handleApprove}
            disabled={!someChecked}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
          >
            <span>✅</span> Approve
          </button>
          <button
            onClick={() => { setShowModifyPanel(!showModifyPanel); setShowRejectPanel(false); }}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm py-2.5 rounded-lg transition shadow-md flex items-center justify-center gap-2"
          >
            <span>✏️</span> Modify
          </button>
          <button
            onClick={() => { setShowRejectPanel(!showRejectPanel); setShowModifyPanel(false); }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-2.5 rounded-lg transition shadow-md flex items-center justify-center gap-2"
          >
            <span>❌</span> Reject
          </button>
        </div>

        {/* Modify Panel */}
        {showModifyPanel && (
          <div className="bg-white rounded-lg p-4 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-600">✏️</span>
              <h4 className="text-sm font-bold text-gray-800">Modify AI Output</h4>
            </div>
            <p className="text-[11px] text-gray-500">Describe the changes needed or paste the corrected version below:</p>
            <textarea
              value={modifications}
              onChange={e => setModifications(e.target.value)}
              placeholder="e.g., Change the rate figure to 8.50% instead of 8.65%. Remove the competitor comparison in paragraph 2. Add a disclaimer about rate being subject to change..."
              rows={4}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModifyPanel(false)} className="text-xs text-gray-500 hover:text-gray-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">Cancel</button>
              <button
                onClick={handleModify}
                disabled={!modifications.trim()}
                className="text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-4 py-1.5 rounded-lg disabled:opacity-30 transition"
              >
                Apply Modifications & Approve
              </button>
            </div>
          </div>
        )}

        {/* Reject Panel */}
        {showRejectPanel && (
          <div className="bg-white rounded-lg p-4 border border-red-200 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-600">❌</span>
              <h4 className="text-sm font-bold text-gray-800">Reject AI Output</h4>
            </div>
            <p className="text-[11px] text-gray-500">Provide the reason for rejection (required):</p>
            <textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g., The rate comparison is outdated. The customer communication contains biased language. The risk assessment methodology is incorrect..."
              rows={3}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowRejectPanel(false)} className="text-xs text-gray-500 hover:text-gray-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">Cancel</button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg disabled:opacity-30 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        )}

        {/* HITL Info Footer */}
        <div className="flex items-center gap-2 pt-2 border-t border-amber-200/50">
          <span className="text-[10px] text-gray-400">HITL Gate ID: {hitl.approvalId}</span>
          <span className="text-gray-300">|</span>
          <span className="text-[10px] text-gray-400">Per Delegation of Authority matrix</span>
          <span className="text-gray-300">|</span>
          <span className="text-[10px] text-gray-400">Audit-logged</span>
        </div>
      </div>
    </div>
  );
}
