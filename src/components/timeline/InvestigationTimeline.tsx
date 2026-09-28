'use client';

import React, { useState } from 'react';
import { Clock, Copy, Check, ArrowRight } from 'lucide-react';
import { DEMO_TRANSACTIONS, DEMO_WALLETS } from '@/data/demoInvestigation';

interface InvestigationTimelineProps {
  selectedTransactionId: string | null;
  onSelectTransaction: (txId: string) => void;
  onFocusGraph?: () => void;
}

export const InvestigationTimeline: React.FC<InvestigationTimelineProps> = ({
  selectedTransactionId,
  onSelectTransaction,
  onFocusGraph,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] text-white p-6 overflow-y-auto select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-2 mb-6">
        <div>
          <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block">
            CHRONOLOGICAL LEDGER
          </span>
          <h2 className="text-xl font-bold font-sans text-white tracking-tight">
            Forensic Transaction Timeline
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            8 confirmed transfer events reconstructed across 10m 48s execution window
          </p>
        </div>

        <div className="text-xs font-mono text-[#888888] flex items-center space-x-1.5 self-start">
          <Clock className="w-3.5 h-3.5" />
          <span>Window: 10:31:04 — 10:41:52 UTC</span>
        </div>
      </div>

      {/* Streamlined Scannable Timeline */}
      <div className="max-w-3xl space-y-3 font-mono text-xs">
        {DEMO_TRANSACTIONS.map((tx) => {
          const isSelected = selectedTransactionId === tx.id;
          const fromWallet = DEMO_WALLETS[tx.from] || { label: tx.from, address: tx.from };
          const toWallet = DEMO_WALLETS[tx.to] || { label: tx.to, address: tx.to };

          return (
            <div
              key={tx.id}
              onClick={() => {
                onSelectTransaction(tx.id);
                if (onFocusGraph) onFocusGraph();
              }}
              className={`p-3.5 rounded border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#181818] border-white shadow-sm'
                  : 'bg-[#111111] border-[#222222] hover:border-[#404040] hover:bg-[#141414]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Time + Bullet + From/To */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="text-white font-bold">{tx.timestamp.split(' ')[0]}</span>
                    <span className="text-[#555555]">•</span>
                    <span className="text-[#888888]">{tx.chain}</span>
                    <span className="text-[#555555]">•</span>
                    <span className="text-[#aaaaaa] uppercase text-[10px]">
                      {tx.patternTag.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-white font-sans font-semibold">
                    <span>{fromWallet.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#666666] shrink-0" />
                    <span>{toWallet.label}</span>
                  </div>

                  <p className="text-xs text-[#888888] font-sans pt-0.5">
                    {tx.notes}
                  </p>
                </div>

                {/* Right: Amount & Hash */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#222222]">
                  <span className="text-sm font-bold text-white font-mono bg-[#1c1c1c] border border-[#2a2a2a] px-2.5 py-0.5 rounded">
                    {tx.amountFormatted}
                  </span>

                  <div className="flex items-center space-x-1.5 text-[10px] text-[#666666] font-mono">
                    <span className="select-all">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}
                    </span>
                    <button
                      onClick={(e) => handleCopy(tx.hash, e)}
                      className="p-1 hover:text-white transition"
                      title="Copy transaction hash"
                    >
                      {copiedHash === tx.hash ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
