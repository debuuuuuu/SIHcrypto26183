'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Copy,
  Check,
  X,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { DEMO_WALLETS } from '@/data/demoInvestigation';
import { getWalletRiskAssessment } from '@/lib/riskEngine';

interface WalletIntelligencePanelProps {
  walletId: string | null;
  onClose?: () => void;
  onSelectWallet: (walletId: string) => void;
}

export const WalletIntelligencePanel: React.FC<WalletIntelligencePanelProps> = ({
  walletId,
  onClose,
  onSelectWallet,
}) => {
  const [copied, setCopied] = useState(false);

  // Empty state if explicitly null
  if (!walletId) {
    return (
      <div className="h-full flex flex-col justify-center items-center p-6 text-center select-none bg-[#111111] text-[#888888] space-y-3">
        <Shield className="w-8 h-8 text-[#444444]" />
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-white">
            No Entity Selected
          </h4>
          <p className="text-xs text-[#666666] font-sans max-w-[200px] mt-1">
            Select a wallet or transaction from the investigation graph to inspect its intelligence.
          </p>
        </div>
      </div>
    );
  }

  const wallet = DEMO_WALLETS[walletId] || DEMO_WALLETS.suspect;
  const risk = getWalletRiskAssessment(wallet.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#111111] border-l border-[#242424] text-white overflow-y-auto select-none font-sans">
      {/* Panel Top Header */}
      <div className="px-5 py-3.5 border-b border-[#242424] flex items-center justify-between sticky top-0 bg-[#111111]/95 backdrop-blur z-10">
        <div>
          <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block">
            WALLET INTELLIGENCE
          </span>
          <h2 className="text-sm font-bold text-white truncate max-w-[210px]">
            {wallet.label}
          </h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-[#888888] hover:text-white rounded hover:bg-[#1f1f1f] transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-5 space-y-6">
        {/* Identifier & Address */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[10px] text-[#888888] uppercase">
            <span>{wallet.role || wallet.entityType} • {wallet.chain}</span>
            <button
              onClick={handleCopy}
              className="text-[#aaaaaa] hover:text-white flex items-center space-x-1 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-white" />
                  <span className="text-white">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#181818] p-2.5 rounded border border-[#262626] text-white text-[12px] break-all select-all font-mono">
            {wallet.address}
          </div>
        </div>

        {/* Level 2: Risk Assessment Box */}
        <div className="border border-[#2e2e2e] bg-[#161616] rounded p-4 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-[#242424] pb-2">
            <div>
              <span className="text-[10px] text-[#888888] uppercase tracking-wider block">
                RISK LEVEL
              </span>
              <span className="text-sm font-bold text-white tracking-wide">
                {risk.level} RISK
              </span>
            </div>

            <div className="text-right">
              <span className="text-xl font-extrabold text-white">
                {risk.score}
              </span>
              <span className="text-xs text-[#888888]"> / 100</span>
            </div>
          </div>

          {/* Monochrome Progress Bar */}
          <div className="w-full h-1.5 bg-[#252525] rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${risk.score}%` }}
            />
          </div>

          {/* Why this assessment? */}
          <div className="space-y-1 pt-1 font-sans">
            <span className="text-[10px] font-mono text-[#888888] uppercase block font-semibold">
              Why this assessment?
            </span>
            <p className="text-xs text-[#cccccc] leading-relaxed select-text">
              {risk.explanation}
            </p>
          </div>

          {/* Contributing Signals */}
          <div className="space-y-1.5 pt-2 border-t border-[#242424] font-mono text-[11px]">
            <span className="text-[10px] text-[#666666] uppercase block">
              Contributing Factors
            </span>
            {risk.signals.map((sig, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 border-b border-[#1f1f1f] text-[#aaaaaa]"
              >
                <span className="truncate pr-2">{sig.category}</span>
                <span className="text-white font-bold shrink-0">
                  +{sig.scoreContribution}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[9px] font-mono text-[#555555] pt-1 leading-tight">
            Assessment based on observed behavioral heuristics and prototype intelligence.
          </p>
        </div>

        {/* Level 3: Flow Summary */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#888888] block">
            FLOW SUMMARY
          </span>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="bg-[#161616] border border-[#242424] rounded p-2.5">
              <span className="text-[10px] text-[#666666] block">RECEIVED</span>
              <span className="font-bold text-white">{wallet.totalReceived}</span>
            </div>
            <div className="bg-[#161616] border border-[#242424] rounded p-2.5">
              <span className="text-[10px] text-[#666666] block">SENT</span>
              <span className="font-bold text-white">{wallet.totalSent}</span>
            </div>
            <div className="bg-[#161616] border border-[#242424] rounded p-2.5">
              <span className="text-[10px] text-[#666666] block">BALANCE</span>
              <span className="font-bold text-white">{wallet.balance}</span>
            </div>
          </div>
        </div>

        {/* Level 4: Detected Patterns */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#888888] block">
            DETECTED PATTERNS
          </span>
          <div className="flex flex-wrap gap-1.5">
            {wallet.detectedPatterns.map((pat, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded bg-[#181818] border border-[#2e2e2e] text-xs font-mono text-[#cccccc]"
              >
                {pat}
              </span>
            ))}
          </div>
        </div>

        {/* Level 5: Associations */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#888888] block">
            ASSOCIATED WALLETS & CLUSTER
          </span>
          <div className="space-y-1 font-mono text-xs">
            {wallet.associatedWallets.map((addr, idx) => {
              const matchEntry = Object.entries(DEMO_WALLETS).find(
                ([_, w]) => w.address.toLowerCase() === addr.toLowerCase()
              );
              const matchNode = matchEntry ? matchEntry[1] : null;

              return (
                <div
                  key={idx}
                  onClick={() => matchNode && onSelectWallet(matchNode.id)}
                  className={`flex items-center justify-between p-2 rounded bg-[#161616] border border-[#242424] text-[11px] transition ${
                    matchNode
                      ? 'hover:border-[#555555] hover:bg-[#1e1e1e] cursor-pointer'
                      : 'cursor-default'
                  }`}
                >
                  <div className="truncate">
                    <span className="text-white block truncate">{addr}</span>
                    {matchNode && (
                      <span className="text-[10px] text-[#888888]">
                        {matchNode.label} ({matchNode.role || matchNode.entityType})
                      </span>
                    )}
                  </div>
                  {matchNode && <ChevronRight className="w-3.5 h-3.5 text-[#666666]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="pt-2 border-t border-[#242424] text-[10px] font-mono text-[#666666] space-y-1">
          <div className="flex justify-between">
            <span>First Observed:</span>
            <span className="text-[#aaaaaa]">{wallet.firstSeen}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Activity:</span>
            <span className="text-[#aaaaaa]">{wallet.lastActive}</span>
          </div>
          <div className="flex justify-between">
            <span>Interactions:</span>
            <span className="text-[#aaaaaa]">{wallet.txCount} txs recorded</span>
          </div>
        </div>
      </div>
    </div>
  );
};
