'use client';

import React, { useState } from 'react';
import { ArrowDown, Copy, Check, Info } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-[#0a0a0a] text-white p-6 overflow-y-auto select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-2 mb-6">
        <div>
          <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block">
            BRIDGE RECONSTRUCTION
          </span>
          <h2 className="text-xl font-bold font-sans text-white tracking-tight">
            Cross-Chain Analysis
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Cross-ledger fund progression from Ethereum Mainnet to Polygon POS
          </p>
        </div>

        <div className="text-xs font-mono text-[#888888] bg-[#141414] border border-[#242424] px-3 py-1.5 rounded self-start">
          Bridge Latency: 69s • Association Confidence: 89%
        </div>
      </div>

      {/* Primary 3-Second Visual Flow */}
      <div className="max-w-2xl mx-auto w-full my-4 py-4 px-6 bg-[#111111] border border-[#242424] rounded-lg">
        {/* Stage 1: Ethereum */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#222222] pb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              ETHEREUM MAINNET
            </span>
            <span className="text-[10px] font-mono text-[#666666]">L1 Ingress</span>
          </div>

          <div className="space-y-2 pl-4 border-l border-[#333333]">
            {/* Suspect Node */}
            <div
              onClick={() => onFocusNode?.('suspect')}
              className="p-3 bg-[#181818] border border-[#2a2a2a] hover:border-white rounded transition cursor-pointer flex justify-between items-center"
            >
              <div>
                <span className="text-[10px] font-mono text-[#888888] block">PRIMARY TARGET</span>
                <span className="text-sm font-semibold text-white">
                  Suspect Wallet ({DEMO_WALLETS.suspect.address.slice(0, 6)}...{DEMO_WALLETS.suspect.address.slice(-4)})
                </span>
              </div>
              <span className="text-xs font-mono text-[#aaaaaa]">Risk 78/100</span>
            </div>

            <div className="py-1 text-xs font-mono text-[#666666] flex items-center space-x-1.5">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>$700 USDT • TX-DEMO-003</span>
            </div>

            {/* Wallet C (Bridge Feeder) */}
            <div
              onClick={() => onFocusNode?.('walletC')}
              className="p-3 bg-[#181818] border border-[#2a2a2a] hover:border-white rounded transition cursor-pointer flex justify-between items-center"
            >
              <div>
                <span className="text-[10px] font-mono text-[#888888] block">BRIDGE FEEDER</span>
                <span className="text-sm font-semibold text-white">
                  Wallet C ({DEMO_WALLETS.walletC.address.slice(0, 6)}...{DEMO_WALLETS.walletC.address.slice(-4)})
                </span>
              </div>
              <span className="text-xs font-mono text-[#aaaaaa]">$700 USDT Inflow</span>
            </div>

            <div className="py-1 text-xs font-mono text-[#666666] flex items-center space-x-1.5">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>$700 USDT Contract Deposit • TX-DEMO-005</span>
            </div>

            {/* Demo Bridge Contract */}
            <div
              onClick={() => onFocusNode?.('bridge')}
              className="p-3 bg-[#202020] border border-[#444444] rounded cursor-pointer flex justify-between items-center"
            >
              <div>
                <span className="text-[10px] font-mono text-[#aaaaaa] block font-bold">
                  CROSS-CHAIN PROTOCOL
                </span>
                <span className="text-sm font-semibold text-white">
                  Demo Bridge Gateway (0xBR1Dge8841029c77E)
                </span>
              </div>
              <span className="text-xs font-mono text-white font-bold">Locked: $700.00</span>
            </div>
          </div>
        </div>

        {/* Bridge Transit Gap */}
        <div className="my-6 pl-4 border-l border-dashed border-[#555555] py-2">
          <div className="text-xs font-mono text-[#888888] flex items-center space-x-2">
            <ArrowDown className="w-4 h-4 text-white" />
            <span className="text-white font-semibold">69-second validator quorum & release</span>
            <span className="text-[#666666]">($2 net protocol fee)</span>
          </div>
        </div>

        {/* Stage 2: Polygon POS */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#222222] pb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              POLYGON POS
            </span>
            <span className="text-[10px] font-mono text-[#666666]">L2 Claim & Liquidation</span>
          </div>

          <div className="space-y-2 pl-4 border-l border-[#333333]">
            {/* Polygon Recipient Wallet */}
            <div
              onClick={() => onFocusNode?.('polygonWallet')}
              className="p-3 bg-[#181818] border border-[#2a2a2a] hover:border-white rounded transition cursor-pointer flex justify-between items-center"
            >
              <div>
                <span className="text-[10px] font-mono text-[#888888] block">POLYGON INTERMEDIARY</span>
                <span className="text-sm font-semibold text-white">
                  Polygon Wallet ({DEMO_WALLETS.polygonWallet.address.slice(0, 6)}...{DEMO_WALLETS.polygonWallet.address.slice(-4)})
                </span>
              </div>
              <span className="text-xs font-mono text-white font-bold">Released: $698.00</span>
            </div>

            <div className="py-1 text-xs font-mono text-[#666666] flex items-center space-x-1.5">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>$680 USDT Deposit • TX-DEMO-008</span>
            </div>

            {/* Exchange Endpoint */}
            <div
              onClick={() => onFocusNode?.('exchange')}
              className="p-3 bg-[#242424] border border-[#555555] hover:border-white rounded cursor-pointer flex justify-between items-center"
            >
              <div>
                <span className="text-[10px] font-mono text-white uppercase block font-bold">
                  OFF-RAMP ENDPOINT (ACTIONABLE)
                </span>
                <span className="text-sm font-semibold text-white">
                  Demo Exchange Hotwallet (0xEXCH489201cb4d401)
                </span>
              </div>
              <span className="text-xs font-mono text-white font-bold bg-[#141414] px-2 py-1 rounded border border-[#383838]">
                $680.00 USDT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Evidence Box below */}
      <div className="max-w-2xl mx-auto w-full bg-[#111111] border border-[#242424] rounded-lg p-4 font-mono text-xs space-y-3">
        <span className="text-[10px] text-[#888888] uppercase tracking-wider block font-semibold">
          CRYPTOGRAPHIC TELEMETRY PROOFS
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          <div className="bg-[#161616] p-2.5 rounded border border-[#242424] space-y-1">
            <div className="flex justify-between text-[#888888] text-[10px]">
              <span>L1 BRIDGE DEPOSIT HASH</span>
              <button
                onClick={() => handleCopy(DEMO_CROSS_CHAIN_HOP.bridgeTxHash)}
                className="hover:text-white"
              >
                {copiedHash === DEMO_CROSS_CHAIN_HOP.bridgeTxHash ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="text-[#cccccc] select-all break-all text-[11px]">
              {DEMO_CROSS_CHAIN_HOP.bridgeTxHash}
            </div>
          </div>

          <div className="bg-[#161616] p-2.5 rounded border border-[#242424] space-y-1">
            <div className="flex justify-between text-[#888888] text-[10px]">
              <span>L2 BRIDGE CLAIM HASH</span>
              <button
                onClick={() => handleCopy(DEMO_CROSS_CHAIN_HOP.claimTxHash)}
                className="hover:text-white"
              >
                {copiedHash === DEMO_CROSS_CHAIN_HOP.claimTxHash ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="text-[#cccccc] select-all break-all text-[11px]">
              {DEMO_CROSS_CHAIN_HOP.claimTxHash}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-[#666666] pt-1 border-t border-[#1f1f1f]">
          Cross-chain association is inferred from the simulated bridge event in this demonstration dataset.
        </p>
      </div>
    </div>
  );
};
