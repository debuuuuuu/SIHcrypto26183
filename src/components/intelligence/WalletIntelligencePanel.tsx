'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Copy,
  Check,
  X,
  ChevronRight,
  Shield,
  ExternalLink,
  AlertTriangle,
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
  const [freezeNoticeSent, setFreezeNoticeSent] = useState(false);

  // Empty state if explicitly null
  if (!walletId) {
    return (
      <div className="h-full w-[380px] sm:w-[420px] flex flex-col justify-center items-center p-6 text-center select-none bg-obsidian-950 border-l border-obsidian-750 text-zinc-400 space-y-3">
        <Shield className="w-8 h-8 text-zinc-600" />
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-sand-100">
            NO ENTITY SELECTED
          </h4>
          <p className="text-xs text-zinc-600 font-sans max-w-[220px] mt-1">
            Click on any vertex in the transaction graph to inspect on-chain telemetry.
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

  const handleOpenExplorer = () => {
    const baseUrl =
      wallet.chain === 'Polygon'
        ? 'https://polygonscan.com/address/'
        : 'https://etherscan.io/address/';
    window.open(`${baseUrl}${wallet.address}`, '_blank');
  };

  const handleTriggerFreezeNotice = () => {
    setFreezeNoticeSent(true);
    setTimeout(() => setFreezeNoticeSent(false), 2500);
  };

  return (
    <div className="h-full w-[380px] sm:w-[420px] flex flex-col bg-obsidian-950 border-l border-obsidian-750 text-sand-100 overflow-y-auto select-none font-sans shadow-2xl z-30">
      {/* Panel Top Header (Section 30) */}
      <div className="px-5 py-3 border-b border-obsidian-750 flex items-center justify-between sticky top-0 bg-obsidian-950 z-10">
        <div>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider block">
            WALLET INTELLIGENCE
          </span>
          <h2 className="text-sm font-bold font-mono text-sand-100 truncate max-w-[260px]">
            {wallet.label.toUpperCase()}
          </h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-sand-100 rounded-[4px] hover:bg-obsidian-850 transition cursor-pointer"
            title="Close inspector"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-5 space-y-4 text-xs font-mono">
        {/* Address and Role Tag */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span className="px-2 py-0.5 rounded-[4px] bg-obsidian-900 border border-obsidian-750 text-sand-300 font-bold uppercase">
              {wallet.role?.toUpperCase() || wallet.entityType.toUpperCase()}
            </span>
            <span className="text-zinc-600">{wallet.chain.toUpperCase()}</span>
          </div>

          <div className="bg-obsidian-900 p-2.5 rounded-[4px] border border-obsidian-750 text-sand-100 text-[11px] break-all select-all font-mono">
            {wallet.address}
          </div>
        </div>

        {/* Section 30: Risk Assessment Box */}
        <div className="border border-obsidian-750 bg-obsidian-900 rounded-[4px] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between border-b border-obsidian-750 pb-2">
            <div>
              <span className="text-[9px] text-zinc-600 uppercase tracking-wider block">
                THREAT SCORING
              </span>
              <span className="text-xs font-bold text-sand-100">
                {risk.level.toUpperCase()} RISK
              </span>
            </div>

            <div className="text-right">
              <span className="text-xl font-bold font-mono text-sand-100">
                {risk.score}
              </span>
              <span className="text-xs text-zinc-600"> / 100</span>
            </div>
          </div>

          {/* Grayscale Progress Track */}
          <div className="w-full h-1 bg-obsidian-950 rounded-[1px] overflow-hidden border border-obsidian-750">
            <div
              className="h-full bg-sand-100 transition-all duration-300"
              style={{ width: `${risk.score}%` }}
            />
          </div>

          {/* Explanation */}
          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed select-text">
            {risk.explanation}
          </p>

          {/* Factors */}
          <div className="space-y-1 pt-1.5 border-t border-obsidian-750 text-[10px]">
            {risk.signals.map((sig, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-zinc-400 py-0.5"
              >
                <span className="truncate pr-2">{sig.category}</span>
                <span className="text-sand-100 font-semibold shrink-0">
                  +{sig.scoreContribution}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Flow Breakdown */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[4px] p-2.5 space-y-0.5">
            <span className="text-[9px] text-zinc-600 uppercase block">BALANCE</span>
            <span className="font-bold text-sand-100">{wallet.balance}</span>
          </div>
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[4px] p-2.5 space-y-0.5">
            <span className="text-[9px] text-zinc-600 uppercase block">CHAIN</span>
            <span className="font-bold text-sand-100">{wallet.chain}</span>
          </div>
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[4px] p-2.5 space-y-0.5">
            <span className="text-[9px] text-zinc-600 uppercase block">INFLOW</span>
            <span className="font-bold text-sand-100">{wallet.totalReceived}</span>
          </div>
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[4px] p-2.5 space-y-0.5">
            <span className="text-[9px] text-zinc-600 uppercase block">OUTFLOW</span>
            <span className="font-bold text-sand-100">{wallet.totalSent}</span>
          </div>
        </div>

        {/* Detected Signals Chips */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-zinc-600 uppercase tracking-wider block">
            DETECTED SIGNALS
          </span>
          <div className="flex flex-wrap gap-1">
            {wallet.detectedPatterns.map((pat, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-[3px] bg-obsidian-900 border border-obsidian-750 text-[10px] text-sand-300"
              >
                [ {pat.toUpperCase()} ]
              </span>
            ))}
          </div>
        </div>

        {/* Counterparty Associations */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-zinc-600 uppercase tracking-wider block">
            COUNTERPARTIES
          </span>
          <div className="space-y-1">
            {wallet.associatedWallets.map((addr, idx) => {
              const matchEntry = Object.entries(DEMO_WALLETS).find(
                ([_, w]) => w.address.toLowerCase() === addr.toLowerCase()
              );
              const matchNode = matchEntry ? matchEntry[1] : null;

              return (
                <div
                  key={idx}
                  onClick={() => matchNode && onSelectWallet(matchNode.id)}
                  className={`flex items-center justify-between p-2 rounded-[4px] bg-obsidian-900 border border-obsidian-750 text-[11px] transition ${
                    matchNode
                      ? 'hover:border-sand-850 hover:bg-obsidian-850 cursor-pointer'
                      : 'cursor-default'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="text-sand-100 block truncate">{addr}</span>
                    {matchNode && (
                      <span className="text-[10px] text-zinc-500">
                        {matchNode.label}
                      </span>
                    )}
                  </div>
                  {matchNode && <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 30 Actions */}
        <div className="pt-2 border-t border-obsidian-750 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="py-1.5 px-3 bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-750 text-sand-300 hover:text-sand-100 rounded-[4px] text-[11px] transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-sand-100" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'COPIED' : 'COPY ADDR'}</span>
            </button>

            <button
              onClick={handleOpenExplorer}
              className="py-1.5 px-3 bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-750 text-sand-300 hover:text-sand-100 rounded-[4px] text-[11px] transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>EXPLORER</span>
            </button>
          </div>

          <button
            onClick={handleTriggerFreezeNotice}
            className="w-full py-2 bg-sand-100 hover:bg-white text-obsidian-950 font-bold rounded-[4px] text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{freezeNoticeSent ? 'FREEZE NOTICE QUEUED' : 'PREPARE FREEZE NOTICE'}</span>
          </button>
        </div>

        {/* First seen / Last active */}
        <div className="pt-1 text-[9px] text-zinc-600 space-y-0.5">
          <div className="flex justify-between">
            <span>First Observed:</span>
            <span className="text-zinc-400">{wallet.firstSeen}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Activity:</span>
            <span className="text-zinc-400">{wallet.lastActive}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
