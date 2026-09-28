'use client';

import React from 'react';
import {
  GitBranch,
  Clock,
  ShieldAlert,
  ArrowLeftRight,
  ShieldCheck,
  Bot,
  FileText,
  ArrowRight,
  ArrowUpRight,
  Shield,
  Layers,
  AlertTriangle,
  ExternalLink,
  Lock,
} from 'lucide-react';
import {
  DEMO_CASE,
  DEMO_WALLETS,
  DEMO_DETECTIONS,
  DEMO_EVIDENCE,
} from '@/data/demoInvestigation';
import { InvestigationCase } from '@/types/investigation';
import { Building, ShieldOff, Building2 } from 'lucide-react';

interface CaseOverviewViewProps {
  onNavigate: (tab: string) => void;
  onOpenReport: () => void;
  onSelectWallet: (walletId: string) => void;
  caseData?: InvestigationCase;
}

export const CaseOverviewView: React.FC<CaseOverviewViewProps> = ({
  onNavigate,
  onOpenReport,
  onSelectWallet,
  caseData,
}) => {
  const activeCase = caseData || DEMO_CASE;
  const ncrpAck = activeCase.ncrpAckNumber || '2026/NCRP/MH/09128';
  const sahyogTicket = activeCase.sahyogTicketId || 'I4C-SYG-2026-98124';
  const complainant = activeCase.complainantName || activeCase.reportingVictim || 'Rajesh K. Sharma';
  const policeStation = activeCase.policeStationJurisdiction || 'Cyber Crime Police Station, BKC, Mumbai';
  const firNo = activeCase.firOrGdNumber || 'FIR No. 142/2026 U/S 66D IT Act';

  return (
    <div className="h-full w-full overflow-y-auto bg-[#0a0a0a] text-white p-4 lg:p-6 font-sans select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* NCRP & SAHYOG Coordination Dossier */}
        <div className="border border-blue-900/60 bg-[#10141c] p-4 rounded-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/40 pb-2.5">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                NCRP / I4C SAHYOG INTEGRATED COMPLAINT DOSSIER
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                {sahyogTicket}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-950 text-green-400 border border-green-800 font-bold">
                SAHYOG FREEZE QUEUE ACTIVE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-[#888888] block text-[10px]">NCRP Ack No:</span>
              <span className="text-white font-bold">{ncrpAck}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px]">Complainant:</span>
              <span className="text-white font-semibold">{complainant}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px]">FIR / GD Ref:</span>
              <span className="text-[#cccccc]">{firNo}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px]">Jurisdiction:</span>
              <span className="text-[#cccccc] truncate block">{policeStation}</span>
            </div>
          </div>

          {/* Quick Attribution Links */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <button
              onClick={() => onNavigate('vasp')}
              className="px-2.5 py-1 bg-[#16202c] hover:bg-[#1f2d3d] border border-blue-800/80 text-blue-300 rounded flex items-center space-x-1.5 transition"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Inspect Identified VASP Cluster (Demo Exchange)</span>
            </button>

            <button
              onClick={() => onNavigate('privacy')}
              className="px-2.5 py-1 bg-[#1a1424] hover:bg-[#281e36] border border-purple-800/80 text-purple-300 rounded flex items-center space-x-1.5 transition"
            >
              <ShieldOff className="w-3.5 h-3.5" />
              <span>Inspect Privacy Protocol De-Anonymization</span>
            </button>
          </div>
        </div>

        {/* Level 1: Investigation / Case Identity Banner */}
        <div className="border border-[#262626] bg-[#121212] p-5 lg:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222222] pb-5">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#888888] uppercase tracking-wider mb-1">
                <span>CASE ID</span>
                <span>/</span>
                <span className="text-[#ffffff] font-semibold">{activeCase.caseId}</span>
                <span>/</span>
                <span className="text-[#888888]">{activeCase.chains.join(' · ')}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#ffffff]">
                {activeCase.caseName}
              </h1>
              <p className="text-sm text-[#999999] mt-1 max-w-2xl font-normal leading-relaxed">
                {activeCase.classification} &mdash; Forensic investigation of reported fraudulent
                funds transfer, multi-hop layering, and cross-chain obfuscation.
              </p>
            </div>

            {/* Level 2: Primary Analytical Result - Risk Assessment */}
            <div className="border border-[#333333] bg-[#181818] p-4 text-center shrink-0 min-w-[160px]">
              <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block">
                OVERALL RISK LEVEL
              </span>
              <div className="text-3xl font-black font-mono text-[#ffffff] my-0.5">
                {activeCase.riskScore}
                <span className="text-sm text-[#666666] font-normal"> / 100</span>
              </div>
              <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-[#ffffff] text-[#000000]">
                HIGH RISK
              </span>
            </div>
          </div>


          {/* Forensic Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
            <div className="border-l-2 border-[#333333] pl-3">
              <span className="text-[10px] font-mono text-[#777777] uppercase block">
                Total Traced Funds
              </span>
              <span className="text-lg font-bold font-mono text-[#ffffff]">
                ${DEMO_CASE.totalValue.toLocaleString()} USDT
              </span>
            </div>
            <div className="border-l-2 border-[#333333] pl-3">
              <span className="text-[10px] font-mono text-[#777777] uppercase block">
                Tracked Entities
              </span>
              <span className="text-lg font-bold font-mono text-[#ffffff]">
                {DEMO_CASE.walletCount} Wallets
              </span>
            </div>
            <div className="border-l-2 border-[#333333] pl-3">
              <span className="text-[10px] font-mono text-[#777777] uppercase block">
                Confirmed Patterns
              </span>
              <span className="text-lg font-bold font-mono text-[#ffffff]">
                {DEMO_DETECTIONS.length} Detections
              </span>
            </div>
            <div className="border-l-2 border-[#333333] pl-3">
              <span className="text-[10px] font-mono text-[#777777] uppercase block">
                Forensic Artifacts
              </span>
              <span className="text-lg font-bold font-mono text-[#ffffff]">
                {DEMO_EVIDENCE.length} Items Sealed
              </span>
            </div>
          </div>
        </div>

        {/* Section 01: Executive Incident Summary */}
        <div className="border border-[#222222] bg-[#111111] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222222] pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#aaaaaa]">
                01 &mdash; What Happened?
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#181818] border border-[#2a2a2a] text-[#888888] rounded">
                INCIDENT NARRATIVE
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#666666]">
              Click entity chips to inspect intelligence
            </span>
          </div>

          <p className="text-sm text-[#cccccc] leading-relaxed">
            On September 21, 2026 at 10:31:04 UTC, an unauthorized fraudulent disbursement of{' '}
            <strong className="text-white font-mono">$2,000 USDT</strong> originated from Victim Wallet{' '}
            <button
              onClick={() => onSelectWallet('victim')}
              className="inline-flex items-center space-x-1 text-xs bg-[#1a1a1a] hover:bg-[#252525] px-1.5 py-0.5 border border-[#333333] hover:border-[#666666] font-mono text-white transition cursor-pointer rounded-sm"
              title="Click to inspect Victim Wallet"
            >
              <span>0xVIC7...cf1</span>
              <ArrowUpRight className="w-3 h-3 text-[#888888]" />
            </button>{' '}
            into Suspect Primary{' '}
            <button
              onClick={() => onSelectWallet('suspect')}
              className="inline-flex items-center space-x-1 text-xs bg-[#1f1a1a] hover:bg-[#2a2222] px-1.5 py-0.5 border border-[#443333] hover:border-[#884444] font-mono text-white transition cursor-pointer rounded-sm"
              title="Click to inspect Suspect Primary"
            >
              <span>0x7A92...F2D</span>
              <ArrowUpRight className="w-3 h-3 text-[#888888]" />
            </button>
            . Within 24 seconds, 100% of these funds were systematically split into three outgoing flows
            (Fan-out pattern). One stream was subsequently bridged from Ethereum onto Polygon PoS and
            deposited into Centralized Exchange Hotwallet{' '}
            <button
              onClick={() => onSelectWallet('exchange')}
              className="inline-flex items-center space-x-1 text-xs bg-[#1a1a1a] hover:bg-[#252525] px-1.5 py-0.5 border border-[#333333] hover:border-[#666666] font-mono text-white transition cursor-pointer rounded-sm"
              title="Click to inspect Exchange Endpoint"
            >
              <span>0xEXCH...4d401</span>
              <ArrowUpRight className="w-3 h-3 text-[#888888]" />
            </button>
            .
          </p>

          {/* Quick Incident Execution Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
            <div className="bg-[#141414] border border-[#222222] p-2.5">
              <span className="text-[10px] text-[#666666] block uppercase tracking-wider">
                Initial Inflow
              </span>
              <span className="text-white font-semibold block mt-0.5">10:31:04 UTC</span>
              <span className="text-[10px] text-[#888888]">$2,000 USDT</span>
            </div>
            <div className="bg-[#141414] border border-[#222222] p-2.5">
              <span className="text-[10px] text-[#666666] block uppercase tracking-wider">
                Fan-Out Velocity
              </span>
              <span className="text-white font-semibold block mt-0.5">24 Seconds</span>
              <span className="text-[10px] text-[#888888]">100% Disbursed</span>
            </div>
            <div className="bg-[#141414] border border-[#222222] p-2.5">
              <span className="text-[10px] text-[#666666] block uppercase tracking-wider">
                Bridge Hop Time
              </span>
              <span className="text-white font-semibold block mt-0.5">3 Seconds</span>
              <span className="text-[10px] text-[#888888]">L1 &rarr; Polygon PoS</span>
            </div>
            <div className="bg-[#141414] border border-[#222222] p-2.5">
              <span className="text-[10px] text-[#666666] block uppercase tracking-wider">
                CEX Liquidation
              </span>
              <span className="text-white font-semibold block mt-0.5">10:41:52 UTC</span>
              <span className="text-[10px] text-[#888888]">$680 Ingested</span>
            </div>
          </div>
        </div>

        {/* Section 02: Capital Dispersion & The Money Trail */}
        <div className="border border-[#222222] bg-[#111111] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222222] pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ffffff]">
                02 &mdash; Capital Dispersion &amp; The Money Trail
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#181818] border border-[#2a2a2a] text-[#888888] rounded">
                3 TRANCHES
              </span>
            </div>
            <span className="text-xs font-mono text-[#888888]">Total: $2,000 USDT</span>
          </div>

          {/* Proportional Monochrome Allocation Bar */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex h-3 w-full border border-[#333333] overflow-hidden bg-[#0c0c0c]">
              <div
                style={{ width: '40%' }}
                className="bg-[#ffffff] h-full border-r border-[#000000]"
                title="Branch A: Wallet B ($800 - 40%)"
              />
              <div
                style={{ width: '35%' }}
                className="bg-[#888888] h-full border-r border-[#000000]"
                title="Branch B: Wallet C ($700 - 35%)"
              />
              <div
                style={{ width: '25%' }}
                className="bg-[#383838] h-full"
                title="Branch C: Wallet D ($500 - 25%)"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#777777]">
              <span>Branch A: 40.0% ($800) Relay</span>
              <span>Branch B: 35.0% ($700) Bridge</span>
              <span>Branch C: 25.0% ($500) Parked</span>
            </div>
          </div>

          {/* 3 Interactive Branch Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Branch A: Wallet B */}
            <div className="border border-[#262626] bg-[#141414] p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-white text-black uppercase">
                    Branch A &bull; 40.0%
                  </span>
                  <span className="text-xs font-bold font-mono text-white">$800.00</span>
                </div>
                <div className="font-mono text-xs">
                  <span className="text-[#888888] text-[10px] block uppercase">Relay Address</span>
                  <button
                    onClick={() => onSelectWallet('walletB')}
                    className="text-white hover:underline flex items-center space-x-1 font-semibold cursor-pointer"
                  >
                    <span>Wallet B (0x82BC...c41A)</span>
                  </button>
                </div>
                <p className="text-xs text-[#aaaaaa] leading-relaxed">
                  Acted as high-velocity transit relay. Forwarded{' '}
                  <strong className="text-white font-mono">$760.00 (95.0%)</strong> to Downstream
                  Recipient within 4 minutes.
                </p>
              </div>

              <div className="pt-2 border-t border-[#222222] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#666666]">Residual: $40.00</span>
                <button
                  onClick={() => onSelectWallet('walletB')}
                  className="text-white hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>Inspect &rarr;</span>
                </button>
              </div>
            </div>

            {/* Branch B: Wallet C */}
            <div className="border border-[#262626] bg-[#141414] p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#888888] text-black uppercase">
                    Branch B &bull; 35.0%
                  </span>
                  <span className="text-xs font-bold font-mono text-white">$700.00</span>
                </div>
                <div className="font-mono text-xs">
                  <span className="text-[#888888] text-[10px] block uppercase">Bridge Feeder</span>
                  <button
                    onClick={() => onSelectWallet('walletC')}
                    className="text-white hover:underline flex items-center space-x-1 font-semibold cursor-pointer"
                  >
                    <span>Wallet C (0x19DE...a7C2)</span>
                  </button>
                </div>
                <p className="text-xs text-[#aaaaaa] leading-relaxed">
                  Bridge feeder. Routed funds through Demo Bridge to Polygon PoS, terminating with{' '}
                  <strong className="text-white font-mono">$680.00</strong> into CEX Hotwallet.
                </p>
              </div>

              <div className="pt-2 border-t border-[#222222] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#666666]">Residual: $18.00</span>
                <button
                  onClick={() => onSelectWallet('walletC')}
                  className="text-white hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>Inspect &rarr;</span>
                </button>
              </div>
            </div>

            {/* Branch C: Wallet D */}
            <div className="border border-[#262626] bg-[#141414] p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#383838] text-white uppercase">
                    Branch C &bull; 25.0%
                  </span>
                  <span className="text-xs font-bold font-mono text-white">$500.00</span>
                </div>
                <div className="font-mono text-xs">
                  <span className="text-[#888888] text-[10px] block uppercase">Parking Address</span>
                  <button
                    onClick={() => onSelectWallet('walletD')}
                    className="text-white hover:underline flex items-center space-x-1 font-semibold cursor-pointer"
                  >
                    <span>Wallet D (0x44AF...391B)</span>
                  </button>
                </div>
                <p className="text-xs text-[#aaaaaa] leading-relaxed">
                  Static parking wallet. Funds remain dormant with zero downstream movement observed.
                  Primary candidate for on-chain freeze.
                </p>
              </div>

              <div className="pt-2 border-t border-[#222222] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#ffffff] font-semibold">100% Retained ($500)</span>
                <button
                  onClick={() => onSelectWallet('walletD')}
                  className="text-white hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>Inspect &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 03: Why Is It Suspicious? (Algorithmic Behavioral Detections) */}
        <div className="border border-[#222222] bg-[#111111] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222222] pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#aaaaaa]">
                03 &mdash; Why Is It Suspicious?
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#181818] border border-[#2a2a2a] text-[#888888] rounded">
                BEHAVIORAL HEURISTICS
              </span>
            </div>
            <button
              onClick={() => onNavigate('detections')}
              className="text-xs font-mono text-[#888888] hover:text-white flex items-center space-x-1 cursor-pointer"
            >
              <span>View All 5 Detections</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="border border-[#242424] bg-[#141414] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#888888] uppercase block">
                  Temporal Compression
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#222222] text-white border border-[#333333] font-bold">
                  +25 PTS
                </span>
              </div>
              <p className="text-xs text-[#cccccc] leading-relaxed">
                Funds remained in the suspect wallet for less than 135 seconds before complete
                disbursement, indicating automated script execution.
              </p>
              <div className="pt-1.5 border-t border-[#202020]">
                <button
                  onClick={() => onNavigate('timeline')}
                  className="text-[11px] font-mono text-[#888888] hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  <span>Verify Chronology &rarr;</span>
                </button>
              </div>
            </div>

            <div className="border border-[#242424] bg-[#141414] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#888888] uppercase block">
                  Structural Splitting
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#222222] text-white border border-[#333333] font-bold">
                  +25 PTS
                </span>
              </div>
              <p className="text-xs text-[#cccccc] leading-relaxed">
                $2,000 was atomized into $800, $700, and $500 across 3 clean intermediary addresses
                to evade AML reporting thresholds.
              </p>
              <div className="pt-1.5 border-t border-[#202020]">
                <button
                  onClick={() => onNavigate('graph')}
                  className="text-[11px] font-mono text-[#888888] hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  <span>Inspect Fan-Out Graph &rarr;</span>
                </button>
              </div>
            </div>

            <div className="border border-[#242424] bg-[#141414] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#888888] uppercase block">
                  Cross-Chain Obfuscation
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#222222] text-white border border-[#333333] font-bold">
                  +18 PTS
                </span>
              </div>
              <p className="text-xs text-[#cccccc] leading-relaxed">
                Wallet C routed funds through the Polygon Bridge to sever direct L1 ledger
                continuity before centralized exchange deposit.
              </p>
              <div className="pt-1.5 border-t border-[#202020]">
                <button
                  onClick={() => onNavigate('crosschain')}
                  className="text-[11px] font-mono text-[#888888] hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  <span>Inspect Bridge Protocol &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 04: Actionable Law Enforcement / Compliance Interventions */}
        <div className="border border-[#262626] bg-[#131313] p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#222222] pb-2">
            <span className="font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <Shield className="w-3.5 h-3.5 text-white" />
              <span>04 &mdash; Actionable Forensic Interventions &amp; Preservation Targets</span>
            </span>
            <span className="text-[10px] text-[#888888]">3 TACTICAL TARGETS</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="bg-[#181818] border border-[#242424] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white uppercase text-[10px] px-1.5 py-0.2 bg-[#222222] border border-[#333333]">
                    CEX SUBPOENA
                  </span>
                  <span className="text-white font-semibold">
                    Centralized Exchange Hotwallet (0xEXCH...4d401)
                  </span>
                </div>
                <p className="text-[#888888] font-sans text-xs">
                  Serve emergency preservation order on exchange for internal deposit account KYC,
                  login IP logs, and associated fiat banking withdrawal accounts.
                </p>
              </div>
              <button
                onClick={() => onSelectWallet('exchange')}
                className="shrink-0 px-2.5 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-white border border-[#3a3a3a] text-[10px] font-bold uppercase transition cursor-pointer"
              >
                Inspect Target
              </button>
            </div>

            <div className="bg-[#181818] border border-[#242424] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white uppercase text-[10px] px-1.5 py-0.2 bg-[#222222] border border-[#333333]">
                    ASSET FREEZE
                  </span>
                  <span className="text-white font-semibold">
                    Static Intermediary Wallet D (0x44AF...391B)
                  </span>
                </div>
                <p className="text-[#888888] font-sans text-xs">
                  Holds $500.00 USDT static balance (25% of total theft). Submit urgent blacklisting
                  and freeze notice to Tether issuer.
                </p>
              </div>
              <button
                onClick={() => onSelectWallet('walletD')}
                className="shrink-0 px-2.5 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-white border border-[#3a3a3a] text-[10px] font-bold uppercase transition cursor-pointer"
              >
                Inspect Target
              </button>
            </div>

            <div className="bg-[#181818] border border-[#242424] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white uppercase text-[10px] px-1.5 py-0.2 bg-[#222222] border border-[#333333]">
                    BRIDGE AUDIT
                  </span>
                  <span className="text-white font-semibold">
                    Demo Bridge Liquidity Protocol (0xBR1D...c77E)
                  </span>
                </div>
                <p className="text-[#888888] font-sans text-xs">
                  Extract cross-chain relayer transaction records and analyze gas station funding
                  sources for the destination address on Polygon PoS.
                </p>
              </div>
              <button
                onClick={() => onSelectWallet('bridge')}
                className="shrink-0 px-2.5 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-white border border-[#3a3a3a] text-[10px] font-bold uppercase transition cursor-pointer"
              >
                Inspect Target
              </button>
            </div>
          </div>
        </div>

        {/* Section 05: Supporting Forensic Evidence Summary */}
        <div className="border border-[#222222] bg-[#111111] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#222222] pb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#aaaaaa]">
              05 &mdash; Supporting Forensic Evidence
            </span>
            <button
              onClick={() => onNavigate('evidence')}
              className="text-xs font-mono text-[#888888] hover:text-white flex items-center space-x-1 cursor-pointer"
            >
              <span>View All {DEMO_EVIDENCE.length} Items</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {DEMO_EVIDENCE.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('evidence')}
                className="border border-[#222222] bg-[#141414] hover:bg-[#1a1a1a] hover:border-[#3a3a3a] p-3 cursor-pointer transition space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-white">{item.id}</span>
                  <span className="text-[#888888]">{item.timestamp.split('T')[1]}</span>
                </div>
                <div className="text-xs font-semibold text-[#cccccc] truncate">{item.type}</div>
                <div className="text-[11px] font-mono text-[#888888]">
                  Confidence: <span className="text-white">{item.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 06: Recommended Next Actions & Workspaces */}
        <div className="border border-[#262626] bg-[#121212] p-5 space-y-4">
          <div className="border-b border-[#222222] pb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ffffff]">
              06 &mdash; Investigation Workspaces &amp; Next Steps
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('graph')}
              className="p-3.5 border border-[#262626] bg-[#161616] hover:bg-[#202020] hover:border-[#404040] text-left transition flex items-start space-x-3 group cursor-pointer"
            >
              <GitBranch className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white font-mono block group-hover:underline">
                  Transaction Graph &rarr;
                </span>
                <span className="text-[11px] text-[#888888] leading-tight block mt-0.5">
                  Inspect the interactive multi-hop fund flow across {DEMO_CASE.walletCount} entities.
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('timeline')}
              className="p-3.5 border border-[#262626] bg-[#161616] hover:bg-[#202020] hover:border-[#404040] text-left transition flex items-start space-x-3 group cursor-pointer"
            >
              <Clock className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white font-mono block group-hover:underline">
                  Forensic Timeline &rarr;
                </span>
                <span className="text-[11px] text-[#888888] leading-tight block mt-0.5">
                  Verify chronological transfer order and sub-minute intervals.
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('detections')}
              className="p-3.5 border border-[#262626] bg-[#161616] hover:bg-[#202020] hover:border-[#404040] text-left transition flex items-start space-x-3 group cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white font-mono block group-hover:underline">
                  Pattern Detections &rarr;
                </span>
                <span className="text-[11px] text-[#888888] leading-tight block mt-0.5">
                  Inspect {DEMO_DETECTIONS.length} algorithmic signatures with isolated subgraphs.
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('crosschain')}
              className="p-3.5 border border-[#262626] bg-[#161616] hover:bg-[#202020] hover:border-[#404040] text-left transition flex items-start space-x-3 group cursor-pointer"
            >
              <ArrowLeftRight className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white font-mono block group-hover:underline">
                  Cross-Chain Flow &rarr;
                </span>
                <span className="text-[11px] text-[#888888] leading-tight block mt-0.5">
                  Understand Ethereum to Polygon bridge execution within 3 seconds.
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('ai')}
              className="p-3.5 border border-[#262626] bg-[#161616] hover:bg-[#202020] hover:border-[#404040] text-left transition flex items-start space-x-3 group cursor-pointer"
            >
              <Bot className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white font-mono block group-hover:underline">
                  AI Investigator &rarr;
                </span>
                <span className="text-[11px] text-[#888888] leading-tight block mt-0.5">
                  Ask grounded questions with strict evidence references.
                </span>
              </div>
            </button>

            <button
              onClick={onOpenReport}
              className="p-3.5 border border-[#ffffff] bg-[#ffffff] text-[#000000] hover:bg-[#e0e0e0] text-left transition flex items-start space-x-3 group cursor-pointer"
            >
              <FileText className="w-5 h-5 text-[#000000] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#000000] font-mono block">
                  Generate Dossier &rarr;
                </span>
                <span className="text-[11px] text-[#444444] leading-tight block mt-0.5">
                  Export formal court-admissible PDF investigation dossier.
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
