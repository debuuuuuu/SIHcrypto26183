'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Search,
  Lock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileCheck2,
  Download,
} from 'lucide-react';
import { DEMO_EVIDENCE } from '@/data/demoInvestigation';

interface EvidenceRegistryProps {
  onSelectEntity?: (address: string) => void;
}

export const EvidenceRegistry: React.FC<EvidenceRegistryProps> = ({ onSelectEntity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [verifiedIds, setVerifiedIds] = useState<Record<string, boolean>>({});
  const [expandedIds, setExpandedIds] = useState<string[]>(['EVD-001', 'EVD-004']);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopy = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleVerify = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVerifiedIds((prev) => ({ ...prev, [id]: true }));
  };

  const handleDownload = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ev = DEMO_EVIDENCE.find((e) => e.id === id);
    if (!ev) return;
    const blob = new Blob(
      [JSON.stringify(ev, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVIDENCE_${id}_SEALED.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEvidence = DEMO_EVIDENCE.filter((ev) => {
    const term = searchTerm.toLowerCase();
    return (
      ev.id.toLowerCase().includes(term) ||
      ev.type.toLowerCase().includes(term) ||
      ev.description.toLowerCase().includes(term) ||
      ev.sourceHash.toLowerCase().includes(term)
    );
  });

  return (
    <div className="h-full flex flex-col bg-obsidian-950 text-sand-100 p-4 md:p-6 overflow-y-auto select-none font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-obsidian-750 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              EVIDENCE LOCKBOX
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] font-mono text-sand-300 uppercase">
              06 SEALED ITEMS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-sand-100 tracking-tight mt-0.5">
            Immutable Evidence Inventory
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            Cryptographically anchored and SHA-256 sealed artifacts certified for Section 65B Indian Evidence Act submissions
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records, types, or hashes..."
            className="w-full bg-obsidian-900 border border-obsidian-750 rounded-[4px] pl-8 pr-3 py-1.5 text-xs font-mono text-sand-100 placeholder-zinc-500 outline-none focus:border-sand-300 transition"
          />
        </div>
      </div>

      {/* Forensic Evidence Cards List */}
      <div className="space-y-3 max-w-4xl">
        {filteredEvidence.map((record) => {
          const isExpanded = expandedIds.includes(record.id);
          const isVerified = verifiedIds[record.id];

          return (
            <div
              key={record.id}
              onClick={() => toggleExpand(record.id)}
              className="bg-obsidian-900 border border-obsidian-750 hover:border-sand-850 rounded-[6px] p-4 transition cursor-pointer space-y-3"
            >
              {/* Top Record Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-obsidian-750 pb-2.5">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-obsidian-950 bg-sand-100 px-2 py-0.5 rounded-[4px]">
                    {record.id}
                  </span>
                  <span className="text-xs font-bold text-sand-100 uppercase tracking-wider font-mono">
                    {record.type}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {record.timestamp}
                  </span>
                </div>

                <div className="flex items-center space-x-3 font-mono text-xs">
                  <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px] bg-obsidian-850 border border-obsidian-750 text-sand-300 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-sand-100" />
                    <span>SEALED</span>
                  </div>
                  <span className="text-zinc-400 text-xs">
                    {record.confidence}% CONFIDENCE
                  </span>
                  <button className="text-zinc-400 hover:text-sand-100 p-0.5">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-300 leading-relaxed font-sans select-text">
                {record.description}
              </p>

              {/* Collapsible Detailed Section */}
              {isExpanded && (
                <div className="pt-2 border-t border-obsidian-750 space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-obsidian-850 p-3 rounded-[4px] border border-obsidian-750">
                    {/* Associated Wallets */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">
                        LINKED ENTITIES
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {record.relatedEntities.map((ent, idx) => (
                          <span
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEntity?.(ent);
                            }}
                            className="text-[11px] bg-obsidian-900 border border-obsidian-750 text-sand-300 hover:text-sand-100 px-1.5 py-0.5 rounded-[4px] select-all cursor-pointer transition-colors"
                          >
                            {ent}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Proof Mechanism */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">
                        PROOF MECHANISM
                      </span>
                      <div className="flex items-center space-x-1.5 text-sand-100 text-[11px]">
                        <Lock className="w-3.5 h-3.5 text-sand-300" />
                        <span>{record.proofType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Source Hash & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-400 pt-1 gap-2">
                    <div className="truncate pr-2">
                      <span className="text-zinc-500">SOURCE TX / SHA-256: </span>
                      <span className="text-sand-100 select-all">{record.sourceHash}</span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={(e) => handleVerify(record.id, e)}
                        className={`px-2.5 py-1 rounded-[4px] border text-[10px] font-mono font-bold transition-colors cursor-pointer flex items-center space-x-1 ${
                          isVerified
                            ? 'bg-obsidian-900 border-sand-300 text-sand-100'
                            : 'bg-obsidian-850 hover:bg-obsidian-900 border-obsidian-750 text-zinc-400 hover:text-sand-100'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3 text-sand-300" />
                        <span>{isVerified ? 'VERIFIED MATCH' : 'VERIFY SHA-256'}</span>
                      </button>

                      <button
                        onClick={(e) => handleCopy(record.sourceHash, e)}
                        className="px-2.5 py-1 rounded-[4px] bg-obsidian-850 hover:bg-obsidian-900 border border-obsidian-750 text-zinc-400 hover:text-sand-100 text-[10px] font-mono transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        {copiedHash === record.sourceHash ? (
                          <>
                            <Check className="w-3 h-3 text-sand-100" />
                            <span className="text-sand-100">COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>COPY HASH</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => handleDownload(record.id, e)}
                        className="px-2.5 py-1 rounded-[4px] bg-obsidian-850 hover:bg-obsidian-900 border border-obsidian-750 text-zinc-400 hover:text-sand-100 text-[10px] font-mono transition-colors cursor-pointer flex items-center space-x-1"
                        title="Download raw JSON artifact"
                      >
                        <Download className="w-3 h-3" />
                        <span>DOWNLOAD</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
