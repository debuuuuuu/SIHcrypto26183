'use client';

import React, { useState } from 'react';
import { Clock, Copy, Check, ArrowRight, ArrowUpRight } from 'lucide-react';
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
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <div className="h-full flex flex-col bg-obsidian-950 text-sand-100 p-4 lg:p-6 overflow-y-auto select-none font-sans space-y-4">
      {/* Header (Section 31) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-obsidian-750 gap-2">
        <div>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider block">
            TIMELINE // BLOCKCHAIN EVENTS
          </span>
          <h2 className="text-lg font-bold font-mono text-sand-100 tracking-tight">
            Chronological Forensic Ledger
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            8 confirmed transfer events reconstructed across 10m 48s execution window
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-400 px-2.5 py-1 bg-obsidian-900 border border-obsidian-750 rounded-[4px] flex items-center space-x-1.5 self-start">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>WINDOW: 10:31:04 — 10:41:52 UTC</span>
        </div>
      </div>

      {/* Scannable Technical Timeline Feed */}
      <div className="max-w-3xl space-y-2.5 font-mono text-xs">
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
              className={`p-3.5 rounded-[4px] border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-obsidian-850 border-sand-300 shadow-md'
                  : 'bg-obsidian-900 border-obsidian-750 hover:border-sand-850 hover:bg-obsidian-850'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Timestamp + Sequence + Transfer Path */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="text-sand-100 font-bold">{tx.timestamp.split(' ')[0]}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-sand-300 font-semibold">{tx.id}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400 uppercase text-[10px]">
                      {tx.chain} [{tx.patternTag.replace('_', ' ')}]
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-sand-100 font-mono font-semibold">
                    <span>{fromWallet.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span>{toWallet.label}</span>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed pt-0.5">
                    {tx.notes}
                  </p>
                </div>

                {/* Right: Telemetry & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-obsidian-750">
                  <span className="text-xs font-bold text-sand-100 font-mono bg-obsidian-950 border border-obsidian-750 px-2 py-0.5 rounded-[3px]">
                    {tx.amountFormatted}
                  </span>

                  <div className="flex items-center space-x-1.5 text-[10px] text-zinc-600 font-mono">
                    <span className="select-all">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}
                    </span>
                    <button
                      onClick={(e) => handleCopy(tx.hash, e)}
                      className="text-zinc-400 hover:text-sand-100 p-0.5"
                      title="Copy transaction hash"
                    >
                      {copiedHash === tx.hash ? (
                        <Check className="w-2.5 h-2.5 text-sand-100" />
                      ) : (
                        <Copy className="w-2.5 h-2.5" />
                      )}
                    </button>
                  </div>

                  <div className="text-[10px] text-zinc-400 flex items-center space-x-0.5 pt-1">
                    <span>FOCUS GRAPH</span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-zinc-400" />
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
