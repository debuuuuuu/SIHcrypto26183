'use client';

import React, { useState, useRef } from 'react';
import {
  Printer,
  X,
  CheckCircle2,
  ShieldCheck,
  Building2,
  ArrowRight,
  Eye,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  FileText,
  Bookmark,
} from 'lucide-react';
import {
  DEMO_CASE,
  DEMO_WALLETS,
  DEMO_TRANSACTIONS,
  DEMO_DETECTIONS,
  DEMO_RISK_ASSESSMENT,
  DEMO_EVIDENCE,
  DEMO_CROSS_CHAIN_HOP,
  DEMO_RECOMMENDED_ACTIONS,
} from '@/data/demoInvestigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ForensicReportGraph } from './ForensicReportGraph';

import { InvestigationCase } from '@/types/investigation';

interface InvestigationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData?: InvestigationCase;
}

// Monochrome shades for the distribution chart
const MONO_FLOW_CHART = [
  { name: 'Victim Inflow', amount: 2000, fill: '#ffffff', printFill: '#111111' },
  { name: 'Wallet B (Split)', amount: 800, fill: '#cccccc', printFill: '#444444' },
  { name: 'Wallet C (Bridge)', amount: 700, fill: '#aaaaaa', printFill: '#666666' },
  { name: 'Wallet D (Parking)', amount: 500, fill: '#888888', printFill: '#888888' },
  { name: 'B Relay Outflow', amount: 760, fill: '#999999', printFill: '#555555' },
  { name: 'Polygon Release', amount: 698, fill: '#bbbbbb', printFill: '#666666' },
  { name: 'CEX Deposit', amount: 680, fill: '#ffffff', printFill: '#222222' },
];

export const InvestigationReportModal: React.FC<InvestigationReportModalProps> = ({
  isOpen,
  onClose,
  caseData,
}) => {
  const activeCase = caseData || DEMO_CASE;
  const [viewMode, setViewMode] = useState<'paper' | 'dark'>('paper');

  const [topologyTab, setTopologyTab] = useState<'graph' | 'volume'>('graph');
  const sheet2Ref = useRef<HTMLDivElement>(null);
  const sheet1Ref = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaper = viewMode === 'paper';

  const scrollToSheet = (sheet: 1 | 2) => {
    if (sheet === 1 && sheet1Ref.current) {
      sheet1Ref.current.scrollIntoView({ behavior: 'smooth' });
    } else if (sheet === 2 && sheet2Ref.current) {
      sheet2Ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]/95 backdrop-blur-md overflow-hidden font-sans select-none print:p-0 print:bg-white print:static print:overflow-visible">
      {/* =================================================================== */}
      {/* DEDICATED TOP VIEWER TOOLBAR (ALWAYS SLEEK, DARK, AND FIXED) */}
      {/* =================================================================== */}
      <header className="no-print h-14 bg-[#141414] border-b border-[#242424] px-4 sm:px-6 flex items-center justify-between shrink-0 z-50 text-white select-none">
        {/* Left: Document Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <FileText className="w-4 h-4 text-white" />
            <span className="font-extrabold uppercase tracking-wider hidden sm:inline">
              FORENSIC CASE DOSSIER
            </span>
            <span className="text-[#666666] hidden sm:inline">•</span>
            <span className="font-bold text-white bg-[#222222] px-2 py-0.5 rounded border border-[#333333]">
              {DEMO_CASE.caseId}
            </span>
          </div>

          <span className="hidden md:inline-flex items-center space-x-1.5 text-[10px] font-mono text-[#aaaaaa] px-2 py-0.5 rounded bg-[#1c1c1c] border border-[#2c2c2c]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>EVIDENCE SEALED</span>
          </span>
        </div>

        {/* Center: Mode Switcher & Page Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Dark Tactical vs A4 Paper Preview */}
          <div className="flex items-center rounded bg-[#1c1c1c] p-0.5 border border-[#303030] font-mono text-xs">
            <button
              onClick={() => setViewMode('paper')}
              className={`px-3 py-1 rounded transition cursor-pointer font-bold ${
                isPaper
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              A4 Paper Preview
            </button>
            <button
              onClick={() => setViewMode('dark')}
              className={`px-3 py-1 rounded transition cursor-pointer font-bold ${
                !isPaper
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Dark Tactical
            </button>
          </div>

          {/* Quick Page Jump in Paper Mode */}
          {isPaper && (
            <div className="hidden lg:flex items-center space-x-1 font-mono text-[11px] text-[#888888]">
              <button
                onClick={() => scrollToSheet(1)}
                className="px-2 py-1 bg-[#1a1a1a] hover:bg-[#252525] hover:text-white border border-[#333333] rounded cursor-pointer transition"
              >
                Page 1
              </button>
              <button
                onClick={() => scrollToSheet(2)}
                className="px-2 py-1 bg-[#1a1a1a] hover:bg-[#252525] hover:text-white border border-[#333333] rounded cursor-pointer transition"
              >
                Page 2
              </button>
            </div>
          )}
        </div>

        {/* Right: Print Action & Close */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-white hover:bg-[#e0e0e0] text-black px-4 py-1.5 rounded-sm text-xs font-bold font-mono transition cursor-pointer shadow-md"
            title="Print official dossier or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-black" />
            <span>Print / Export PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-[#888888] hover:text-white hover:bg-[#222222] rounded transition cursor-pointer"
            title="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* DOCUMENT PREVIEW WORKSPACE / DESK */}
      {/* =================================================================== */}
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center print:p-0 print:bg-white print:overflow-visible transition-colors ${
          isPaper ? 'bg-[#181818]' : 'bg-[#0a0a0a]'
        }`}
      >
        <div className="report-printable-container w-full flex flex-col items-center print:w-full">
          {/* =============================================================== */}
          {/* SHEET 1: EXECUTIVE SUMMARY & FLOW TOPOLOGY */}
          {/* =============================================================== */}
          <div
            ref={sheet1Ref}
            className={`print-sheet w-full max-w-[820px] transition-all duration-200 print:max-w-none print:w-full print:border-none print:shadow-none print-avoid-break ${
              isPaper
                ? 'bg-[#ffffff] text-[#111111] border border-[#d0d0d0] shadow-[0_12px_45px_rgba(0,0,0,0.65)] p-8 sm:p-12 mb-8'
                : 'bg-[#121212] text-[#ededed] border border-[#262626] shadow-2xl p-8 sm:p-12 mb-8'
            }`}
          >
            {/* Sheet 1 Header */}
            <div
              className={`border-b pb-6 space-y-3.5 ${
                isPaper ? 'border-[#cccccc]' : 'border-[#2c2c2c]'
              }`}
            >
              {/* Classification Banner */}
              <div
                className={`flex items-center justify-between px-3 py-1.5 rounded-sm font-mono text-[10px] tracking-wider uppercase font-bold border ${
                  isPaper
                    ? 'bg-[#f4f4f4] border-[#d8d8d8] text-[#111111]'
                    : 'bg-[#181818] border-[#303030] text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-black print:bg-black" />
                  <span>CONFIDENTIAL // LAW ENFORCEMENT &amp; REGULATORY SENSITIVE</span>
                </div>
                <span className="hidden sm:inline text-[#888888]">REF: SIH-2026-BIU-001</span>
              </div>

              {/* Department & Dossier Title */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 font-mono text-[10px] text-[#888888] uppercase tracking-widest font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>MONOMER FINANCIAL INTELLIGENCE UNIT (FIU)</span>
                  </div>
                  <h1
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight uppercase ${
                      isPaper ? 'text-black' : 'text-white'
                    }`}
                  >
                    Cryptocurrency Investigation Dossier
                  </h1>
                  <p className="text-xs text-[#888888] font-sans">
                    Automated Evidence Extraction, Transaction Graph Reconstruction &amp; Subpoena Target Analysis
                  </p>
                </div>

                {/* Case Stamp Box */}
                <div
                  className={`font-mono text-xs p-3 rounded border space-y-1 shrink-0 min-w-[190px] ${
                    isPaper
                      ? 'bg-[#f8f8f8] border-[#d4d4d4] text-[#222222]'
                      : 'bg-[#161616] border-[#2c2c2c] text-[#aaaaaa]'
                  }`}
                >
                  <div className="flex justify-between gap-4">
                    <span className="text-[#888888]">CASE ID:</span>
                    <span className={`font-bold ${isPaper ? 'text-black' : 'text-white'}`}>
                      {activeCase.caseId}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#888888]">NCRP ACK:</span>
                    <span className={`font-bold ${isPaper ? 'text-black' : 'text-blue-400'}`}>
                      {activeCase.ncrpAckNumber || '2026/NCRP/MH/09128'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#888888]">SAHYOG REF:</span>
                    <span className={`font-medium ${isPaper ? 'text-black' : 'text-white'}`}>
                      {activeCase.sahyogTicketId || 'I4C-SYG-2026-98124'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#888888]">DATE:</span>
                    <span>2026-09-21 10:45 UTC</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#888888]">STATUS:</span>
                    <span className="font-bold text-white bg-black px-1.5 py-0.2 rounded text-[10px]">
                      EVIDENCE SEALED
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Case Meta Bar */}
              <div
                className={`p-2.5 rounded-sm border font-mono text-xs flex flex-wrap items-center justify-between gap-2 ${
                  isPaper
                    ? 'bg-[#f6f6f6] border-[#e0e0e0]'
                    : 'bg-[#141414] border-[#262626]'
                }`}
              >
                <div>
                  <span className="text-[#888888] mr-1.5">INVESTIGATED HUB:</span>
                  <span className={`font-bold ${isPaper ? 'text-black' : 'text-white'}`}>
                    {activeCase.targetAddress}
                  </span>
                </div>
                <div>
                  <span className="text-[#888888] mr-1.5">COMPLAINANT / VICTIM:</span>
                  <span className="font-medium text-[#777777]">
                    {activeCase.complainantName || activeCase.reportingVictim}
                  </span>
                </div>
                <div>
                  <span className="text-[#888888] mr-1.5">CHAINS:</span>
                  <span className="font-bold text-white bg-[#222222] px-1.5 py-0.2 rounded text-[10px]">
                    {activeCase.chains.join(' + ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 1: Executive Forensic Summary */}
            <div className="space-y-3.5 pt-6">
              <div className="flex items-center justify-between border-b pb-1">
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isPaper ? 'text-black border-[#222222]' : 'text-white border-[#242424]'
                  }`}
                >
                  1. Executive Forensic Summary
                </h2>
                <span className="text-[10px] font-mono text-[#888888]">SECTION 01 // OVERVIEW</span>
              </div>

              <p className="text-xs leading-relaxed">
                On 2026-09-21 at 10:31:04 UTC, victim account{' '}
                <strong className={isPaper ? 'text-black font-mono' : 'text-white font-mono'}>
                  {DEMO_CASE.reportingVictim}
                </strong>{' '}
                reported an unauthorized fraudulent transfer of{' '}
                <strong className={isPaper ? 'text-black' : 'text-white'}>$2,000.00 USDT</strong> to suspect
                wallet{' '}
                <strong className={isPaper ? 'text-black font-mono' : 'text-white font-mono'}>
                  {DEMO_CASE.targetAddress}
                </strong>
                . Topological reconstruction demonstrated that 100% of the funds were systematically atomized
                within 24 seconds across three intermediary addresses: Wallet B ($800 USDT, 40.0%), Wallet C
                ($700 USDT, 35.0%), and Wallet D ($500 USDT, 25.0%).
              </p>

              <p className="text-xs leading-relaxed">
                Wallet C served as an active bridge feeder, routing its allocation through the Demo Bridge to
                Polygon POS (TX-DEMO-005 to 006). A net $680.00 USDT was subsequently deposited into a
                Centralized Exchange hotwallet (0xEXCH...401, TX-DEMO-008). In total,{' '}
                <strong className={isPaper ? 'text-black' : 'text-white'}>$1,180.00 USDT (59.0%)</strong> of
                the fraudulent sum remains actionable for immediate legal seizure and freeze.
              </p>

              {/* 4-Card Tactical Metric Scorecard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono text-xs">
                <div
                  className={`p-3 rounded border ${
                    isPaper
                      ? 'bg-[#f7f7f7] border-[#d8d8d8]'
                      : 'bg-[#161616] border-[#2a2a2a]'
                  }`}
                >
                  <span className="text-[9px] text-[#888888] uppercase tracking-wider block font-bold">
                    FRAUD INFLOW
                  </span>
                  <span
                    className={`text-base font-extrabold block mt-0.5 ${
                      isPaper ? 'text-black' : 'text-white'
                    }`}
                  >
                    $2,000.00
                  </span>
                  <span className="text-[10px] text-[#888888]">100% Accounted For</span>
                </div>

                <div
                  className={`p-3 rounded border ${
                    isPaper
                      ? 'bg-[#f7f7f7] border-[#d8d8d8]'
                      : 'bg-[#161616] border-[#2a2a2a]'
                  }`}
                >
                  <span className="text-[9px] text-[#888888] uppercase tracking-wider block font-bold">
                    OVERALL RISK SCORE
                  </span>
                  <span
                    className={`text-base font-extrabold block mt-0.5 ${
                      isPaper ? 'text-black' : 'text-white'
                    }`}
                  >
                    78 / 100
                  </span>
                  <span className="text-[10px] font-bold text-white bg-black px-1 rounded">
                    HIGH RISK
                  </span>
                </div>

                <div
                  className={`p-3 rounded border ${
                    isPaper
                      ? 'bg-[#f7f7f7] border-[#d8d8d8]'
                      : 'bg-[#161616] border-[#2a2a2a]'
                  }`}
                >
                  <span className="text-[9px] text-[#888888] uppercase tracking-wider block font-bold">
                    RECOVERABLE SUM
                  </span>
                  <span
                    className={`text-base font-extrabold block mt-0.5 ${
                      isPaper ? 'text-black' : 'text-white'
                    }`}
                  >
                    $1,180.00
                  </span>
                  <span className="text-[10px] text-[#888888]">59.0% Subpoena Target</span>
                </div>

                <div
                  className={`p-3 rounded border ${
                    isPaper
                      ? 'bg-[#f7f7f7] border-[#d8d8d8]'
                      : 'bg-[#161616] border-[#2a2a2a]'
                  }`}
                >
                  <span className="text-[9px] text-[#888888] uppercase tracking-wider block font-bold">
                    TOTAL VELOCITY
                  </span>
                  <span
                    className={`text-base font-extrabold block mt-0.5 ${
                      isPaper ? 'text-black' : 'text-white'
                    }`}
                  >
                    10m 48s
                  </span>
                  <span className="text-[10px] text-[#888888]">8 Txs / 2 Chains</span>
                </div>
              </div>
            </div>

            {/* Section 2: Fund Atomization & Liquidation Flow Architecture */}
            <div className="space-y-3.5 pt-6">
              <div className="flex items-center justify-between border-b pb-1">
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isPaper ? 'text-black border-[#222222]' : 'text-white border-[#242424]'
                  }`}
                >
                  2. Fund Atomization &amp; Liquidation Flow Architecture
                </h2>

                {/* Sub-view toggle for Section 2 */}
                <div className="no-print flex items-center space-x-1 font-mono text-[10px]">
                  <button
                    onClick={() => setTopologyTab('graph')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition ${
                      topologyTab === 'graph'
                        ? 'bg-black text-white font-bold'
                        : isPaper
                        ? 'text-[#666666] hover:text-black bg-[#f0f0f0]'
                        : 'text-[#888888] hover:text-white bg-[#1c1c1c]'
                    }`}
                  >
                    Topology Graph
                  </button>
                  <button
                    onClick={() => setTopologyTab('volume')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition ${
                      topologyTab === 'volume'
                        ? 'bg-black text-white font-bold'
                        : isPaper
                        ? 'text-[#666666] hover:text-black bg-[#f0f0f0]'
                        : 'text-[#888888] hover:text-white bg-[#1c1c1c]'
                    }`}
                  >
                    Volume Breakdown
                  </button>
                </div>

                <span className="print-only text-[10px] font-mono text-[#888888]">
                  SECTION 02 // TOPOLOGY
                </span>
              </div>

              {/* View 1: Forensic Multi-Tier Topology Graph */}
              {(topologyTab === 'graph' || isPaper) && (
                <div className="space-y-2">
                  <ForensicReportGraph isPaper={isPaper} />
                  <p className="text-[10px] font-mono text-[#888888] text-center">
                    Figure 1: Reconstructed multi-hop cryptocurrency flow topology from Victim origin to Centralized Exchange endpoint
                  </p>
                </div>
              )}

              {/* View 2: Quantitative Tranche Bar Chart */}
              {(topologyTab === 'volume' && !isPaper) && (
                <div
                  className={`p-4 rounded border ${
                    isPaper
                      ? 'bg-[#fafafa] border-[#dedede]'
                      : 'bg-[#141414] border-[#262626]'
                  }`}
                >
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={MONO_FLOW_CHART}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: isPaper ? '#333333' : '#888888',
                            fontSize: 9,
                            fontFamily: 'monospace',
                          }}
                          axisLine={{ stroke: isPaper ? '#cccccc' : '#333333' }}
                        />
                        <YAxis
                          tick={{
                            fill: isPaper ? '#333333' : '#888888',
                            fontSize: 9,
                            fontFamily: 'monospace',
                          }}
                          axisLine={{ stroke: isPaper ? '#cccccc' : '#333333' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isPaper ? '#ffffff' : '#181818',
                            borderColor: isPaper ? '#cccccc' : '#383838',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: isPaper ? '#000000' : '#ffffff',
                            fontFamily: 'monospace',
                          }}
                          formatter={(val: any) => [`$${val} USDT`, 'Volume']}
                        />
                        <Bar dataKey="amount" radius={[2, 2, 0, 0]}>
                          {MONO_FLOW_CHART.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={isPaper ? entry.printFill : entry.fill}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] font-mono text-[#888888] text-center mt-2">
                    Figure 2: Tranche distribution volumes and cross-chain liquidation trail (USDT equivalent)
                  </p>
                </div>
              )}
            </div>

            {/* Sheet 1 Footer */}
            <div
              className={`pt-6 mt-6 border-t flex items-center justify-between text-[9px] font-mono text-[#888888] ${
                isPaper ? 'border-[#e0e0e0]' : 'border-[#242424]'
              }`}
            >
              <span>MONOMER FINANCIAL INTELLIGENCE UNIT (FIU)</span>
              <span>PAGE 1 OF 2 &bull; EXECUTIVE SUMMARY &amp; FLOW TOPOLOGY</span>
              <span>CASE: {DEMO_CASE.caseId}</span>
            </div>
          </div>

          {/* =============================================================== */}
          {/* PRINT PAGE BREAK DIVIDER */}
          {/* =============================================================== */}
          <div className="print-page-break w-full max-w-[820px] flex items-center justify-center my-2 no-print">
            <div className="flex items-center space-x-3 text-[10px] font-mono text-[#666666] uppercase tracking-wider py-1 px-3 bg-[#111111] border border-[#282828] rounded-full">
              <span>Page Break</span>
              <span>&bull;</span>
              <span>Page 2 of 2 Starts Below</span>
            </div>
          </div>

          {/* =============================================================== */}
          {/* SHEET 2: EVIDENCE REGISTRY, TRANSACTION LEDGER & ATTESTATION */}
          {/* =============================================================== */}
          <div
            ref={sheet2Ref}
            className={`print-sheet w-full max-w-[820px] transition-all duration-200 print:max-w-none print:w-full print:border-none print:shadow-none print-avoid-break ${
              isPaper
                ? 'bg-[#ffffff] text-[#111111] border border-[#d0d0d0] shadow-[0_12px_45px_rgba(0,0,0,0.65)] p-8 sm:p-12 mb-12'
                : 'bg-[#121212] text-[#ededed] border border-[#262626] shadow-2xl p-8 sm:p-12 mb-12'
            }`}
          >
            {/* Sheet 2 Running Header */}
            <div
              className={`border-b pb-3 flex items-center justify-between font-mono text-[10px] text-[#888888] ${
                isPaper ? 'border-[#e0e0e0]' : 'border-[#242424]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-bold text-black print:text-black">
                  {DEMO_CASE.caseName} ({DEMO_CASE.caseId})
                </span>
              </div>
              <span className="uppercase font-bold text-black print:text-black">
                PAGE 2 OF 2 &bull; EVIDENCE, LEDGER &amp; STATUTORY RELIEF
              </span>
            </div>

            {/* Section 3: Sealed Cryptographic Evidence Registry */}
            <div className="space-y-3 pt-6">
              <div className="flex items-center justify-between border-b pb-1">
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isPaper ? 'text-black border-[#222222]' : 'text-white border-[#242424]'
                  }`}
                >
                  3. Sealed Cryptographic Evidence Registry (Chain of Custody)
                </h2>
                <span className="text-[10px] font-mono text-[#888888]">SECTION 03 // ADMISSIBILITY</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] border-collapse">
                  <thead>
                    <tr
                      className={`border-b text-[9px] uppercase tracking-wider ${
                        isPaper
                          ? 'bg-[#f4f4f4] border-[#cccccc] text-black font-bold'
                          : 'bg-[#181818] border-[#2c2c2c] text-[#aaaaaa]'
                      }`}
                    >
                      <th className="py-2 px-2.5">EVD ID</th>
                      <th className="py-2 px-2.5">EVIDENTIARY CLASSIFICATION</th>
                      <th className="py-2 px-2.5">SOURCE TX</th>
                      <th className="py-2 px-2.5">CUSTODY TIMESTAMP</th>
                      <th className="py-2 px-2.5">CRYPTOGRAPHIC VERIFICATION</th>
                      <th className="py-2 px-2.5 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isPaper
                        ? 'divide-[#e4e4e4] text-[#222222]'
                        : 'divide-[#1f1f1f] text-[#cccccc]'
                    }`}
                  >
                    {DEMO_EVIDENCE.map((e) => (
                      <tr key={e.id} className="hover:bg-black/5 transition-colors">
                        <td className="py-2 px-2.5 font-bold text-white bg-black print:bg-[#f0f0f0] print:text-black">
                          {e.id}
                        </td>
                        <td className="py-2 px-2.5 font-medium">{e.type}</td>
                        <td className="py-2 px-2.5 font-mono text-[#777777]">{e.sourceTxId}</td>
                        <td className="py-2 px-2.5">{e.timestamp}</td>
                        <td className="py-2 px-2.5 font-mono text-[#777777] truncate max-w-[140px]">
                          {e.sourceHash}
                        </td>
                        <td className="py-2 px-2.5 text-right">
                          <span className="font-bold bg-black text-white px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider print:border print:border-black">
                            {e.confidence}% ADMISSIBLE
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Reconstructed Forensic Transaction Ledger */}
            <div className="space-y-3 pt-6">
              <div className="flex items-center justify-between border-b pb-1">
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isPaper ? 'text-black border-[#222222]' : 'text-white border-[#242424]'
                  }`}
                >
                  4. Reconstructed Forensic Transaction Ledger
                </h2>
                <span className="text-[10px] font-mono text-[#888888]">SECTION 04 // LEDGER</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] border-collapse">
                  <thead>
                    <tr
                      className={`border-b text-[9px] uppercase tracking-wider ${
                        isPaper
                          ? 'bg-[#f4f4f4] border-[#cccccc] text-black font-bold'
                          : 'bg-[#181818] border-[#2c2c2c] text-[#aaaaaa]'
                      }`}
                    >
                      <th className="py-2 px-2">HOP</th>
                      <th className="py-2 px-2">TX ID</th>
                      <th className="py-2 px-2">TIME (UTC)</th>
                      <th className="py-2 px-2">CHAIN</th>
                      <th className="py-2 px-2">FLOW ROUTE</th>
                      <th className="py-2 px-2 text-right">VOLUME</th>
                      <th className="py-2 px-2">PATTERN TAG</th>
                      <th className="py-2 px-2">TX HASH</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isPaper
                        ? 'divide-[#e4e4e4] text-[#222222]'
                        : 'divide-[#1f1f1f] text-[#cccccc]'
                    }`}
                  >
                    {DEMO_TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="hover:bg-black/5 transition-colors">
                        <td className="py-2 px-2 text-[#777777]">#{tx.hopIndex}</td>
                        <td
                          className={`py-2 px-2 font-bold ${
                            isPaper ? 'text-black' : 'text-white'
                          }`}
                        >
                          {tx.id}
                        </td>
                        <td className="py-2 px-2 text-[#777777]">{tx.timestamp.replace(' UTC', '')}</td>
                        <td className="py-2 px-2">
                          <span
                            className={`px-1 py-0.2 rounded text-[9px] ${
                              tx.chain === 'Ethereum'
                                ? 'bg-[#222222] text-white print:bg-[#e8e8e8] print:text-black'
                                : 'bg-black text-white font-bold print:border print:border-black'
                            }`}
                          >
                            {tx.chain}
                          </span>
                        </td>
                        <td className="py-2 px-2 font-medium">
                          {DEMO_WALLETS[tx.from]?.label} &rarr; {DEMO_WALLETS[tx.to]?.label}
                        </td>
                        <td
                          className={`py-2 px-2 text-right font-bold ${
                            isPaper ? 'text-black' : 'text-white'
                          }`}
                        >
                          {tx.amountFormatted}
                        </td>
                        <td className="py-2 px-2">
                          <span className="text-[9px] font-mono text-[#777777]">
                            {tx.patternTag}
                          </span>
                        </td>
                        <td className="py-2 px-2 font-mono text-[#777777] truncate max-w-[100px]">
                          {tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 5: Centralized Exchange Off-Ramp Subpoena Schedule */}
            <div className="space-y-3 pt-6">
              <div className="flex items-center justify-between border-b pb-1">
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isPaper ? 'text-black border-[#222222]' : 'text-white border-[#242424]'
                  }`}
                >
                  5. Centralized Exchange Off-Ramp Subpoena Schedule
                </h2>
                <span className="text-[10px] font-mono text-[#888888]">SECTION 05 // ACTIONABLE LE</span>
              </div>

              <div
                className={`p-4 rounded border font-mono text-xs space-y-3 ${
                  isPaper
                    ? 'bg-[#f8f8f8] border-[#333333]'
                    : 'bg-[#151515] border-[#383838]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-black print:text-black" />
                    <span
                      className={`font-extrabold uppercase tracking-wider ${
                        isPaper ? 'text-black' : 'text-white'
                      }`}
                    >
                      TARGET CEX: DEMO EXCHANGE (OFF-RAMP GATEWAY)
                    </span>
                  </div>
                  <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase">
                    HIGH PRIORITY INTERCEPTION
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#777777]">TARGET DEPOSIT ADDRESS:</span>
                      <span className={`font-bold ${isPaper ? 'text-black' : 'text-white'}`}>
                        0xEXCH401829fbc789123ccae874019
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#777777]">INGESTION TRANSACTION:</span>
                      <span className="font-bold text-white bg-black px-1 rounded">
                        TX-DEMO-008
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#777777]">INGESTION AMOUNT:</span>
                      <span className={`font-bold ${isPaper ? 'text-black' : 'text-white'}`}>
                        $680.00 USDT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#777777]">BLOCKCHAIN NETWORK:</span>
                      <span>Polygon PoS (Block #56981288)</span>
                    </div>
                  </div>

                  <div
                    className={`p-2.5 rounded border text-[10px] space-y-1 ${
                      isPaper
                        ? 'bg-white border-[#d8d8d8] text-[#333333]'
                        : 'bg-[#111111] border-[#2c2c2c] text-[#cccccc]'
                    }`}
                  >
                    <span className="font-bold block uppercase tracking-wider text-[#888888]">
                      RECOMMENDED STATUTORY RELIEF
                    </span>
                    <p className="leading-tight">
                      • Request formal 18 U.S.C. § 2703(f) / Section 91 CrPC Record Preservation.
                    </p>
                    <p className="leading-tight">
                      • Intercept linked KYC records (Full Name, Government ID, Bank Account/Wire, IP logs).
                    </p>
                    <p className="leading-tight">
                      • Issue immediate administrative asset freeze on internal UID linked to deposit address.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Behavioral Pattern Detections */}
            <div className="space-y-3 pt-6">
              <div className="flex items-center justify-between border-b pb-1">
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isPaper ? 'text-black border-[#222222]' : 'text-white border-[#242424]'
                  }`}
                >
                  6. Confirmed Behavioral Pattern Detections
                </h2>
                <span className="text-[10px] font-mono text-[#888888]">SECTION 06 // PATTERNS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                {DEMO_DETECTIONS.map((d) => (
                  <div
                    key={d.id}
                    className={`p-3 rounded border space-y-1 ${
                      isPaper
                        ? 'bg-[#fafafa] border-[#dedede]'
                        : 'bg-[#161616] border-[#2c2c2c]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`font-bold ${isPaper ? 'text-black' : 'text-white'}`}
                      >
                        {d.title}
                      </span>
                      <span className="text-[10px] bg-black text-white font-extrabold px-1.5 py-0.2 rounded print:border print:border-black">
                        {d.confidence}% CONF
                      </span>
                    </div>
                    <p className="text-[11px] text-[#777777] font-sans leading-tight">
                      {d.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 7: Official Forensic Attestation Seal & Physical Signatures */}
            <div
              className={`pt-8 mt-8 border-t space-y-6 ${
                isPaper ? 'border-[#cccccc]' : 'border-[#2c2c2c]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                {/* Seal Stamp */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center font-mono font-extrabold text-[8px] tracking-tighter uppercase shrink-0 ${
                      isPaper
                        ? 'border-black text-black'
                        : 'border-white text-white'
                    }`}
                  >
                    <span>MONOMER</span>
                    <span>SEALED</span>
                    <span>2026</span>
                  </div>
                  <div>
                    <span className="font-bold block uppercase tracking-wider text-black print:text-black">
                      CRYPTOGRAPHICALLY ATTESTED EVIDENCE
                    </span>
                    <span className="text-[10px] text-[#777777] block">
                      HASH: SHA256-8F2901BCE774910AA82CF019BCE84210
                    </span>
                    <span className="text-[9px] text-[#888888] block">
                      Admissible under Federal Rules of Evidence Rule 902(13) / Section 65B
                    </span>
                  </div>
                </div>

                {/* Official Blank Signature Lines for Physical Attestation */}
                <div className="flex items-center space-x-8 text-[10px]">
                  <div className="space-y-1.5">
                    <div
                      className={`w-40 h-8 border-b-2 flex items-end justify-start pb-0.5 font-mono text-[9px] ${
                        isPaper ? 'border-black text-[#888888]' : 'border-[#555555] text-[#777777]'
                      }`}
                    >
                      X _____________________
                    </div>
                    <div>
                      <span className={`block font-bold uppercase tracking-wider ${isPaper ? 'text-black' : 'text-white'}`}>
                        LEAD EXAMINER
                      </span>
                      <span className="text-[9px] text-[#888888] block">
                        Signature &amp; Date
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className={`w-40 h-8 border-b-2 flex items-end justify-start pb-0.5 font-mono text-[9px] ${
                        isPaper ? 'border-black text-[#888888]' : 'border-[#555555] text-[#777777]'
                      }`}
                    >
                      X _____________________
                    </div>
                    <div>
                      <span className={`block font-bold uppercase tracking-wider ${isPaper ? 'text-black' : 'text-white'}`}>
                        SUPERVISING AGENT
                      </span>
                      <span className="text-[9px] text-[#888888] block">
                        Counter-Signature &amp; Seal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Notice */}
              <div className="text-center font-mono text-[9px] text-[#888888] space-y-0.5 border-t border-[#e0e0e0] pt-4">
                <p className="font-bold text-black print:text-black uppercase">
                  MONOMER CRYPTOCURRENCY FRAUD TRACING PLATFORM &bull; CASE DOSSIER
                </p>
                <p>
                  SMART INDIA HACKATHON 2026 &bull; SIMULATED DATASET ({DEMO_CASE.caseId}) &bull; EVIDENCE SEALED
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
