'use client';

import React, { useState } from 'react';
import {
  Building2,
  Network,
  Share2,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { KNOWN_VASPS, INVESTIGATION_CLUSTERS } from '@/lib/clusteringEngine';
import { DEMO_WALLETS } from '@/data/demoInvestigation';

interface VaspClusteringViewProps {
  onSelectWallet?: (walletId: string) => void;
  onOpenReport?: () => void;
}

export const VaspClusteringView: React.FC<VaspClusteringViewProps> = ({
  onSelectWallet,
  onOpenReport,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedVaspId, setSelectedVaspId] = useState<string>('demo_exchange');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const currentVasp = KNOWN_VASPS[selectedVaspId] || KNOWN_VASPS.demo_exchange;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-obsidian-950 text-sand-100 p-4 md:p-6 space-y-6 select-none font-sans">
      {/* Top Tactical Banner */}
      <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-[4px] bg-obsidian-850 border border-obsidian-750 text-sand-300 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA]" />
              <span className="tracking-wider uppercase">VASP / ENTITY ATTRIBUTION ENGINE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-sand-100 tracking-tight">
              Cryptocurrency Exchange &amp; Custodial VASP Identification
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans">
              Automated multi-input clustering algorithms correlate deposit forwarders, hotwallets, and off-ramps under verified regulatory entities registered with FIU-IND.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onOpenReport}
              className="px-4 py-2 bg-sand-100 hover:bg-sand-300 text-obsidian-950 rounded-[4px] text-xs font-mono font-bold transition-colors flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>GENERATE VASP SUBPOENA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Active Investigation Cluster & VASP Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identified Cluster in This Case */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Cluster Card */}
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-obsidian-750 pb-3">
              <div className="flex items-center space-x-2.5">
                <Network className="w-4 h-4 text-sand-300" />
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">TARGET CLUSTER</span>
                  <h3 className="font-mono text-sm font-bold text-sand-100">
                    CLS-VASP-POLYGON-001
                  </h3>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase bg-obsidian-850 text-sand-100 border border-sand-850">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#AAAAAA] mr-1.5" />
                  IDENTIFIED OFF-RAMP
                </span>
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase bg-obsidian-850 text-[#F5F5F5] border border-[#444444]">
                  PRIMARY FREEZE TARGET
                </span>
              </div>
            </div>

            {/* Regulatory Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-obsidian-850 p-3 rounded-[4px] border border-obsidian-750 space-y-1">
                <span className="text-zinc-400 block text-[10px] uppercase">ENTITY</span>
                <span className="text-sand-100 font-bold block">{KNOWN_VASPS.demo_exchange.name}</span>
                <span className="text-[10px] text-zinc-500">Global Custodial VASP</span>
              </div>
              <div className="bg-obsidian-850 p-3 rounded-[4px] border border-obsidian-750 space-y-1">
                <span className="text-zinc-400 block text-[10px] uppercase">TYPE</span>
                <span className="text-sand-100 font-bold block">CEX / OFF-RAMP</span>
                <span className="text-[10px] text-zinc-500">Polygon L2 Ingress</span>
              </div>
              <div className="bg-obsidian-850 p-3 rounded-[4px] border border-obsidian-750 space-y-1">
                <span className="text-zinc-400 block text-[10px] uppercase">CONFIDENCE</span>
                <span className="text-sand-100 font-bold block">99.4%</span>
                <span className="text-[10px] text-[#AAAAAA]">Direct Deposit Match</span>
              </div>
              <div className="bg-obsidian-850 p-3 rounded-[4px] border border-obsidian-750 space-y-1">
                <span className="text-zinc-400 block text-[10px] uppercase">FIU-IND STATUS</span>
                <span className="text-sand-100 font-bold block">REGISTERED / VERIFIED</span>
                <span className="text-[10px] text-zinc-500">Compliance Code RE-IND-09</span>
              </div>
            </div>

            {/* Clustering Heuristics Applied */}
            <div className="bg-obsidian-850 p-4 rounded-[4px] border border-obsidian-750 space-y-2.5 font-mono text-xs">
              <span className="text-[11px] font-bold text-sand-300 block uppercase tracking-wider">
                ACTIVE CLUSTERING HEURISTICS
              </span>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-start space-x-2">
                  <span className="text-sand-100 font-bold">01</span>
                  <span>
                    <strong className="text-sand-100">Sweep Consolidation Heuristic:</strong> Recipient address{' '}
                    <code className="text-sand-300 bg-obsidian-900 border border-obsidian-750 px-1.5 py-0.5 rounded-[4px] text-[11px]">
                      0x98EF7712a04812fB8
                    </code>{' '}
                    promptly transferred 97% of balance ($680 USDT) directly to the omnibus hotwallet pool within 6 minutes.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sand-100 font-bold">02</span>
                  <span>
                    <strong className="text-sand-100">Co-Spending &amp; Nonce Profile:</strong> Automated gas forwarding signature matches CEX deposit aggregation scripts.
                  </span>
                </li>
              </ul>
            </div>

            {/* Cluster Member Addresses */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  CLUSTER MEMBER ADDRESSES (3 ADDRESSES CORRELATED)
                </span>
                <span className="text-[10px] font-mono text-zinc-500">FIU COMPLIANT DISCLOSURE</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                {[
                  {
                    address: DEMO_WALLETS.exchange.address,
                    role: 'Omnibus Hotwallet (CEX Deposit Pool)',
                    balance: '$1,240,000 USDT Pool',
                    target: 'exchange',
                    isPrimary: true,
                  },
                  {
                    address: DEMO_WALLETS.polygonWallet.address,
                    role: 'Direct Customer Deposit Forwarder',
                    balance: '$18.00 USDT',
                    target: 'polygonWallet',
                    isPrimary: false,
                  },
                  {
                    address: '0xEXCH_SWEEP_POOL_02',
                    role: 'Secondary Cold Storage Relay',
                    balance: '$5,820,000 USDT Pool',
                    target: 'exchange',
                    isPrimary: false,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-obsidian-850 hover:bg-obsidian-900 border border-obsidian-750 rounded-[4px] transition text-xs font-mono gap-2"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        {item.isPrimary && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC]" />
                        )}
                        <span className="text-sand-100 font-bold select-all">{item.address}</span>
                        <button
                          onClick={() => copyToClipboard(item.address, `addr-${idx}`)}
                          className="text-zinc-500 hover:text-sand-100 transition-colors cursor-pointer"
                          title="Copy address"
                        >
                          {copiedKey === `addr-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-sand-100" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-zinc-400 text-[11px] block mt-0.5">{item.role}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-sand-100 font-bold">{item.balance}</span>
                      {onSelectWallet && (
                        <button
                          onClick={() => onSelectWallet(item.target)}
                          className="px-2.5 py-1 bg-obsidian-900 hover:bg-obsidian-750 border border-obsidian-750 text-sand-100 rounded-[4px] text-[11px] font-mono transition cursor-pointer"
                        >
                          INSPECT IN GRAPH
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suspect Syndicate Dispersal Cluster */}
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-obsidian-750 pb-3">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-sand-300" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-sand-100">
                  SYNDICATE DISPERSAL CLUSTER: CLS-DISPERSAL-ETH-002
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase bg-obsidian-850 text-sand-300 border border-sand-850">
                HEURISTIC CORRELATED
              </span>
            </div>

            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Multi-input heuristic clustering groups the suspect wallet and Wallets B, C, and D as part of a single automated dispersal operation. All wallets were funded with gas from the same originating contract and executed transactions within a 24-second window.
            </p>
          </div>
        </div>

        {/* Right Column: VASP Legal & Nodal Officer Directory */}
        <div className="space-y-4">
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-4 space-y-3">
            <div className="border-b border-obsidian-750 pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sand-100">
                VASP COMPLIANCE DIRECTORY (FIU-IND)
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Verified legal and emergency nodal officer touchpoints for Section 91 CrPC notices.
              </p>
            </div>

            <div className="space-y-2">
              {Object.values(KNOWN_VASPS).map((vasp) => (
                <button
                  key={vasp.id}
                  onClick={() => setSelectedVaspId(vasp.id)}
                  className={`w-full text-left p-3 rounded-[4px] border transition flex items-center justify-between cursor-pointer ${
                    selectedVaspId === vasp.id
                      ? 'bg-obsidian-850 border-sand-300 text-sand-100'
                      : 'bg-obsidian-850/60 border-obsidian-750 text-zinc-400 hover:text-sand-100 hover:bg-obsidian-850'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs block text-sand-100 font-mono">{vasp.shortName}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{vasp.jurisdiction}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-[4px] font-bold ${
                      vasp.fiuIndRegistered
                        ? 'bg-obsidian-900 text-sand-100 border border-obsidian-750'
                        : 'bg-obsidian-900 text-zinc-400 border border-obsidian-750'
                    }`}
                  >
                    {vasp.fiuIndRegistered ? 'FIU-REGISTERED' : 'OFFSHORE'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected VASP Details Card */}
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-4 space-y-3 font-mono text-xs">
            <div className="border-b border-obsidian-750 pb-2">
              <span className="text-[10px] text-zinc-500 uppercase block">SELECTED REGULATORY ENTITY</span>
              <h4 className="text-sm font-bold text-sand-100 mt-0.5">{currentVasp.name}</h4>
            </div>

            <div className="space-y-3 text-[11px]">
              <div>
                <span className="text-zinc-400 block mb-1">NODAL OFFICER SUBPOENA EMAIL:</span>
                <div className="flex items-center justify-between text-sand-100 font-bold bg-obsidian-850 p-2 rounded-[4px] border border-obsidian-750">
                  <span className="truncate select-all">{currentVasp.nodalEmail}</span>
                  <button
                    onClick={() => copyToClipboard(currentVasp.nodalEmail, 'nodal')}
                    className="text-zinc-500 hover:text-sand-100 ml-2 transition-colors cursor-pointer"
                    title="Copy email"
                  >
                    {copiedKey === 'nodal' ? (
                      <Check className="w-3.5 h-3.5 text-sand-100" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-zinc-400 block mb-1">EMERGENCY FREEZE PORTAL:</span>
                <div className="flex items-center justify-between text-sand-300 bg-obsidian-850 p-2 rounded-[4px] border border-obsidian-750">
                  <a
                    href={currentVasp.emergencyPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 text-sand-100 hover:underline truncate"
                  >
                    <span className="truncate">{currentVasp.emergencyPortalUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <button
                    onClick={() => copyToClipboard(currentVasp.emergencyPortalUrl, 'portal')}
                    className="text-zinc-500 hover:text-sand-100 ml-2 transition-colors cursor-pointer"
                    title="Copy Portal URL"
                  >
                    {copiedKey === 'portal' ? (
                      <Check className="w-3.5 h-3.5 text-sand-100" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-obsidian-750 flex justify-between text-zinc-400">
                <span>INDEXED CLUSTERS:</span>
                <span className="text-sand-100 font-bold">{currentVasp.clusterCount} ADDRESSES</span>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={onOpenReport}
                  className="w-full py-2 bg-obsidian-850 hover:bg-obsidian-750 border border-obsidian-750 text-sand-100 text-xs font-mono font-bold rounded-[4px] transition cursor-pointer"
                >
                  PREPARE SECTION 91 CrPC NOTICE
                </button>
                {onSelectWallet && (
                  <button
                    onClick={() => onSelectWallet('exchange')}
                    className="w-full py-2 bg-obsidian-950 hover:bg-obsidian-850 border border-sand-850 text-sand-300 text-xs font-mono rounded-[4px] transition cursor-pointer"
                  >
                    INSPECT VASP HOTWALLET IN GRAPH
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
