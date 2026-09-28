'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Search,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DEMO_EVIDENCE } from '@/data/demoInvestigation';

interface EvidenceRegistryProps {
  onSelectEntity?: (address: string) => void;
}

export const EvidenceRegistry: React.FC<EvidenceRegistryProps> = ({ onSelectEntity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
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
    <div className="h-full flex flex-col bg-[#0a0a0a] text-white p-6 overflow-y-auto select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-2 mb-6">
        <div>
          <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block">
            IMMUTABLE EVIDENCE INVENTORY
          </span>
          <h2 className="text-xl font-bold font-sans text-white tracking-tight">
            Evidence Registry
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            6 cryptographically verified evidence records anchored for case file compilation
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#666666]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records or hashes..."
            className="w-full bg-[#121212] border border-[#242424] rounded pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-[#555555] outline-none focus:border-[#555555] transition"
          />
        </div>
      </div>

      {/* Forensic Evidence Cards List */}
      <div className="space-y-3 max-w-4xl">
        {filteredEvidence.map((record) => {
          const isExpanded = expandedIds.includes(record.id);

          return (
            <div
              key={record.id}
              onClick={() => toggleExpand(record.id)}
              className="bg-[#111111] border border-[#242424] hover:border-[#444444] rounded p-4 transition cursor-pointer space-y-3"
            >
              {/* Top Record Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1f1f1f] pb-2.5">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-black bg-white px-2 py-0.5 rounded">
                    {record.id}
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    {record.type}
                  </span>
                  <span className="text-[#555555]">•</span>
                  <span className="text-xs text-[#888888] font-mono">
                    {record.timestamp}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-[#aaaaaa]">
                    {record.confidence}% Confidence
                  </span>
                  <button className="text-[#888888] hover:text-white">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#cccccc] leading-relaxed font-sans select-text">
                {record.description}
              </p>

              {/* Collapsible Detailed Section */}
              {isExpanded && (
                <div className="pt-2 border-t border-[#1f1f1f] space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#161616] p-3 rounded border border-[#242424]">
                    {/* Associated Wallets */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#888888] uppercase block">
                        Linked Entities
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {record.relatedEntities.map((ent, idx) => (
                          <span
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEntity?.(ent);
                            }}
                            className="text-[11px] bg-[#202020] border border-[#2e2e2e] text-[#cccccc] hover:text-white px-1.5 py-0.5 rounded select-all"
                          >
                            {ent}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Proof Mechanism */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#888888] uppercase block">
                        Proof Mechanism
                      </span>
                      <div className="flex items-center space-x-1.5 text-white text-[11px]">
                        <Lock className="w-3 h-3 text-[#aaaaaa]" />
                        <span>{record.proofType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Source Hash */}
                  <div className="flex items-center justify-between text-[11px] text-[#888888] pt-1">
                    <div className="truncate pr-2">
                      <span className="text-[#666666]">SOURCE TX: </span>
                      <span className="text-white select-all">{record.sourceHash}</span>
                    </div>

                    <button
                      onClick={(e) => handleCopy(record.sourceHash, e)}
                      className="text-[#aaaaaa] hover:text-white flex items-center space-x-1 shrink-0"
                    >
                      {copiedHash === record.sourceHash ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span className="text-white">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Hash</span>
                        </>
                      )}
                    </button>
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
