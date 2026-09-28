'use client';

import React, { useState } from 'react';
import { ArrowDown, Copy, Check, GitBranch, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  DEMO_CROSS_CHAIN_HOP,
  DEMO_WALLETS,
} from '@/data/demoInvestigation';

interface CrossChainViewProps {
  onFocusNode?: (nodeId: string) => void;
}

export const CrossChainView: React.FC<CrossChainViewProps> = ({ onFocusNode }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-obsidian-950 text-sand-100 p-4 md:p-6 overflow-y-auto select-none font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-obsidian-750 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              BRIDGE RECONSTRUCTION
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] font-mono text-sand-300 uppercase">
              MULTI-LEDGER HOP
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-sand-100 tracking-tight mt-0.5">
            Cross-Chain Analysis &amp; Bridge Tracking
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            Cross-ledger fund progression tracking Ethereum Mainnet L1 egress through Polygon PoS L2 off-ramp
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <div className="bg-obsidian-900 border border-obsidian-750 px-3 py-1.5 rounded-[4px] text-sand-300">
            <span className="text-zinc-500 mr-1.5">LATENCY:</span>
            <span className="text-sand-100 font-bold">69 SEC</span>
          </div>
          <div className="bg-obsidian-900 border border-obsidian-750 px-3 py-1.5 rounded-[4px] text-sand-300">
            <span className="text-zinc-500 mr-1.5">CONFIDENCE:</span>
            <span className="text-sand-100 font-bold">89%</span>
          </div>
        </div>
      </div>

      {/* Primary Transition Flow Visualization */}
      <div className="max-w-3xl mx-auto w-full space-y-4">
        {/* Stage 1: Ethereum L1 */}
        <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-obsidian-750 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sand-300" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sand-100">
                ETHEREUM MAINNET
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase bg-obsidian-850 px-2 py-0.5 rounded-[4px] border border-obsidian-750">
              L1 INGRESS &bull; SOURCE LEDGER
            </span>
          </div>

          <div className="space-y-3 pl-4 border-l border-obsidian-750 ml-2">
            {/* Suspect Node */}
            <div
              onClick={() => onFocusNode?.('suspect')}
              className="p-3.5 bg-obsidian-850 border border-obsidian-750 hover:border-sand-300 rounded-[4px] transition cursor-pointer flex justify-between items-center group"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DDDDDD]" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">PRIMARY TARGET</span>
                </div>
                <span className="text-sm font-mono font-bold text-sand-100 group-hover:text-sand-300 transition-colors">
                  Suspect Wallet ({DEMO_WALLETS.suspect.address.slice(0, 6)}...{DEMO_WALLETS.suspect.address.slice(-4)})
                </span>
              </div>
              <span className="text-xs font-mono text-sand-300 bg-obsidian-900 px-2.5 py-1 rounded-[4px] border border-obsidian-750">
                RISK 94/100
              </span>
            </div>

            {/* In-flight Flow Telemetry */}
            <div className="py-1 text-xs font-mono text-zinc-400 flex items-center space-x-2 pl-2">
              <ArrowDown className="w-3.5 h-3.5 text-sand-300" />
              <span className="text-sand-100 font-bold">$700.00 USDT</span>
              <span className="text-zinc-500">&bull; TX-DEMO-003</span>
            </div>

            {/* Wallet C (Bridge Feeder) */}
            <div
              onClick={() => onFocusNode?.('walletC')}
              className="p-3.5 bg-obsidian-850 border border-obsidian-750 hover:border-sand-300 rounded-[4px] transition cursor-pointer flex justify-between items-center group"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#888888]" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">BRIDGE FEEDER / INTERMEDIARY</span>
                </div>
                <span className="text-sm font-mono font-bold text-sand-100 group-hover:text-sand-300 transition-colors">
                  Wallet C ({DEMO_WALLETS.walletC.address.slice(0, 6)}...{DEMO_WALLETS.walletC.address.slice(-4)})
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-300">
                $700.00 Inflow
              </span>
            </div>

            {/* In-flight Flow Telemetry */}
            <div className="py-1 text-xs font-mono text-zinc-400 flex items-center space-x-2 pl-2">
              <ArrowDown className="w-3.5 h-3.5 text-sand-300" />
              <span className="text-sand-100 font-bold">$700.00 USDT</span>
              <span className="text-zinc-500">&bull; CONTRACT DEPOSIT TX-DEMO-005</span>
            </div>

            {/* Bridge Gateway Contract */}
            <div
              onClick={() => onFocusNode?.('bridge')}
              className="p-3.5 bg-obsidian-850 border border-sand-850 rounded-[4px] cursor-pointer flex justify-between items-center hover:border-sand-300 transition-colors"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA]" />
                  <span className="text-[10px] font-mono text-sand-300 uppercase font-bold">
                    CROSS-CHAIN PROTOCOL CONTRACT
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-sand-100">
                  Demo Bridge Gateway (0xBR1Dge8841029c77E)
                </span>
              </div>
              <span className="text-xs font-mono text-sand-100 font-bold bg-obsidian-900 px-2.5 py-1 rounded-[4px] border border-obsidian-750">
                LOCKED: $700.00 USDT
              </span>
            </div>
          </div>
        </div>

        {/* Central Transition Bridge Box */}
        <div className="relative flex flex-col items-center py-2">
          <div className="w-px h-6 bg-obsidian-750" />
          <div className="w-full bg-obsidian-900 border border-sand-850 rounded-[6px] p-4 text-center space-y-1.5">
            <div className="flex items-center justify-center space-x-2 font-mono text-xs">
              <GitBranch className="w-4 h-4 text-sand-300" />
              <span className="text-sand-100 font-bold uppercase tracking-wider">
                POLYGON VALIDATOR BRIDGE GATEWAY
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400">
              Latency: 69s &bull; Quorum Consensus &bull; Relayer Fee: $2.00 USDT
            </p>
          </div>
          <div className="w-px h-6 bg-obsidian-750" />
        </div>

        {/* Stage 2: Polygon PoS L2 */}
        <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-obsidian-750 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sand-300" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sand-100">
                POLYGON POS
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase bg-obsidian-850 px-2 py-0.5 rounded-[4px] border border-obsidian-750">
              L2 CLAIM &bull; LIQUIDATION DESTINATION
            </span>
          </div>

          <div className="space-y-3 pl-4 border-l border-obsidian-750 ml-2">
            {/* Polygon Recipient Wallet */}
            <div
              onClick={() => onFocusNode?.('polygonWallet')}
              className="p-3.5 bg-obsidian-850 border border-obsidian-750 hover:border-sand-300 rounded-[4px] transition cursor-pointer flex justify-between items-center group"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#888888]" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">POLYGON INTERMEDIARY RECIPIENT</span>
                </div>
                <span className="text-sm font-mono font-bold text-sand-100 group-hover:text-sand-300 transition-colors">
                  Polygon Wallet ({DEMO_WALLETS.polygonWallet.address.slice(0, 6)}...{DEMO_WALLETS.polygonWallet.address.slice(-4)})
                </span>
              </div>
              <span className="text-xs font-mono text-sand-100 font-bold bg-obsidian-900 px-2.5 py-1 rounded-[4px] border border-obsidian-750">
                RELEASED: $698.00 USDT
              </span>
            </div>

            {/* In-flight Flow Telemetry */}
            <div className="py-1 text-xs font-mono text-zinc-400 flex items-center space-x-2 pl-2">
              <ArrowDown className="w-3.5 h-3.5 text-sand-300" />
              <span className="text-sand-100 font-bold">$680.00 USDT</span>
              <span className="text-zinc-500">&bull; DIRECT DEPOSIT TX-DEMO-008</span>
            </div>

            {/* Actionable Off-Ramp Endpoint */}
            <div
              onClick={() => onFocusNode?.('exchange')}
              className="p-3.5 bg-obsidian-850 border border-sand-850 hover:border-sand-300 rounded-[4px] cursor-pointer flex justify-between items-center transition-colors group"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC]" />
                  <span className="text-[10px] font-mono text-sand-300 uppercase font-bold">
                    ACTIONABLE OFF-RAMP ENDPOINT (CEX)
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-sand-100 group-hover:text-sand-300 transition-colors">
                  Demo Exchange Hotwallet (0xEXCH489201cb4d401)
                </span>
              </div>
              <span className="text-xs font-mono text-sand-100 font-bold bg-obsidian-900 px-3 py-1 rounded-[4px] border border-obsidian-750">
                $680.00 USDT
              </span>
            </div>
          </div>
        </div>

        {/* Cryptographic Telemetry Proofs Card */}
        <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-5 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-obsidian-750 pb-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
              CRYPTOGRAPHIC TELEMETRY PROOFS &amp; HASHES
            </span>
            <span className="text-[10px] text-sand-300">SECTION 65B EVIDENCE ANCHOR</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="bg-obsidian-850 p-3 rounded-[4px] border border-obsidian-750 space-y-1.5">
              <div className="flex justify-between text-zinc-400 text-[10px]">
                <span>L1 BRIDGE DEPOSIT HASH</span>
                <button
                  onClick={() => handleCopy(DEMO_CROSS_CHAIN_HOP.bridgeTxHash)}
                  className="hover:text-sand-100 text-zinc-500 cursor-pointer transition-colors"
                >
                  {copiedHash === DEMO_CROSS_CHAIN_HOP.bridgeTxHash ? (
                    <span className="text-sand-100 font-bold">COPIED</span>
                  ) : (
                    'COPY'
                  )}
                </button>
              </div>
              <div className="text-sand-100 select-all break-all text-[11px]">
                {DEMO_CROSS_CHAIN_HOP.bridgeTxHash}
              </div>
            </div>

            <div className="bg-obsidian-850 p-3 rounded-[4px] border border-obsidian-750 space-y-1.5">
              <div className="flex justify-between text-zinc-400 text-[10px]">
                <span>L2 BRIDGE CLAIM HASH</span>
                <button
                  onClick={() => handleCopy(DEMO_CROSS_CHAIN_HOP.claimTxHash)}
                  className="hover:text-sand-100 text-zinc-500 cursor-pointer transition-colors"
                >
                  {copiedHash === DEMO_CROSS_CHAIN_HOP.claimTxHash ? (
                    <span className="text-sand-100 font-bold">COPIED</span>
                  ) : (
                    'COPY'
                  )}
                </button>
              </div>
              <div className="text-sand-100 select-all break-all text-[11px]">
                {DEMO_CROSS_CHAIN_HOP.claimTxHash}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-zinc-500 pt-1 border-t border-obsidian-750 font-sans">
            Cross-chain association validated via multi-ledger state verification and cryptographic deposit/claim root proofs.
          </p>
        </div>
      </div>
    </div>
  );
};
