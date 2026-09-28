'use client';

import React from 'react';
import {
  ShieldOff,
  Eye,
  Layers,
  ArrowRight,
  Fingerprint,
  Clock,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_MIXER_RECORDS, KNOWN_PRIVACY_POOLS, getMixerAnalysis } from '@/lib/mixerEngine';

interface MixerAnalysisViewProps {
  onSelectWallet?: (walletId: string) => void;
}

export const MixerAnalysisView: React.FC<MixerAnalysisViewProps> = ({ onSelectWallet }) => {
  const analysis = getMixerAnalysis();

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#0a0a0a] text-white p-4 md:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#121212] border border-[#242424] rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800 text-purple-400 text-[11px] font-mono">
              <ShieldOff className="w-3.5 h-3.5" />
              <span>PRIVACY PROTOCOL & MIXER DE-ANONYMIZATION ENGINE</span>
            </div>
            <h1 className="text-xl font-bold font-sans">
              Mixer Pool Demixing & Equal-Denomination Correlation
            </h1>
            <p className="text-xs text-[#888888]">
              Automated heuristics analyze zero-knowledge anonymity pools, relayer gas sponsors, and temporal latencies to break transaction obfuscation.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-[#181818] border border-[#2a2a2a] px-3 py-1.5 rounded text-xs font-mono text-right">
              <span className="text-[#888888] block text-[10px]">CORRELATION CONFIDENCE</span>
              <span className="text-purple-400 font-bold">81% AVERAGE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#141414] border border-[#242424] p-3.5 rounded-lg space-y-1">
          <span className="text-[#888888] block text-[10px]">PROTOCOLS MONITORED</span>
          <span className="text-white text-base font-bold">{KNOWN_PRIVACY_POOLS.length} Contracts</span>
          <span className="text-[10px] text-[#666666] block">Tornado, Railgun, SideShift</span>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-3.5 rounded-lg space-y-1">
          <span className="text-[#888888] block text-[10px]">CORRELATED HOPS</span>
          <span className="text-white text-base font-bold">{analysis.activeInteractions} Ingress/Egress</span>
          <span className="text-[10px] text-green-400 block">Matched to Target Chain</span>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-3.5 rounded-lg space-y-1">
          <span className="text-[#888888] block text-[10px]">AVG ANONYMITY SET (N)</span>
          <span className="text-yellow-400 text-base font-bold">n = 6 – 12</span>
          <span className="text-[10px] text-[#666666] block">Low Pool Dilution</span>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-3.5 rounded-lg space-y-1">
          <span className="text-[#888888] block text-[10px]">FATF / OFAC STATUS</span>
          <span className="text-red-400 text-base font-bold">Sanctioned Tech</span>
          <span className="text-[10px] text-[#666666] block">Direct ML Risk Factor</span>
        </div>
      </div>

      {/* Main Analysis Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#aaaaaa]">
          De-Anonymized Privacy Protocol Events
        </h2>

        {DEMO_MIXER_RECORDS.map((record) => (
          <div
            key={record.id}
            className="bg-[#121212] border border-[#282828] hover:border-purple-900/60 rounded-lg p-5 space-y-4 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242424] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded bg-purple-950/60 border border-purple-800 flex items-center justify-center text-purple-400">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold text-white uppercase">
                    {record.poolName} ({record.protocol.replace('_', ' ')})
                  </h3>
                  <span className="text-[11px] font-mono text-[#888888] select-all">
                    Contract: {record.contractAddress}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-green-950/80 text-green-400 border border-green-800">
                  {record.deanonymizationConfidence}% UNMASKED CONFIDENCE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1a1a1a] text-white border border-[#333333]">
                  {record.status}
                </span>
              </div>
            </div>

            {/* Heuristic Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-[#161616] p-2.5 rounded border border-[#242424]">
                <div className="flex items-center space-x-1.5 text-[#888888] text-[10px] mb-1">
                  <Coins className="w-3 h-3 text-[#aaaaaa]" />
                  <span>DENOMINATION FINGERPRINT</span>
                </div>
                <span className="text-white font-bold">{record.denomination}</span>
              </div>

              <div className="bg-[#161616] p-2.5 rounded border border-[#242424]">
                <div className="flex items-center space-x-1.5 text-[#888888] text-[10px] mb-1">
                  <Clock className="w-3 h-3 text-[#aaaaaa]" />
                  <span>TEMPORAL DELAY (DELTA)</span>
                </div>
                <span className="text-white font-bold">{record.timeDeltaMinutes} Minutes</span>
              </div>

              <div className="bg-[#161616] p-2.5 rounded border border-[#242424]">
                <div className="flex items-center space-x-1.5 text-[#888888] text-[10px] mb-1">
                  <Eye className="w-3 h-3 text-[#aaaaaa]" />
                  <span>ANONYMITY SET SIZE (N)</span>
                </div>
                <span className="text-yellow-400 font-bold">{record.anonymitySetSize} Active Commitments</span>
              </div>
            </div>

            {/* Matched Heuristics List */}
            <div className="bg-[#141414] p-3 rounded border border-[#222222] space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-[#888888] block">
                Evidence of Linkability & De-Anonymization:
              </span>
              <ul className="space-y-1 text-xs text-[#cccccc]">
                {record.matchedHeuristics.map((h, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-purple-400">⚡</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Relayer & Hashes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono text-[#888888]">
              <div className="bg-[#101010] p-2 rounded border border-[#202020] truncate">
                <span className="text-[#666666] block text-[9px] uppercase">Deposit Tx Hash:</span>
                <span className="text-white select-all">{record.depositTxHash}</span>
              </div>

              {record.withdrawalTxHash && (
                <div className="bg-[#101010] p-2 rounded border border-[#202020] truncate">
                  <span className="text-[#666666] block text-[9px] uppercase">Correlated Withdrawal Tx Hash:</span>
                  <span className="text-green-400 select-all">{record.withdrawalTxHash}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
