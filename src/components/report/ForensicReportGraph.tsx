'use client';

import React from 'react';
import {
  Shield,
  ShieldAlert,
  ArrowRight,
  ArrowDown,
  ArrowLeftRight,
  Building2,
  Lock,
  GitBranch,
  Layers,
  ArrowDownRight,
  ArrowDownLeft,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_WALLETS, DEMO_TRANSACTIONS } from '@/data/demoInvestigation';

interface ForensicReportGraphProps {
  isPaper: boolean;
}

export const ForensicReportGraph: React.FC<ForensicReportGraphProps> = ({ isPaper }) => {
  return (
    <div
      className={`w-full rounded border font-mono text-xs overflow-hidden transition-colors ${
        isPaper ? 'bg-[#fafafa] border-[#d8d8d8]' : 'bg-[#131313] border-[#2a2a2a]'
      }`}
    >
      {/* Graph Header Bar */}
      <div
        className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 ${
          isPaper ? 'bg-[#f0f0f0] border-[#d8d8d8]' : 'bg-[#181818] border-[#282828]'
        }`}
      >
        <div className="flex items-center space-x-2">
          <GitBranch className={`w-3.5 h-3.5 ${isPaper ? 'text-black' : 'text-white'}`} />
          <span className={`font-bold uppercase tracking-wider text-[11px] ${isPaper ? 'text-black' : 'text-white'}`}>
            FORENSIC TOPOLOGY GRAPH &bull; 4-TIER MULTI-HOP FLOW
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px]">
          <span className={`px-1.5 py-0.5 rounded border ${
            isPaper ? 'bg-white border-[#cccccc] text-black' : 'bg-[#111111] border-[#333333] text-[#aaaaaa]'
          }`}>
            9 Entities
          </span>
          <span className={`px-1.5 py-0.5 rounded border ${
            isPaper ? 'bg-white border-[#cccccc] text-black' : 'bg-[#111111] border-[#333333] text-[#aaaaaa]'
          }`}>
            8 Transactions
          </span>
          <span className="bg-black text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
            2 Blockchains
          </span>
        </div>
      </div>

      {/* Main Graph Canvas */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* ================================================================= */}
        {/* TIER 0 & 1: INGRESS & SUSPECT AGGREGATOR */}
        {/* ================================================================= */}
        <div className="flex flex-col items-center space-y-3">
          {/* Tier 0: Victim Origin */}
          <div
            className={`w-full max-w-sm rounded border p-2.5 shadow-sm transition-all ${
              isPaper
                ? 'bg-white border-[#cccccc] text-black'
                : 'bg-[#1a1a1a] border-[#333333] text-white'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-1.5 mb-1.5 border-current/10">
              <div className="flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-[#666666]" />
                <span className="font-bold text-[11px] uppercase tracking-wide">VICTIM WALLET</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black text-white font-bold">
                DEFRAUDED PARTY
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-[#777777]">0xVIC7...cf1</span>
              <span className="font-bold font-mono">Outflow: $2,000 USDT</span>
            </div>
          </div>

          {/* Flow Connector Arrow 1 */}
          <div className="flex flex-col items-center font-mono text-[10px] text-[#777777]">
            <ArrowDown className="w-4 h-4 text-[#888888]" />
            <span
              className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${
                isPaper ? 'bg-white border-[#cccccc] text-black' : 'bg-[#181818] border-[#333333] text-white'
              }`}
            >
              TX-DEMO-001 &bull; $2,000 USDT &bull; 10:31:04 UTC
            </span>
            <ArrowDown className="w-4 h-4 text-[#888888]" />
          </div>

          {/* Tier 1: Suspect Hub */}
          <div
            className={`w-full max-w-md rounded border-2 p-3 shadow-md ${
              isPaper
                ? 'bg-white border-black text-black'
                : 'bg-[#1a1a1a] border-white text-white'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-1.5 mb-1.5 border-current/15">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-black print:text-black" />
                <span className="font-extrabold text-xs uppercase tracking-wider">
                  PRIMARY SUSPECT HUB (0x7A92...F2D)
                </span>
              </div>
              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase">
                RISK: 78 / 100
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-center pt-1 font-mono">
              <div className={`p-1 rounded ${isPaper ? 'bg-[#f0f0f0]' : 'bg-[#111111]'}`}>
                <span className="text-[#888888] block text-[8px] uppercase">Ingested</span>
                <span className="font-bold">$2,000 USDT</span>
              </div>
              <div className={`p-1 rounded ${isPaper ? 'bg-[#f0f0f0]' : 'bg-[#111111]'}`}>
                <span className="text-[#888888] block text-[8px] uppercase">Velocity</span>
                <span className="font-bold">24 Seconds</span>
              </div>
              <div className={`p-1 rounded ${isPaper ? 'bg-[#f0f0f0]' : 'bg-[#111111]'}`}>
                <span className="text-[#888888] block text-[8px] uppercase">Dispersal</span>
                <span className="font-bold">100% Atomized</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* FAN-OUT CONNECTOR LINE */}
        {/* ================================================================= */}
        <div className="flex flex-col items-center -my-2">
          <div className="h-4 w-0.5 bg-[#888888]" />
          <div className="w-3/4 max-w-lg h-0.5 bg-[#888888]" />
          <div className="w-3/4 max-w-lg flex justify-between">
            <div className="h-4 w-0.5 bg-[#888888]" />
            <div className="h-4 w-0.5 bg-[#888888]" />
            <div className="h-4 w-0.5 bg-[#888888]" />
          </div>
        </div>

        {/* ================================================================= */}
        {/* TIER 2: 3-WAY BRANCH DISPERSION (FAN-OUT) */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* ------------------------------------------------------------- */}
          {/* BRANCH 1: RELAY & DOWNSTREAM DISPERSAL */}
          {/* ------------------------------------------------------------- */}
          <div
            className={`rounded border p-3 flex flex-col justify-between space-y-3 ${
              isPaper ? 'bg-white border-[#d0d0d0]' : 'bg-[#161616] border-[#2c2c2c]'
            }`}
          >
            {/* Branch Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b pb-1 border-current/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  BRANCH 1 &bull; 40.0%
                </span>
                <span className="text-xs font-extrabold">$800.00 USDT</span>
              </div>

              {/* Node: Wallet B */}
              <div
                className={`p-2 rounded border space-y-1 ${
                  isPaper ? 'bg-[#f9f9f9] border-[#e0e0e0]' : 'bg-[#1c1c1c] border-[#333333]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold">Wallet B (Relay)</span>
                  <span className="text-[9px] px-1 rounded bg-[#333333] text-white">Risk: 68</span>
                </div>
                <div className="text-[10px] text-[#777777] font-mono">0x82BC...c41A</div>
                <div className="text-[9px] text-[#888888]">Inflow: 10:33:17 UTC</div>
              </div>

              {/* Transfer Arrow to Downstream */}
              <div className="flex flex-col items-center font-mono py-1">
                <ArrowDown className="w-3.5 h-3.5 text-[#888888]" />
                <span
                  className={`px-1.5 py-0.2 rounded border text-[8px] font-bold ${
                    isPaper ? 'bg-white border-[#cccccc] text-black' : 'bg-[#111111] border-[#333333] text-[#cccccc]'
                  }`}
                >
                  TX-DEMO-007 &bull; $760.00 (95.0%)
                </span>
                <span className="text-[8px] text-[#888888]">10:37:24 UTC (4m transit)</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#888888]" />
              </div>

              {/* Node: Downstream Destination */}
              <div
                className={`p-2 rounded border space-y-1 ${
                  isPaper ? 'bg-[#f4f4f4] border-[#d0d0d0]' : 'bg-[#141414] border-[#2c2c2c]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold">Downstream Dest</span>
                  <span className="text-[9px] px-1 rounded bg-black text-white font-bold">Hop 2</span>
                </div>
                <div className="text-[10px] text-[#777777] font-mono">0xDOWN...1a99</div>
                <div className="text-[10px] font-bold text-black print:text-black">
                  Holding: $760.00 USDT
                </div>
              </div>
            </div>

            {/* Branch Summary Footnote */}
            <div className="text-[9px] text-[#888888] pt-2 border-t border-current/10 flex justify-between">
              <span>Residual: $40.00 USDT</span>
              <span className="font-semibold text-black print:text-black">RAPID TRANSIT</span>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* BRANCH 2: CROSS-CHAIN BRIDGE & CEX OFF-RAMP */}
          {/* ------------------------------------------------------------- */}
          <div
            className={`rounded border-2 p-3 flex flex-col justify-between space-y-3 ${
              isPaper ? 'bg-white border-black ring-1 ring-black/15' : 'bg-[#161616] border-white/80'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b pb-1 border-current/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  BRANCH 2 &bull; 35.0%
                </span>
                <span className="text-xs font-extrabold">$700.00 USDT</span>
              </div>

              {/* Node: Wallet C */}
              <div
                className={`p-2 rounded border space-y-1 ${
                  isPaper ? 'bg-[#f9f9f9] border-[#e0e0e0]' : 'bg-[#1c1c1c] border-[#333333]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold">Wallet C (Feeder)</span>
                  <span className="text-[9px] px-1 rounded bg-[#333333] text-white">Risk: 74</span>
                </div>
                <div className="text-[10px] text-[#777777] font-mono">0x19DE...a7C2</div>
                <div className="text-[9px] text-[#888888]">Inflow: 10:33:29 UTC</div>
              </div>

              {/* Bridge Hop Boundary Box */}
              <div
                className={`p-2 rounded border border-dashed space-y-1.5 text-center ${
                  isPaper ? 'bg-[#f2f2f2] border-black text-black' : 'bg-[#1a1a1a] border-[#555555] text-white'
                }`}
              >
                <div className="flex items-center justify-center space-x-1 text-[9px] font-bold uppercase tracking-wider">
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>CROSS-CHAIN BRIDGE PROTOCOL</span>
                </div>
                <div className="text-[9px] text-[#777777] font-mono">
                  0xBR1D...c77E &bull; ETH L1 &rarr; Polygon PoS
                </div>
                <div className="text-[9px] font-bold">
                  TX-DEMO-005 &bull; $700.00 &rarr; $698.00 Net (3s)
                </div>
              </div>

              {/* Node: Polygon Recipient */}
              <div
                className={`p-2 rounded border space-y-1 ${
                  isPaper ? 'bg-[#f9f9f9] border-[#e0e0e0]' : 'bg-[#1c1c1c] border-[#333333]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold">Polygon Recipient</span>
                  <span className="text-[9px] px-1 rounded bg-black text-white font-bold">POLYGON</span>
                </div>
                <div className="text-[10px] text-[#777777] font-mono">0xP0LY...d82A</div>
                <div className="text-[9px] text-[#888888]">Forwarded $680 &bull; 10:41:52 UTC</div>
              </div>

              {/* Arrow to CEX */}
              <div className="flex justify-center py-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-[#888888]" />
              </div>

              {/* Node: Centralized Exchange */}
              <div
                className={`p-2 rounded border space-y-1 ${
                  isPaper ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-3 h-3" />
                    <span className="font-bold uppercase">Centralized CEX</span>
                  </div>
                  <span className="text-[8px] px-1 rounded bg-white text-black font-extrabold print:border">
                    TARGET
                  </span>
                </div>
                <div className="text-[10px] font-mono opacity-80">0xEXCH...4d401</div>
                <div className="text-[10px] font-extrabold">
                  $680.00 USDT Ingested
                </div>
              </div>
            </div>

            <div className="text-[9px] text-[#888888] pt-2 border-t border-current/10 flex justify-between">
              <span>Residual: $18.00 USDT</span>
              <span className="font-bold text-black print:text-black">SUBPOENA TARGET</span>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* BRANCH 3: STATIC COLD STORAGE / PARKED */}
          {/* ------------------------------------------------------------- */}
          <div
            className={`rounded border p-3 flex flex-col justify-between space-y-3 ${
              isPaper ? 'bg-white border-[#d0d0d0]' : 'bg-[#161616] border-[#2c2c2c]'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b pb-1 border-current/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  BRANCH 3 &bull; 25.0%
                </span>
                <span className="text-xs font-extrabold">$500.00 USDT</span>
              </div>

              {/* Node: Wallet D */}
              <div
                className={`p-2 rounded border space-y-1 ${
                  isPaper ? 'bg-[#f9f9f9] border-[#e0e0e0]' : 'bg-[#1c1c1c] border-[#333333]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold">Wallet D (Parking)</span>
                  <span className="text-[9px] px-1 rounded bg-[#333333] text-white">Risk: 52</span>
                </div>
                <div className="text-[10px] text-[#777777] font-mono">0x44AF...391B</div>
                <div className="text-[9px] text-[#888888]">Inflow: 10:33:41 UTC</div>
              </div>

              {/* Status Display */}
              <div
                className={`p-3 rounded border text-center space-y-1.5 ${
                  isPaper ? 'bg-[#f7f7f7] border-[#d8d8d8]' : 'bg-[#181818] border-[#303030]'
                }`}
              >
                <Lock className="w-5 h-5 mx-auto text-[#666666]" />
                <div className="font-bold text-[11px]">STATIC DORMANT ASSET</div>
                <p className="text-[10px] text-[#777777] leading-tight font-sans">
                  Funds remain completely dormant in custody. Zero outgoing hops detected in 72h window.
                </p>
                <div className="pt-1">
                  <span className="bg-black text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                    100% RECOVERABLE ($500)
                  </span>
                </div>
              </div>

              {/* Action Banner */}
              <div
                className={`p-2 rounded border text-[10px] ${
                  isPaper ? 'bg-[#f2f2f2] border-[#d8d8d8]' : 'bg-[#141414] border-[#2c2c2c]'
                }`}
              >
                <span className="font-bold block uppercase text-[#888888]">STATUTORY ACTION:</span>
                <span className="text-black print:text-black font-semibold">
                  Immediate Tether Blacklist &amp; Administrative Freeze.
                </span>
              </div>
            </div>

            <div className="text-[9px] text-[#888888] pt-2 border-t border-current/10 flex justify-between">
              <span>Residual: $500.00 USDT</span>
              <span className="font-semibold text-black print:text-black">FREEZE CANDIDATE</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RECONSTRUCTION LEGEND & METHODOLOGY */}
        {/* ================================================================= */}
        <div
          className={`p-2.5 rounded border text-[10px] flex flex-wrap items-center justify-between gap-2 ${
            isPaper ? 'bg-[#f4f4f4] border-[#d8d8d8] text-[#555555]' : 'bg-[#161616] border-[#2c2c2c] text-[#888888]'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="font-bold text-black print:text-black uppercase">Legend:</span>
            <span>&bull; Ingress: $2,000 USDT</span>
            <span>&bull; Dispersed: 3 Hops</span>
            <span>&bull; Cross-Chain Bridge: Polygon PoS</span>
          </div>
          <span className="font-mono text-black print:text-black font-semibold">
            TOTAL ACTIONABLE RECOVERY: $1,180.00 USDT (59.0%)
          </span>
        </div>
      </div>
    </div>
  );
};
