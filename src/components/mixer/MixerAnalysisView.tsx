'use client';

import React, { useState } from 'react';
import {
  ShieldOff,
  Eye,
  Layers,
  Fingerprint,
  Clock,
  Coins,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { DEMO_MIXER_RECORDS, KNOWN_PRIVACY_POOLS, getMixerAnalysis } from '@/lib/mixerEngine';

interface MixerAnalysisViewProps {
  onSelectWallet?: (walletId: string) => void;
}

export const MixerAnalysisView: React.FC<MixerAnalysisViewProps> = ({ onSelectWallet }) => {
  const analysis = getMixerAnalysis();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-obsidian-950 text-sand-100 p-4 md:p-6 space-y-6 select-none font-sans">
      {/* Top Banner */}
      <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-[4px] bg-obsidian-850 border border-obsidian-750 text-sand-300 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-sand-300" />
              <span className="tracking-wider uppercase">PRIVACY PROTOCOL &amp; MIXER DE-ANONYMIZATION ENGINE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-sand-100 tracking-tight">
              Mixer Pool Demixing &amp; Equal-Denomination Correlation
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans">
              Automated heuristics analyze zero-knowledge anonymity pools, relayer gas sponsors, and temporal latencies to break transaction obfuscation and isolate recipient clusters.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-obsidian-850 border border-obsidian-750 px-4 py-2 rounded-[4px] text-xs font-mono text-right">
              <span className="text-zinc-500 block text-[10px] uppercase">CORRELATION CONFIDENCE</span>
              <span className="text-sand-100 font-bold text-sm">81% AVERAGE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Telemetry KPI Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-obsidian-900 p-3.5 rounded-[6px] border border-obsidian-750 space-y-1">
          <span className="text-zinc-500 block text-[10px] uppercase">PROTOCOLS MONITORED</span>
          <span className="text-sand-100 text-base font-bold">{KNOWN_PRIVACY_POOLS.length} Contracts</span>
          <span className="text-[10px] text-zinc-400 block">Tornado, Railgun, SideShift</span>
        </div>

        <div className="bg-obsidian-900 p-3.5 rounded-[6px] border border-obsidian-750 space-y-1">
          <span className="text-zinc-500 block text-[10px] uppercase">CORRELATED HOPS</span>
          <span className="text-sand-100 text-base font-bold">{analysis.activeInteractions} Ingress/Egress</span>
          <span className="text-[10px] text-zinc-400 block">Matched to Target Chain</span>
        </div>

        <div className="bg-obsidian-900 p-3.5 rounded-[6px] border border-obsidian-750 space-y-1">
          <span className="text-zinc-500 block text-[10px] uppercase">AVG ANONYMITY SET (N)</span>
          <span className="text-sand-100 text-base font-bold">n = 6 – 12</span>
          <span className="text-[10px] text-zinc-400 block">Low Pool Dilution</span>
        </div>

        <div className="bg-obsidian-900 p-3.5 rounded-[6px] border border-obsidian-750 space-y-1">
          <span className="text-zinc-500 block text-[10px] uppercase">FATF / OFAC STATUS</span>
          <span className="text-sand-100 text-base font-bold">Sanctioned Tech</span>
          <span className="text-[10px] text-zinc-400 block">Direct ML Risk Factor</span>
        </div>
      </div>

      {/* Technical Analysis Protocol Matrix (Section 35) */}
      <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-obsidian-750 pb-2.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sand-100">
            PRIVACY PROTOCOL AUDIT MATRIX
          </span>
          <span className="text-[10px] font-mono text-zinc-500">HEURISTIC TELEMETRY</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-obsidian-750 text-zinc-500 text-[10px] uppercase">
                <th className="pb-2 font-normal">PROTOCOL</th>
                <th className="pb-2 font-normal">SIGNAL</th>
                <th className="pb-2 font-normal">DENOMINATION</th>
                <th className="pb-2 font-normal">CONFIDENCE</th>
                <th className="pb-2 font-normal text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-750/50">
              <tr className="hover:bg-obsidian-850/50 transition-colors">
                <td className="py-2.5 font-bold text-sand-100">TORNADO CASH</td>
                <td className="py-2.5 text-zinc-400">POOL DEPOSIT / RELAYER SWEEP</td>
                <td className="py-2.5 text-sand-300">100.00 USDT</td>
                <td className="py-2.5 text-sand-100 font-bold">84%</td>
                <td className="py-2.5 text-right">
                  <span className="px-2 py-0.5 rounded-[4px] text-[10px] bg-obsidian-850 border border-obsidian-750 text-sand-100">
                    ANALYZED
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-obsidian-850/50 transition-colors">
                <td className="py-2.5 font-bold text-sand-100">RAILGUN</td>
                <td className="py-2.5 text-zinc-400">RELAYER GAS SPONSOR MATCH</td>
                <td className="py-2.5 text-sand-300">500.00 USDT</td>
                <td className="py-2.5 text-sand-100 font-bold">78%</td>
                <td className="py-2.5 text-right">
                  <span className="px-2 py-0.5 rounded-[4px] text-[10px] bg-obsidian-850 border border-obsidian-750 text-sand-100">
                    ANALYZED
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-obsidian-850/50 transition-colors">
                <td className="py-2.5 font-bold text-sand-100">COLD STORAGE</td>
                <td className="py-2.5 text-zinc-400">DORMANCY CLUSTER (&gt;180 DAYS)</td>
                <td className="py-2.5 text-sand-300">MULTI-ASSET</td>
                <td className="py-2.5 text-sand-100 font-bold">92%</td>
                <td className="py-2.5 text-right">
                  <span className="px-2 py-0.5 rounded-[4px] text-[10px] bg-obsidian-850 border border-sand-850 text-sand-300">
                    DETECTED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* De-Anonymized Privacy Protocol Events */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
          DE-ANONYMIZED PRIVACY PROTOCOL EVENTS ({DEMO_MIXER_RECORDS.length} RECORDED)
        </h2>

        {DEMO_MIXER_RECORDS.map((record) => (
          <div
            key={record.id}
            className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-obsidian-750 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-[4px] bg-obsidian-850 border border-obsidian-750 flex items-center justify-center text-sand-300">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold text-sand-100 uppercase tracking-wider">
                    {record.poolName} ({record.protocol.replace('_', ' ')})
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-400 select-all">
                    Contract: {record.contractAddress}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold bg-obsidian-850 text-sand-100 border border-obsidian-750">
                  {record.deanonymizationConfidence}% UNMASKED CONFIDENCE
                </span>
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold bg-obsidian-850 text-zinc-400 border border-obsidian-750">
                  {record.status}
                </span>
              </div>
            </div>

            {/* Heuristic Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-obsidian-850 p-3 rounded-[4px] border border-obsidian-750 space-y-1">
                <div className="flex items-center space-x-1.5 text-zinc-500 text-[10px]">
                  <Coins className="w-3.5 h-3.5 text-zinc-400" />
                  <span>DENOMINATION FINGERPRINT</span>
                </div>
                <span className="text-sand-100 font-bold block">{record.denomination}</span>
              </div>

              <div className="bg-obsidian-850 p-3 rounded-[4px] border border-obsidian-750 space-y-1">
                <div className="flex items-center space-x-1.5 text-zinc-500 text-[10px]">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>TEMPORAL DELAY (DELTA)</span>
                </div>
                <span className="text-sand-100 font-bold block">{record.timeDeltaMinutes} Minutes</span>
              </div>

              <div className="bg-obsidian-850 p-3 rounded-[4px] border border-obsidian-750 space-y-1">
                <div className="flex items-center space-x-1.5 text-zinc-500 text-[10px]">
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  <span>ANONYMITY SET SIZE (N)</span>
                </div>
                <span className="text-sand-100 font-bold block">{record.anonymitySetSize} Active Commitments</span>
              </div>
            </div>

            {/* Matched Heuristics List */}
            <div className="bg-obsidian-850 p-3.5 rounded-[4px] border border-obsidian-750 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 block tracking-wider">
                EVIDENCE OF LINKABILITY &amp; DE-ANONYMIZATION:
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
                {record.matchedHeuristics.map((h, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-sand-100 font-mono text-[11px] font-bold">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Relayer & Hashes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
              <div className="bg-obsidian-850 p-2.5 rounded-[4px] border border-obsidian-750 flex items-center justify-between">
                <div className="truncate pr-2">
                  <span className="text-zinc-500 block text-[9px] uppercase">Deposit Tx Hash:</span>
                  <span className="text-sand-100 select-all">{record.depositTxHash}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(record.depositTxHash, `dep-${record.id}`)}
                  className="text-zinc-500 hover:text-sand-100 transition-colors cursor-pointer shrink-0"
                  title="Copy Deposit Hash"
                >
                  {copiedKey === `dep-${record.id}` ? (
                    <Check className="w-3.5 h-3.5 text-sand-100" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {record.withdrawalTxHash && (
                <div className="bg-obsidian-850 p-2.5 rounded-[4px] border border-obsidian-750 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-zinc-500 block text-[9px] uppercase">Correlated Withdrawal Tx Hash:</span>
                    <span className="text-sand-100 select-all">{record.withdrawalTxHash}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(record.withdrawalTxHash!, `wth-${record.id}`)}
                    className="text-zinc-500 hover:text-sand-100 transition-colors cursor-pointer shrink-0"
                    title="Copy Withdrawal Hash"
                  >
                    {copiedKey === `wth-${record.id}` ? (
                      <Check className="w-3.5 h-3.5 text-sand-100" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
