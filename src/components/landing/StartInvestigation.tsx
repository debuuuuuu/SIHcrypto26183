'use client';

import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle,
  Clock,
  Building,
  Globe,
  Radio,
  FileText,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { DEMO_CASE } from '@/data/demoInvestigation';
import { NCRP_PRESET_COMPLAINTS, NcrpComplaintRecord } from '@/lib/ncrpRegistry';

interface StartInvestigationProps {
  onStartDemo: () => void;
  onCustomStart: (params: {
    address: string;
    chain: string;
    period: string;
    hops: number;
    minAmount: number;
    ncrpComplaint?: NcrpComplaintRecord;
    isLiveIndex?: boolean;
  }) => void;
}

export const StartInvestigation: React.FC<StartInvestigationProps> = ({
  onStartDemo,
  onCustomStart,
}) => {
  const [tab, setTab] = useState<'ncrp' | 'live' | 'manual'>('ncrp');
  const [selectedNcrpAck, setSelectedNcrpAck] = useState<string>(
    NCRP_PRESET_COMPLAINTS[0].ackNumber
  );

  // Manual / Live state
  const [address, setAddress] = useState(DEMO_CASE.targetAddress);
  const [chain, setChain] = useState('Ethereum');
  const [period, setPeriod] = useState('Last 30 Days');
  const [isLiveIndexing, setIsLiveIndexing] = useState(false);

  const selectedComplaint =
    NCRP_PRESET_COMPLAINTS.find((c) => c.ackNumber === selectedNcrpAck) ||
    NCRP_PRESET_COMPLAINTS[0];

  const handleLaunchNcrp = (complaint: NcrpComplaintRecord) => {
    onCustomStart({
      address: complaint.targetAddress,
      chain: complaint.targetChain,
      period: 'Last 7 Days',
      hops: 4,
      minAmount: 100,
      ncrpComplaint: complaint,
      isLiveIndex: false,
    });
  };

  const handleLiveTraceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLiveIndexing(true);
    onCustomStart({
      address: address.trim() || DEMO_CASE.targetAddress,
      chain,
      period,
      hops: 4,
      minAmount: 50,
      isLiveIndex: true,
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCustomStart({
      address: address.trim() || DEMO_CASE.targetAddress,
      chain,
      period,
      hops: 4,
      minAmount: 100,
    });
  };

  return (
    <div className="min-h-[calc(100vh-3.25rem)] bg-[#0a0a0a] flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-2xl w-full space-y-6">
        {/* Brand & Subtitle */}
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#181818] border border-[#2a2a2a] text-[#888888] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>SMART INDIA HACKATHON 2026 • REAL-TIME ATTRIBUTION ENGINE</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            MONOMER
          </h1>

          <p className="text-[#888888] text-xs font-sans">
            Automated Cryptocurrency Fraud Attribution, VASP Identification & LEA Evidence System
          </p>
        </div>

        {/* Ingestion Mode Selector Tabs */}
        <div className="flex border-b border-[#242424] bg-[#101010] p-1 rounded-t-lg text-xs font-mono">
          <button
            onClick={() => setTab('ncrp')}
            className={`flex-1 py-2 px-3 rounded text-center transition flex items-center justify-center space-x-2 ${
              tab === 'ncrp'
                ? 'bg-[#222222] text-white font-bold border border-[#383838]'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-blue-400" />
            <span>NCRP & SAHYOG Ingestion</span>
          </button>

          <button
            onClick={() => setTab('live')}
            className={`flex-1 py-2 px-3 rounded text-center transition flex items-center justify-center space-x-2 ${
              tab === 'live'
                ? 'bg-[#222222] text-white font-bold border border-[#383838]'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-green-400" />
            <span>Live Multi-Chain Indexer</span>
          </button>

          <button
            onClick={() => setTab('manual')}
            className={`flex-1 py-2 px-3 rounded text-center transition flex items-center justify-center space-x-2 ${
              tab === 'manual'
                ? 'bg-[#222222] text-white font-bold border border-[#383838]'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-orange-400" />
            <span>Target Manual Entry</span>
          </button>
        </div>

        {/* Primary Investigation Card */}
        <div className="bg-[#121212] border border-[#242424] rounded-b-lg p-6 space-y-6 shadow-sm text-left">
          {/* TAB 1: NCRP & SAHYOG PRESETS */}
          {tab === 'ncrp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#242424] pb-2.5">
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    National Cybercrime Reporting Portal (NCRP) Pipeline
                  </h2>
                  <span className="text-[11px] text-[#888888]">
                    Select an official victim complaint to run automated attribution & VASP tracing
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-800">
                  SAHYOG GATEWAY CONNECTED
                </span>
              </div>

              {/* Complaints List */}
              <div className="space-y-2.5">
                {NCRP_PRESET_COMPLAINTS.map((complaint) => {
                  const isSelected = selectedNcrpAck === complaint.ackNumber;
                  return (
                    <div
                      key={complaint.ackNumber}
                      onClick={() => setSelectedNcrpAck(complaint.ackNumber)}
                      className={`p-3.5 rounded border transition cursor-pointer text-xs font-mono ${
                        isSelected
                          ? 'bg-[#181818] border-white/80 text-white'
                          : 'bg-[#141414] border-[#242424] text-[#888888] hover:border-[#383838] hover:text-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-[11px]">
                            {complaint.ackNumber}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#222222] text-[#aaaaaa]">
                            {complaint.sahyogTicketId}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-red-400">
                          {complaint.lossAmountINR} (${complaint.lossAmountUSD} USDT)
                        </span>
                      </div>

                      <div className="text-white font-medium text-[11px] mb-1">
                        {complaint.crimeSubCategory}
                      </div>

                      <p className="text-[10px] text-[#888888] line-clamp-2 mb-2 font-sans">
                        {complaint.briefModusOperandi}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-[#666666] pt-1.5 border-t border-[#222222]">
                        <span>Jurisdiction: {complaint.policeStationJurisdiction}</span>
                        <span className="text-white font-semibold">Chain: {complaint.targetChain}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleLaunchNcrp(selectedComplaint)}
                  className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-[#e5e5e5] text-black py-2.5 rounded text-xs font-bold transition cursor-pointer"
                >
                  <span>Ingest Complaint & Initiate Tracing ({selectedComplaint.ackNumber})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE MULTI-CHAIN INDEXER */}
          {tab === 'live' && (
            <form onSubmit={handleLiveTraceSubmit} className="space-y-4">
              <div className="border-b border-[#242424] pb-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Live Blockchain RPC & Explorer Indexer
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-950 text-green-400 border border-green-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    RPC NODES ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-[#888888]">
                  Query live addresses, balances, and real on-chain counterparty transactions in real time.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#aaaaaa] font-mono block">
                  Target Wallet Address or Transaction Hash
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x... or Bitcoin address"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#666666] rounded px-3 py-2 text-xs font-mono text-white placeholder-[#555555] outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#aaaaaa] font-mono block">
                    Chain Ecosystem
                  </label>
                  <select
                    value={chain}
                    onChange={(e) => setChain(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#666666] rounded px-2.5 py-2 text-xs font-mono text-white outline-none transition"
                  >
                    <option value="Ethereum">Ethereum (ERC-20)</option>
                    <option value="Polygon">Polygon (POS)</option>
                    <option value="Arbitrum">Arbitrum One (L2)</option>
                    <option value="Bitcoin">Bitcoin (UTXO)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#aaaaaa] font-mono block">
                    Indexer Depth
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#666666] rounded px-2.5 py-2 text-xs font-mono text-white outline-none transition"
                  >
                    <option value="Last 24 Hours">Latest 10 Transactions</option>
                    <option value="Last 7 Days">Deep Multi-Hop (8 Hops)</option>
                    <option value="All Time">Full History Sweep</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLiveIndexing}
                  className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-400 text-black py-2.5 rounded text-xs font-bold transition cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>{isLiveIndexing ? 'Querying Blockchain RPC...' : 'Execute Live Blockchain Trace'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: TARGET MANUAL ENTRY / DEMO */}
          {tab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="border-b border-[#242424] pb-2.5 flex items-center justify-between">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Investigator Manual Address Search
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setAddress(DEMO_CASE.targetAddress);
                    setChain('Ethereum');
                  }}
                  className="text-[11px] font-mono text-[#888888] hover:text-white underline"
                >
                  Load Sample Target
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#aaaaaa] font-mono block">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#666666] rounded px-3 py-2 text-xs font-mono text-white placeholder-[#555555] outline-none transition"
                  required
                />
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-[#e5e5e5] text-black py-2.5 rounded text-xs font-bold transition cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Start Manual Investigation</span>
                </button>

                <button
                  type="button"
                  onClick={onStartDemo}
                  className="w-full flex items-center justify-center space-x-2 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] hover:border-[#555555] text-white py-2.5 rounded text-xs font-semibold transition cursor-pointer"
                >
                  <span>Quick Demo: Operation Broken Fan ($2,000 USDT)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* Preset Demo Reference Box */}
          <div className="bg-[#0a0a0a] border border-[#202020] rounded p-3 text-[11px] font-mono text-[#888888] space-y-1">
            <div className="flex justify-between text-[#cccccc]">
              <span>Active Investigation Mode:</span>
              <span className="font-semibold text-white">
                {tab === 'ncrp' ? 'NCRP / SAHYOG Sync' : tab === 'live' ? 'Live Indexer' : 'Manual Target'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Integrated LEA Standards:</span>
              <span className="text-white">Section 65B BSA • CrPC 91 Subpoena • I4C Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
