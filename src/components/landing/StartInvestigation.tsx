'use client';

import React, { useState, useEffect } from 'react';
import { GlitchGlobe } from './GlitchGlobe';
import {
  Search,
  ArrowRight,
  Shield,
  Clock,
  Building,
  Globe,
  Database,
  Check,
  Cpu,
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

const LIVE_CHAINS = [
  { id: 'Ethereum', name: 'ETH', fullName: 'Ethereum L1', tag: 'ERC-20' },
  { id: 'Polygon', name: 'POL', fullName: 'Polygon PoS', tag: 'L2 Polygon' },
  { id: 'Arbitrum', name: 'ARB', fullName: 'Arbitrum One', tag: 'Rollup L2' },
  { id: 'BSC', name: 'BNB', fullName: 'BNB Chain', tag: 'BEP-20' },
  { id: 'Tron', name: 'TRON', fullName: 'TRON TRC-20', tag: 'USDT Tether' },
];

const PRESET_SAMPLE_TARGETS = [
  { label: 'Suspect Fraud Deposit Hotwallet', address: '0x71C8364f3B821A89a967520e1C526183D4982e01', chain: 'Ethereum' },
  { label: 'Tornado Cash Mixer Hop', address: '0xd4B261830172A45C8991Aa0259b19eF22871991A', chain: 'Ethereum' },
  { label: 'Binance Deposit Cluster', address: '0x28C6c06298d514Db089934071355E5743bf21d60', chain: 'Ethereum' },
];

export const StartInvestigation: React.FC<StartInvestigationProps> = ({
  onStartDemo,
  onCustomStart,
}) => {
  const [tab, setTab] = useState<'ncrp' | 'live' | 'manual'>('ncrp');
  const [selectedNcrpAck, setSelectedNcrpAck] = useState<string>(
    NCRP_PRESET_COMPLAINTS[0].ackNumber
  );
  
  // Interactive Globe State
  const [globeTransform, setGlobeTransform] = useState({ x: 70, y: -20, z: 10, scale: 1 });

  useEffect(() => {
    // Zoom and pan the globe based on selected complaint
    const index = NCRP_PRESET_COMPLAINTS.findIndex(c => c.ackNumber === selectedNcrpAck);
    if (index === 0) setGlobeTransform({ x: 65, y: -25, z: 15, scale: 1.1 });
    else if (index === 1) setGlobeTransform({ x: 75, y: -15, z: 5, scale: 1.25 });
    else if (index === 2) setGlobeTransform({ x: 60, y: -30, z: 20, scale: 1.4 });
  }, [selectedNcrpAck]);

  // Manual / Live state
  const [address, setAddress] = useState(DEMO_CASE.targetAddress);
  const [chain, setChain] = useState('Ethereum');
  const [period, setPeriod] = useState('Last 7 Days');
  const [hops, setHops] = useState(4);
  const [minAmount, setMinAmount] = useState(50);
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
      hops,
      minAmount,
      isLiveIndex: true,
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCustomStart({
      address: address.trim() || DEMO_CASE.targetAddress,
      chain,
      period,
      hops,
      minAmount,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col justify-start px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 pt-6 sm:pt-8 pb-12 select-none relative overflow-x-hidden overflow-y-auto">
      
      {/* 3D Animated Isometric Globe (Responsive: background cyber-mesh on mobile/narrow screens, prominent interactive asset on wide/desktop) */}
      <div className="pointer-events-none fixed lg:absolute inset-y-0 right-0 z-0 flex items-center justify-center w-full lg:w-[48vw] xl:w-[50vw] opacity-25 sm:opacity-40 lg:opacity-100 overflow-hidden">
        
        {/* WebGL Glitch Globe Background */}
        <GlitchGlobe 
          selectedAck={selectedNcrpAck} 
          onSelectNode={(ack) => { 
            setTab('ncrp'); 
            setSelectedNcrpAck(ack); 
          }} 
        />
        
        {/* Ambient background glow behind the sphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
      </div>

      {/* Main Content (Left aligned, responsive max-width) */}
      <div className="relative z-10 w-full max-w-[820px] space-y-3 sm:space-y-3.5 lg:space-y-4">
        {/* Section 15: Hero Header */}
        <div className="space-y-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] sm:text-[10px] font-mono font-semibold tracking-wider text-sand-300 px-2 py-0.5 rounded-[4px] bg-obsidian-900 border border-obsidian-750">
              I4C / LEA FORENSIC SUITE
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500">
              SEC 65B INDIAN EVIDENCE ACT
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono tracking-tight text-sand-100">
            MONOMER
          </h1>

          <p className="text-[11px] sm:text-xs text-sand-300 font-mono tracking-wide max-w-2xl leading-normal">
            REAL-TIME VASP ATTRIBUTION & FORENSIC EVIDENCE CORE
          </p>

          <p className="text-[10px] sm:text-[11px] text-zinc-400 font-sans max-w-xl leading-normal">
            Automated de-anonymization of suspect wallets, exchange cluster attribution, and court-admissible dossiers for Law Enforcement Agencies.
          </p>
        </div>

        {/* Section 15: Four Compact Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 sm:py-2.5 rounded-xl space-y-0.5 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-zinc-400 font-mono text-[9px] uppercase">
              <span>VASP CLUSTERS</span>
              <Database className="w-3 h-3 text-zinc-400" />
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-sand-100">1.42M+</div>
            <div className="text-[9px] font-mono text-zinc-500">FIU-IND Registry</div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 sm:py-2.5 rounded-xl space-y-0.5 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-zinc-400 font-mono text-[9px] uppercase">
              <span>TRACE LATENCY</span>
              <Zap className="w-3 h-3 text-zinc-400" />
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-sand-100">&lt; 850ms</div>
            <div className="text-[9px] font-mono text-zinc-500">High-Speed RPC</div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 sm:py-2.5 rounded-xl space-y-0.5 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-zinc-400 font-mono text-[9px] uppercase">
              <span>ATTRIBUTION</span>
              <Cpu className="w-3 h-3 text-zinc-400" />
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-sand-100">99.4%</div>
            <div className="text-[9px] font-mono text-zinc-500">Multi-Input Clustered</div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 sm:py-2.5 rounded-xl space-y-0.5 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-zinc-400 font-mono text-[9px] uppercase">
              <span>LEA GATEWAY</span>
              <Shield className="w-3 h-3 text-zinc-400" />
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-sand-100">NCRP / SYG</div>
            <div className="text-[9px] font-mono text-zinc-500">Sec 65B BSA Dossier</div>
          </div>
        </div>

        {/* Section 15: Ingestion Selector Tabs */}
        <div className="relative flex p-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl text-[11px] sm:text-xs font-mono">
          {/* Animated Background Pill */}
          <div
            className="absolute inset-y-1 w-[calc((100%-8px)/3)] bg-white rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: `translateX(${tab === 'ncrp' ? '0%' : tab === 'live' ? '100%' : '200%'})`,
              left: '4px'
            }}
          />

          <button
            onClick={() => setTab('ncrp')}
            className={`relative z-10 flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-center font-bold transition-colors duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
              tab === 'ncrp'
                ? 'text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">NCRP & SAHYOG</span>
          </button>

          <button
            onClick={() => setTab('live')}
            className={`relative z-10 flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-center font-bold transition-colors duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
              tab === 'live'
                ? 'text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">LIVE MULTI-CHAIN</span>
          </button>

          <button
            onClick={() => setTab('manual')}
            className={`relative z-10 flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-center font-bold transition-colors duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
              tab === 'manual'
                ? 'text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">MANUAL TARGET</span>
          </button>
        </div>

        {/* Primary Investigation Configuration Panel */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 sm:p-4 lg:p-5 text-left shadow-2xl relative z-10 flex flex-col min-h-[300px] max-h-[440px]">
          {/* TAB 1: NCRP & SAHYOG PRESETS */}
          {tab === 'ncrp' && (
            <div className="flex flex-col h-full animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0 mb-2.5">
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    National Cybercrime Reporting Portal (NCRP) Dossiers
                  </h2>
                  <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">
                    Select a validated cyber fraud complaint to initiate multi-hop attribution
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/10 text-white border border-white/20 hidden sm:block">
                  SAHYOG GATEWAY ACTIVE
                </span>
              </div>

              {/* Complaints List with internal scrolling */}
              <div className="flex-1 min-h-[120px] max-h-[180px] sm:max-h-[220px] space-y-2 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                {NCRP_PRESET_COMPLAINTS.map((complaint) => {
                  const isSelected = selectedNcrpAck === complaint.ackNumber;
                  return (
                    <div
                      key={complaint.ackNumber}
                      onClick={() => setSelectedNcrpAck(complaint.ackNumber)}
                      className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer text-xs font-mono group ${
                        isSelected
                          ? 'bg-white/10 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                          : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/[0.02] hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold text-[12px] flex items-center gap-1.5 transition-colors ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                            {complaint.ackNumber}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-zinc-500">
                            {complaint.sahyogTicketId}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${isSelected ? 'bg-white text-black border-transparent' : 'bg-black/40 border-white/10 text-zinc-300'}`}>
                          LOSS: ${complaint.lossAmountUSD} USDT
                        </span>
                      </div>

                      <div className={`font-medium text-xs mb-0.5 transition-colors ${isSelected ? 'text-zinc-200' : 'text-zinc-400'}`}>
                        {complaint.crimeSubCategory}
                      </div>

                      <p className="text-[11px] text-zinc-500 line-clamp-2 mb-1.5 font-sans leading-relaxed">
                        {complaint.briefModusOperandi}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] text-zinc-500 pt-1.5 border-t border-white/5 gap-1.5">
                        <span className="truncate max-w-[360px]">
                          {complaint.policeStationJurisdiction} • Chain: <span className="text-zinc-300 font-medium">{complaint.targetChain}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLaunchNcrp(complaint);
                          }}
                          className={`self-end sm:self-auto flex items-center space-x-1 px-2.5 py-1 rounded uppercase tracking-wider font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white text-black hover:bg-zinc-200'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          <span>Investigate</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 shrink-0 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => handleLaunchNcrp(selectedComplaint)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-white hover:bg-zinc-200 text-black py-2 sm:py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <span className="truncate">INGEST COMPLAINT & RUN ATTRIBUTION ({selectedComplaint.ackNumber})</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={onStartDemo}
                  className="px-4 py-2 sm:py-2.5 bg-black/40 hover:bg-white/10 border border-white/20 hover:border-white/40 text-zinc-300 rounded-xl text-xs font-mono transition cursor-pointer whitespace-nowrap"
                >
                  ENTER DASHBOARD
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE MULTI-CHAIN INDEXER (Section 16) */}
          {tab === 'live' && (
            <form onSubmit={handleLiveTraceSubmit} className="flex flex-col h-full animate-fade-in-up overflow-y-auto pr-1 custom-scrollbar">
              <div className="border-b border-obsidian-750 pb-3 mb-4 shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-sand-100">
                    Live Blockchain RPC & Explorer Indexer
                  </h2>
                  <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono bg-obsidian-850 text-sand-300 border border-obsidian-750">
                    RPC NODES ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-1">
                  Query on-chain counterparty transactions in real time via public JSON-RPC.
                </p>
              </div>

              {/* Supported Chains Chips: [ETH] [POL] [ARB] [BNB] [TRON] */}
              <div className="space-y-1.5 mb-4 shrink-0">
                <label className="text-xs text-zinc-400 font-mono block">
                  SELECT BLOCKCHAIN
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {LIVE_CHAINS.map((c) => {
                    const isSelected = chain === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setChain(c.id)}
                        className={`p-2 rounded-[4px] border text-left font-mono transition-colors text-xs cursor-pointer ${
                          isSelected
                            ? 'bg-sand-100 border-sand-100 text-obsidian-950 font-bold'
                            : 'bg-obsidian-950 border-obsidian-750 text-zinc-400 hover:text-sand-100 hover:border-sand-850'
                        }`}
                      >
                        <div className="text-[11px] font-bold">[{c.name}]</div>
                        <div className={`text-[9px] truncate ${isSelected ? 'text-obsidian-850' : 'text-zinc-600'}`}>{c.fullName}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Address Input */}
              <div className="space-y-1.5 mb-4 shrink-0">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-zinc-400 font-mono">
                    TARGET WALLET ADDRESS
                  </label>
                  <span className="text-[10px] font-mono text-zinc-600">
                    Supports EVM & UTXO formats
                  </span>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-obsidian-950 border border-obsidian-750 focus:border-sand-300 rounded-[4px] px-3 py-2 text-xs font-mono text-sand-100 placeholder-zinc-600 outline-none transition"
                  required
                />
              </div>

              {/* Preset Sample Address Chips */}
              <div className="space-y-1.5 mb-4 shrink-0">
                <span className="text-[11px] text-zinc-600 font-mono block">
                  Quick Sample Targets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_SAMPLE_TARGETS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAddress(s.address);
                        setChain(s.chain);
                      }}
                      className="px-2.5 py-1 rounded-[4px] text-[10px] font-mono bg-obsidian-950 hover:bg-obsidian-850 border border-obsidian-750 hover:border-sand-850 text-zinc-400 hover:text-sand-100 transition cursor-pointer"
                    >
                      {s.label} ({s.address.slice(0, 6)}...{s.address.slice(-4)})
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-auto pt-4 shrink-0">
                <button
                  type="submit"
                  disabled={isLiveIndexing}
                  className="w-full bg-sand-100 hover:bg-white text-obsidian-950 py-2.5 rounded-[4px] text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>RUN REAL-TIME RPC MULTI-CHAIN TRACE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: TARGET MANUAL ENTRY (Section 17) */}
          {tab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="flex flex-col h-full animate-fade-in-up overflow-y-auto pr-1 custom-scrollbar">
              <div className="border-b border-obsidian-750 pb-3 mb-4 shrink-0">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-sand-100">
                  Investigation Parameters
                </h2>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  Configure custom forensic traversal depth and minimum threshold filters.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-mono block">TARGET</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-obsidian-950 border border-obsidian-750 focus:border-sand-300 rounded-[4px] px-3 py-2 text-xs font-mono text-sand-100 placeholder-zinc-600 outline-none transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-mono block">CHAIN</label>
                    <select
                      value={chain}
                      onChange={(e) => setChain(e.target.value)}
                      className="w-full bg-obsidian-950 border border-obsidian-750 text-sand-100 rounded-[4px] px-3 py-2 text-xs font-mono outline-none"
                    >
                      <option value="Ethereum">Ethereum (ETH L1)</option>
                      <option value="Polygon">Polygon (PoS L2)</option>
                      <option value="Arbitrum">Arbitrum One</option>
                      <option value="BSC">BNB Chain</option>
                      <option value="Tron">TRON (TRC-20)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-mono block">TIME RANGE</label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full bg-obsidian-950 border border-obsidian-750 text-sand-100 rounded-[4px] px-3 py-2 text-xs font-mono outline-none"
                    >
                      <option value="Last 24 Hours">Last 24 Hours</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="All Time">All Time</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-400">MAX HOPS</span>
                      <span className="text-sand-100 font-bold">{hops} Hops</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      value={hops}
                      onChange={(e) => setHops(Number(e.target.value))}
                      className="w-full accent-sand-100 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-400">MIN AMOUNT</span>
                      <span className="text-sand-100 font-bold">${minAmount} USDT</span>
                    </div>
                    <input
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmount(Number(e.target.value))}
                      className="w-full bg-obsidian-950 border border-obsidian-750 focus:border-sand-300 rounded-[4px] px-3 py-1.5 text-xs font-mono text-sand-100 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 shrink-0">
                <button
                  type="submit"
                  className="w-full bg-sand-100 hover:bg-white text-obsidian-950 py-2.5 rounded-[4px] text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>INITIALIZE FORENSIC INVESTIGATION</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
