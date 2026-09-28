'use client';

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  AlertCircle,
  Network,
  Share2,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import { KNOWN_VASPS, INVESTIGATION_CLUSTERS, identifyVaspEntity } from '@/lib/clusteringEngine';
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
    <div className="flex-1 h-full overflow-y-auto bg-[#0a0a0a] text-white p-4 md:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#121212] border border-[#242424] rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800 text-blue-400 text-[11px] font-mono">
              <Building2 className="w-3.5 h-3.5" />
              <span>VASP ATTRIBUTION & EXCHANGE CLUSTERING ENGINE</span>
            </div>
            <h1 className="text-xl font-bold font-sans">
              Cryptocurrency Exchange & Custodial VASP Identification
            </h1>
            <p className="text-xs text-[#888888]">
              Automated clustering algorithms group deposit forwarders, hotwallets, and off-ramps under verified regulatory entities.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onOpenReport}
              className="px-3.5 py-2 bg-white text-black hover:bg-[#e5e5e5] rounded text-xs font-bold transition flex items-center space-x-2"
            >
              <span>Generate VASP Subpoena Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Active Investigation Cluster & VASP Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identified Cluster in This Case */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Cluster Card */}
          <div className="bg-[#121212] border border-red-900/60 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <div className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-red-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Identified Off-Ramp Cluster: CLS-VASP-POLYGON-001
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-950/80 text-red-400 border border-red-800">
                PRIMARY FREEZE TARGET
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-[#161616] p-2.5 rounded border border-[#262626]">
                <span className="text-[#888888] block text-[10px]">Entity Attributed</span>
                <span className="text-white font-bold">{KNOWN_VASPS.demo_exchange.name}</span>
              </div>
              <div className="bg-[#161616] p-2.5 rounded border border-[#262626]">
                <span className="text-[#888888] block text-[10px]">Clustering Confidence</span>
                <span className="text-green-400 font-bold">96% Heuristic Match</span>
              </div>
              <div className="bg-[#161616] p-2.5 rounded border border-[#262626]">
                <span className="text-[#888888] block text-[10px]">Attributed Volume</span>
                <span className="text-white font-bold">$680.00 USDT</span>
              </div>
              <div className="bg-[#161616] p-2.5 rounded border border-[#262626]">
                <span className="text-[#888888] block text-[10px]">FIU-IND Status</span>
                <span className="text-blue-400 font-bold">Reporting Entity (Compliant)</span>
              </div>
            </div>

            {/* Clustering Heuristics Applied */}
            <div className="bg-[#161616] p-3.5 rounded border border-[#262626] space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#aaaaaa] block uppercase">
                Active Clustering Heuristics
              </span>
              <ul className="space-y-1.5 text-xs text-[#cccccc]">
                <li className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>
                    <strong className="text-white">Sweep Consolidation Heuristic:</strong> Recipient address{' '}
                    <code className="text-[#aaaaaa] bg-[#222222] px-1 py-0.5 rounded text-[11px]">
                      0x98EF7712a04812fB8
                    </code>{' '}
                    promptly transferred 97% of balance ($680 USDT) directly to the omnibus hotwallet pool within 6 minutes.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>
                    <strong className="text-white">Co-Spending & Nonce Profile:</strong> Automated gas forwarding signature matches CEX deposit aggregation scripts.
                  </span>
                </li>
              </ul>
            </div>

            {/* Cluster Member Addresses */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#aaaaaa] uppercase block">
                Cluster Member Addresses (3 Addresses Correlated)
              </span>
              <div className="space-y-2">
                {[
                  {
                    address: DEMO_WALLETS.exchange.address,
                    role: 'Omnibus Hotwallet (CEX Deposit Pool)',
                    balance: '$1,240,000 USDT Pool',
                    target: 'exchange',
                  },
                  {
                    address: DEMO_WALLETS.polygonWallet.address,
                    role: 'Direct Customer Deposit Forwarder',
                    balance: '$18.00 USDT',
                    target: 'polygonWallet',
                  },
                  {
                    address: '0xEXCH_SWEEP_POOL_02',
                    role: 'Secondary Cold Storage Relay',
                    balance: '$5,820,000 USDT Pool',
                    target: 'exchange',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] rounded transition text-xs font-mono gap-2"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold select-all">{item.address}</span>
                        <button
                          onClick={() => copyToClipboard(item.address, `addr-${idx}`)}
                          className="text-[#666666] hover:text-white"
                        >
                          {copiedKey === `addr-${idx}` ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <span className="text-[#888888] text-[11px]">{item.role}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-white font-bold">{item.balance}</span>
                      {onSelectWallet && (
                        <button
                          onClick={() => onSelectWallet(item.target)}
                          className="px-2 py-1 bg-[#222222] hover:bg-[#333333] text-white rounded text-[11px] transition"
                        >
                          Focus in Graph
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suspect Syndicate Cluster */}
          <div className="bg-[#121212] border border-[#242424] rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-orange-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Syndicate Dispersal Cluster: CLS-DISPERSAL-ETH-002
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-orange-950/80 text-orange-400 border border-orange-800">
                HEURISTIC CORRELATED
              </span>
            </div>

            <p className="text-xs text-[#cccccc]">
              Heuristic clustering groups the suspect wallet and Wallets B, C, and D as part of a single automated dispersal operation. All wallets were funded with gas from the same originating contract and executed transactions within a 24-second window.
            </p>
          </div>
        </div>

        {/* Right Column: VASP Legal & Nodal Officer Directory */}
        <div className="space-y-4">
          <div className="bg-[#121212] border border-[#242424] rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#aaaaaa]">
              VASP Compliance Directory (FIU-IND)
            </h3>
            <p className="text-[11px] text-[#888888]">
              Verified legal and emergency nodal officer touchpoints for Section 91 CrPC notices.
            </p>

            <div className="space-y-2">
              {Object.values(KNOWN_VASPS).map((vasp) => (
                <button
                  key={vasp.id}
                  onClick={() => setSelectedVaspId(vasp.id)}
                  className={`w-full text-left p-2.5 rounded border transition flex items-center justify-between ${
                    selectedVaspId === vasp.id
                      ? 'bg-[#1e1e1e] border-white text-white'
                      : 'bg-[#141414] border-[#262626] text-[#888888] hover:text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs block text-white">{vasp.shortName}</span>
                    <span className="text-[10px] text-[#888888]">{vasp.jurisdiction}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      vasp.fiuIndRegistered
                        ? 'bg-green-950 text-green-400 border border-green-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {vasp.fiuIndRegistered ? 'FIU-REGISTERED' : 'OFFSHORE'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected VASP Details Card */}
          <div className="bg-[#141414] border border-[#282828] rounded-lg p-4 space-y-3 font-mono text-xs">
            <div className="border-b border-[#282828] pb-2">
              <span className="text-[10px] text-[#666666] uppercase block">Selected Entity</span>
              <h4 className="text-sm font-bold text-white">{currentVasp.name}</h4>
            </div>

            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-[#888888] block">Nodal Officer Subpoena Email:</span>
                <div className="flex items-center justify-between text-white font-bold bg-[#1a1a1a] p-1.5 rounded border border-[#2e2e2e]">
                  <span className="truncate select-all">{currentVasp.nodalEmail}</span>
                  <button
                    onClick={() => copyToClipboard(currentVasp.nodalEmail, 'nodal')}
                    className="text-[#888888] hover:text-white"
                  >
                    {copiedKey === 'nodal' ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[#888888] block">Emergency Freeze Portal:</span>
                <a
                  href={currentVasp.emergencyPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-blue-400 hover:underline pt-0.5"
                >
                  <span className="truncate">{currentVasp.emergencyPortalUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="pt-2 border-t border-[#282828] flex justify-between text-[#888888]">
                <span>Indexed Clusters:</span>
                <span className="text-white font-bold">{currentVasp.clusterCount} Addresses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
