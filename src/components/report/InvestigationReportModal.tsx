'use client';

import React, { useState, useRef } from 'react';
import {
  Printer,
  X,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  FileText,
  FileCheck2,
  Lock,
} from 'lucide-react';
import {
  DEMO_CASE,
  DEMO_WALLETS,
  DEMO_TRANSACTIONS,
  DEMO_DETECTIONS,
  DEMO_EVIDENCE,
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

const MONO_FLOW_CHART = [
  { name: 'Victim Inflow', amount: 2000, fill: '#111216', printFill: '#111216' },
  { name: 'Wallet B (Split)', amount: 800, fill: '#52525B', printFill: '#52525B' },
  { name: 'Wallet C (Bridge)', amount: 700, fill: '#71717A', printFill: '#71717A' },
  { name: 'Wallet D (Parking)', amount: 500, fill: '#A1A1AA', printFill: '#A1A1AA' },
  { name: 'B Relay Outflow', amount: 760, fill: '#71717A', printFill: '#71717A' },
  { name: 'Polygon Release', amount: 698, fill: '#52525B', printFill: '#52525B' },
  { name: 'CEX Deposit', amount: 680, fill: '#111216', printFill: '#111216' },
];

export const InvestigationReportModal: React.FC<InvestigationReportModalProps> = ({
  isOpen,
  onClose,
  caseData,
}) => {
  const activeCase = caseData || DEMO_CASE;
  const [viewMode, setViewMode] = useState<'paper' | 'dark'>('paper');
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [topologyTab, setTopologyTab] = useState<'graph' | 'volume'>('graph');
  const sheet2Ref = useRef<HTMLDivElement>(null);
  const sheet1Ref = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# IN THE COURT OF THE PRINCIPAL DISTRICT & SESSIONS JUDGE / SPECIAL CYBER COURT
## FORENSIC INVESTIGATION CERTIFICATE UNDER SECTION 65B INDIAN EVIDENCE ACT / SECTION 63 BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023

**CASE ID:** ${activeCase.caseId}
**NCRP ACK NO:** ${activeCase.ncrpAckNumber || '2026/NCRP/MH/09128'}
**SAHYOG TICKET:** ${activeCase.sahyogTicketId || 'I4C-SYG-2026-98124'}
**POLICE STATION:** CYBER CRIME POLICE STATION, CID / CRIME BRANCH
**FIR NUMBER:** FIR NO. 412/2026 U/S 66D IT ACT, SEC 318(4) BNS
**TARGET WALLET:** ${activeCase.targetAddress}
**REPORTING VICTIM:** ${activeCase.complainantName || activeCase.reportingVictim}
**DATE OF EXTRACTION:** 2026-09-21 10:45:00 UTC
**CRYPTOGRAPHIC HASH (SHA-256):** 8F2901BCE774910AA82CF019BCE84210

---

### 1. COURT HEADING & STATUTORY JURISDICTION
This digital forensic extraction dossier is formally submitted in the Special Court for Cyber Crimes under Section 65B of the Indian Evidence Act, 1872 / Section 63 of Bharatiya Sakshya Adhiniyam, 2023, certifying the authenticity, integrity, and non-tampering of blockchain transaction records extracted through MONOMER Forensic Suite.

### 2. POLICE / FIR REFERENCE & COMPLAINANT STATEMENT
On 2026-09-21 at 10:31:04 UTC, the victim (${activeCase.reportingVictim}) was induced through a cyber task fraud / investment scam to transfer **$2,000.00 USDT** to suspect address \`${activeCase.targetAddress}\`.

### 3. RECONSTRUCTED FUND MOVEMENT LEDGER
| Hop | Tx ID | Time (UTC) | Chain | Flow Route | Amount (USDT) | Tx Hash |
|-----|-------|------------|-------|------------|---------------|---------|
| #1 | TX-DEMO-001 | 14:21:08 | Ethereum | Victim -> Suspect | $2,000.00 | 0x7b3e819fa002491a... |
| #2 | TX-DEMO-002 | 14:21:31 | Ethereum | Suspect -> Wallet B | $800.00 | 0x9a10f8241cd99120... |
| #3 | TX-DEMO-003 | 14:21:42 | Ethereum | Suspect -> Wallet C | $700.00 | 0x3d8102a9cfb10284... |
| #4 | TX-DEMO-004 | 14:21:55 | Ethereum | Suspect -> Wallet D | $500.00 | 0x51c90018fa021029... |
| #5 | TX-DEMO-005 | 14:22:15 | Ethereum | Wallet C -> Demo Bridge | $700.00 | 0x6e902181af4029bc... |
| #6 | TX-DEMO-006 | 14:23:24 | Polygon | Demo Bridge -> Polygon Wallet | $698.00 | 0x7001928bcdeaa102... |
| #7 | TX-DEMO-007 | 14:23:45 | Ethereum | Wallet B -> Intermediary Relay | $760.00 | 0x8192a00192bce819... |
| #8 | TX-DEMO-008 | 14:24:17 | Polygon | Polygon Wallet -> Demo Exchange CEX | $680.00 | 0x4e83917bc1290371... |

### 4. VASP ATTRIBUTION & FREEZE SCHEDULE (SECTION 91 CrPC)
- **Target VASP:** Demo Exchange (Global Custodial CEX / FIU-IND Registered)
- **Deposit Forwarder:** \`0x98EF7712a04812fB8\`
- **CEX Omnibus Hotwallet:** \`0x28C6c06298d514Db089934071355E5743bf21d60\`
- **Terminal Inflow:** $680.00 USDT via TX-DEMO-008
- **Urgent Action:** Notice under Section 91 CrPC / 18 U.S.C. § 2703(f) to freeze internal user account UID and provide KYC / IP connection logs.

### 5. SECTION 65B / BSA SECTION 63 STATUTORY CERTIFICATE
I hereby certify that the electronic records detailed above were produced by computer systems regularly utilized in lawful cyber investigations. During this period, the computers were operating properly without malfunction that could compromise data integrity.

**EXAMINING OFFICER:** Deputy Superintendent of Police / Cyber Crime Special Unit
**SYSTEM SEAL:** MONOMER-SEC65B-CERTIFIED-2026
**EVIDENCE HASH:** SHA256: 8F2901BCE774910AA82CF019BCE84210
`;
    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
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
    <div className="fixed inset-0 z-50 flex flex-col bg-obsidian-950/95 backdrop-blur-md overflow-hidden font-sans select-none print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Top Fixed Header */}
      <header className="no-print h-[52px] bg-obsidian-950 border-b border-obsidian-750 px-4 sm:px-6 flex items-center justify-between shrink-0 z-50 text-sand-100 select-none">
        {/* Left: Document Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <FileText className="w-4 h-4 text-sand-100" />
            <span className="font-bold uppercase tracking-wider hidden sm:inline text-sand-100">
              SECTION 65B FORENSIC DOSSIER
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="font-bold text-sand-100 bg-obsidian-850 px-2 py-0.5 rounded-[4px] border border-obsidian-750">
              {DEMO_CASE.caseId}
            </span>
          </div>

          <span className="hidden md:inline-flex items-center space-x-1.5 text-[10px] font-mono text-sand-300 px-2 py-0.5 rounded-[4px] bg-obsidian-850 border border-sand-850">
            <span className="w-1.5 h-1.5 rounded-full bg-sand-100" />
            <span>CERTIFIED EVIDENCE</span>
          </span>
        </div>

        {/* Center: Mode Switcher & Page Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Paper Document vs Dark Preview */}
          <div className="flex items-center rounded-[4px] bg-obsidian-900 p-0.5 border border-obsidian-750 font-mono text-xs">
            <button
              onClick={() => setViewMode('paper')}
              className={`px-3 py-1 rounded-[4px] transition cursor-pointer font-bold ${
                isPaper
                  ? 'bg-sand-100 text-obsidian-950'
                  : 'text-zinc-400 hover:text-sand-100'
              }`}
            >
              Legal Document
            </button>
            <button
              onClick={() => setViewMode('dark')}
              className={`px-3 py-1 rounded-[4px] transition cursor-pointer font-bold ${
                !isPaper
                  ? 'bg-sand-100 text-obsidian-950'
                  : 'text-zinc-400 hover:text-sand-100'
              }`}
            >
              Dark Terminal
            </button>
          </div>

          {/* Quick Page Jump in Paper Mode */}
          {isPaper && (
            <div className="hidden lg:flex items-center space-x-1 font-mono text-[11px] text-zinc-400">
              <button
                onClick={() => scrollToSheet(1)}
                className="px-2 py-1 bg-obsidian-900 hover:bg-obsidian-850 hover:text-sand-100 border border-obsidian-750 rounded-[4px] cursor-pointer transition"
              >
                Sheet 1
              </button>
              <button
                onClick={() => scrollToSheet(2)}
                className="px-2 py-1 bg-obsidian-900 hover:bg-obsidian-850 hover:text-sand-100 border border-obsidian-750 rounded-[4px] cursor-pointer transition"
              >
                Sheet 2
              </button>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-1.5 bg-obsidian-900 hover:bg-obsidian-850 text-sand-300 hover:text-sand-100 border border-obsidian-750 px-3 py-1.5 rounded-[4px] text-xs font-mono transition cursor-pointer"
            title="Copy plain markdown dossier"
          >
            {copiedMarkdown ? (
              <>
                <Check className="w-3.5 h-3.5 text-sand-100" />
                <span className="text-sand-100 font-bold">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY MARKDOWN</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-sand-100 hover:bg-sand-300 text-obsidian-950 px-3.5 py-1.5 rounded-[4px] text-xs font-bold font-mono transition cursor-pointer"
            title="Print official dossier or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / SAVE PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-sand-100 hover:bg-obsidian-850 rounded-[4px] transition cursor-pointer"
            title="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Document Workspace */}
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center print:p-0 print:bg-white print:overflow-visible transition-colors ${
          isPaper ? 'bg-obsidian-950' : 'bg-obsidian-950'
        }`}
      >
        <div className="report-printable-container w-full flex flex-col items-center print:w-full">
          {/* SHEET 1: EXECUTIVE SUMMARY & FLOW TOPOLOGY */}
          <div
            ref={sheet1Ref}
            className={`print-sheet w-full max-w-[840px] transition-all duration-200 print:max-w-none print:w-full print:border-none print:shadow-none print-avoid-break mb-8 ${
              isPaper
                ? 'bg-[#F4F0E8] text-[#111216] border border-[#C4B9A3] shadow-[0_12px_40px_rgba(0,0,0,0.45)] p-8 sm:p-12 rounded-[6px]'
                : 'bg-obsidian-900 text-sand-100 border border-obsidian-750 shadow-2xl p-8 sm:p-12 rounded-[6px]'
            }`}
          >
            {/* Sheet 1 Header */}
            <div
              className={`border-b pb-6 space-y-3.5 ${
                isPaper ? 'border-[#C4B9A3]' : 'border-obsidian-750'
              }`}
            >
              {/* Classification Banner */}
              <div
                className={`flex items-center justify-between px-3 py-1.5 rounded-[4px] font-mono text-[10px] tracking-wider uppercase font-bold border ${
                  isPaper
                    ? 'bg-[#EAE4D7] border-[#C4B9A3] text-[#111216]'
                    : 'bg-obsidian-850 border-obsidian-750 text-sand-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#111216]" />
                  <span>CONFIDENTIAL // LAW ENFORCEMENT &amp; JUDICIAL SUBMISSION</span>
                </div>
                <span className="hidden sm:inline text-zinc-600">REF: SIH-2026-BIU-001</span>
              </div>

              {/* Court Heading & Police Station */}
              <div className="space-y-1 pt-1 text-center border-b pb-4 border-current/15">
                <span className="text-[10px] font-mono uppercase tracking-widest block font-bold text-zinc-600">
                  IN THE COURT OF THE PRINCIPAL DISTRICT &amp; SESSIONS JUDGE / SPECIAL CYBER COURT
                </span>
                <h1
                  className={`text-xl sm:text-2xl font-extrabold tracking-tight uppercase ${
                    isPaper ? 'text-[#111216]' : 'text-sand-100'
                  }`}
                >
                  Cryptocurrency Investigation Dossier
                </h1>
                <p className="text-xs font-mono text-zinc-600">
                  Under Section 65B Indian Evidence Act, 1872 / Section 63 Bharatiya Sakshya Adhiniyam, 2023
                </p>
              </div>

              {/* Case Stamp Box & Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div
                  className={`p-3 rounded-[4px] border space-y-1.5 ${
                    isPaper
                      ? 'bg-[#EAE4D7]/70 border-[#C4B9A3]'
                      : 'bg-obsidian-850 border-obsidian-750'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-zinc-600">POLICE STATION:</span>
                    <span className="font-bold">CYBER CRIME POLICE STATION, CID</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">FIR NUMBER:</span>
                    <span className="font-bold">FIR NO. 412/2026 U/S 66D IT ACT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">PENAL PROVISIONS:</span>
                    <span>SEC 318(4) &amp; 319(2) BNS</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-[4px] border space-y-1.5 ${
                    isPaper
                      ? 'bg-[#EAE4D7]/70 border-[#C4B9A3]'
                      : 'bg-obsidian-850 border-obsidian-750'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-zinc-600">CASE ID:</span>
                    <span className="font-bold">{activeCase.caseId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">NCRP ACK NO:</span>
                    <span className="font-bold">{activeCase.ncrpAckNumber || '2026/NCRP/MH/09128'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">SAHYOG TICKET:</span>
                    <span className="font-medium">{activeCase.sahyogTicketId || 'I4C-SYG-2026-98124'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1: Executive Forensic Summary */}
            <div className="space-y-3.5 pt-6">
              <div className="flex items-center justify-between border-b pb-1 border-current/15">
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isPaper ? 'text-[#111216]' : 'text-sand-100'
                  }`}
                >
                  1. Executive Forensic Summary &amp; Complainant Statement
                </h2>
                <span className="text-[10px] font-mono text-zinc-600">SECTION 01 // OVERVIEW</span>
              </div>

              <p className="text-xs leading-relaxed font-sans">
                On 2026-09-21 at 10:31:04 UTC, complainant{' '}
                <strong className={isPaper ? 'text-[#111216] font-mono' : 'text-sand-100 font-mono'}>
                  {DEMO_CASE.reportingVictim}
                </strong>{' '}
                reported an unauthorized fraudulent transfer of{' '}
                <strong className={isPaper ? 'text-[#111216]' : 'text-sand-100'}>$2,000.00 USDT</strong> to suspect
                wallet{' '}
                <strong className={isPaper ? 'text-[#111216] font-mono' : 'text-sand-100 font-mono'}>
                  {DEMO_CASE.targetAddress}
                </strong>
                . Automated topological analysis verified that 100% of the funds were systematically atomized
                within 24 seconds across three intermediary addresses: Wallet B ($800 USDT, 40.0%), Wallet C
                ($700 USDT, 35.0%), and Wallet D ($500 USDT, 25.0%).
              </p>

              <p className="text-xs leading-relaxed font-sans">
                Wallet C served as an active bridge feeder, routing its allocation through the Demo Bridge to
                Polygon PoS (TX-DEMO-005 to TX-DEMO-006). A net $680.00 USDT was subsequently deposited into a
                Centralized Exchange hotwallet (0x28C...556D / CLS-VASP-POLYGON-001, TX-DEMO-008). In total,{' '}
                <strong className={isPaper ? 'text-[#111216]' : 'text-sand-100'}>$1,180.00 USDT (59.0%)</strong> of
                the fraudulent sum remains actionable for immediate statutory freeze under Section 91 CrPC.
              </p>

              {/* 4-Card Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono text-xs">
                <div
                  className={`p-3 rounded-[4px] border ${
                    isPaper
                      ? 'bg-[#EAE4D7]/70 border-[#C4B9A3]'
                      : 'bg-obsidian-850 border-obsidian-750'
                  }`}
                >
                  <span className="text-[9px] text-zinc-600 uppercase tracking-wider block font-bold">
                    FRAUD INFLOW
                  </span>
                  <span className="text-base font-extrabold block mt-0.5">$2,000.00</span>
                  <span className="text-[10px] text-zinc-600">100% Accounted For</span>
                </div>

                <div
                  className={`p-3 rounded-[4px] border ${
                    isPaper
                      ? 'bg-[#EAE4D7]/70 border-[#C4B9A3]'
                      : 'bg-obsidian-850 border-obsidian-750'
                  }`}
                >
                  <span className="text-[9px] text-zinc-600 uppercase tracking-wider block font-bold">
                    RISK ASSESSMENT
                  </span>
                  <span className="text-base font-extrabold block mt-0.5">94 / 100</span>
                  <span className="text-[10px] font-bold">HIGH RISK</span>
                </div>

                <div
                  className={`p-3 rounded-[4px] border ${
                    isPaper
                      ? 'bg-[#EAE4D7]/70 border-[#C4B9A3]'
                      : 'bg-obsidian-850 border-obsidian-750'
                  }`}
                >
                  <span className="text-[9px] text-zinc-600 uppercase tracking-wider block font-bold">
                    RECOVERABLE SUM
                  </span>
                  <span className="text-base font-extrabold block mt-0.5">$1,180.00</span>
                  <span className="text-[10px] text-zinc-600">59.0% Subpoena Target</span>
                </div>

                <div
                  className={`p-3 rounded-[4px] border ${
                    isPaper
                      ? 'bg-[#EAE4D7]/70 border-[#C4B9A3]'
                      : 'bg-obsidian-850 border-obsidian-750'
                  }`}
                >
                  <span className="text-[9px] text-zinc-600 uppercase tracking-wider block font-bold">
                    TOTAL VELOCITY
                  </span>
                  <span className="text-base font-extrabold block mt-0.5">10m 48s</span>
                  <span className="text-[10px] text-zinc-600">8 Txs / 2 Chains</span>
                </div>
              </div>
            </div>

            {/* Section 2: Fund Atomization & Liquidation Flow Architecture */}
            <div className="space-y-3.5 pt-6">
              <div className="flex items-center justify-between border-b pb-1 border-current/15">
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isPaper ? 'text-[#111216]' : 'text-sand-100'
                  }`}
                >
                  2. Fund Atomization &amp; Liquidation Flow Topology
                </h2>

                <div className="no-print flex items-center space-x-1 font-mono text-[10px]">
                  <button
                    onClick={() => setTopologyTab('graph')}
                    className={`px-2 py-0.5 rounded-[4px] cursor-pointer transition ${
                      topologyTab === 'graph'
                        ? isPaper
                          ? 'bg-[#111216] text-[#F4F0E8] font-bold'
                          : 'bg-sand-100 text-obsidian-950 font-bold'
                        : isPaper
                        ? 'text-zinc-600 hover:text-[#111216] bg-[#EAE4D7]'
                        : 'text-zinc-400 hover:text-sand-100 bg-obsidian-850'
                    }`}
                  >
                    Topology Graph
                  </button>
                  <button
                    onClick={() => setTopologyTab('volume')}
                    className={`px-2 py-0.5 rounded-[4px] cursor-pointer transition ${
                      topologyTab === 'volume'
                        ? isPaper
                          ? 'bg-[#111216] text-[#F4F0E8] font-bold'
                          : 'bg-sand-100 text-obsidian-950 font-bold'
                        : isPaper
                        ? 'text-zinc-600 hover:text-[#111216] bg-[#EAE4D7]'
                        : 'text-zinc-400 hover:text-sand-100 bg-obsidian-850'
                    }`}
                  >
                    Volume Breakdown
                  </button>
                </div>
              </div>

              {/* View 1: Forensic Multi-Tier Topology Graph */}
              {(topologyTab === 'graph' || isPaper) && (
                <div className="space-y-2">
                  <ForensicReportGraph isPaper={isPaper} />
                  <p className="text-[10px] font-mono text-zinc-600 text-center">
                    Figure 1: Reconstructed multi-hop cryptocurrency flow topology from Victim origin to Centralized Exchange endpoint
                  </p>
                </div>
              )}

              {/* View 2: Quantitative Tranche Bar Chart */}
              {(topologyTab === 'volume' && !isPaper) && (
                <div className="p-4 rounded-[4px] border border-obsidian-750 bg-obsidian-850">
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
                  <p className="text-[10px] font-mono text-zinc-500 text-center mt-2">
                    Figure 2: Tranche distribution volumes and cross-chain liquidation trail (USDT equivalent)
                  </p>
                </div>
              )}
            </div>

            {/* Sheet 1 Footer */}
            <div
              className={`pt-6 mt-6 border-t flex items-center justify-between text-[9px] font-mono text-zinc-600 ${
                isPaper ? 'border-[#C4B9A3]' : 'border-obsidian-750'
              }`}
            >
              <span>MONOMER FINANCIAL INTELLIGENCE UNIT (FIU)</span>
              <span>SHEET 1 OF 2 &bull; EXECUTIVE SUMMARY &amp; FLOW TOPOLOGY</span>
              <span>CASE: {DEMO_CASE.caseId}</span>
            </div>
          </div>

          {/* SHEET 2: EVIDENCE REGISTRY, TRANSACTION LEDGER & ATTESTATION */}
          <div
            ref={sheet2Ref}
            className={`print-sheet w-full max-w-[840px] transition-all duration-200 print:max-w-none print:w-full print:border-none print:shadow-none print-avoid-break mb-12 ${
              isPaper
                ? 'bg-[#F4F0E8] text-[#111216] border border-[#C4B9A3] shadow-[0_12px_40px_rgba(0,0,0,0.45)] p-8 sm:p-12 rounded-[6px]'
                : 'bg-obsidian-900 text-sand-100 border border-obsidian-750 shadow-2xl p-8 sm:p-12 rounded-[6px]'
            }`}
          >
            {/* Sheet 2 Running Header */}
            <div
              className={`border-b pb-3 flex items-center justify-between font-mono text-[10px] text-zinc-600 ${
                isPaper ? 'border-[#C4B9A3]' : 'border-obsidian-750'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-bold">
                  {DEMO_CASE.caseName} ({DEMO_CASE.caseId})
                </span>
              </div>
              <span className="uppercase font-bold">
                SHEET 2 OF 2 &bull; EVIDENCE, LEDGER &amp; STATUTORY CERTIFICATE
              </span>
            </div>

            {/* Section 3: Reconstructed Forensic Transaction Ledger */}
            <div className="space-y-3 pt-6">
              <div className="flex items-center justify-between border-b pb-1 border-current/15">
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isPaper ? 'text-[#111216]' : 'text-sand-100'
                  }`}
                >
                  3. Reconstructed Forensic Transaction Ledger
                </h2>
                <span className="text-[10px] font-mono text-zinc-600">SECTION 03 // LEDGER</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] border-collapse">
                  <thead>
                    <tr
                      className={`border-b text-[9px] uppercase tracking-wider ${
                        isPaper
                          ? 'bg-[#EAE4D7] border-[#C4B9A3] text-[#111216] font-bold'
                          : 'bg-obsidian-850 border-obsidian-750 text-sand-100'
                      }`}
                    >
                      <th className="py-2 px-2">HOP</th>
                      <th className="py-2 px-2">TX ID</th>
                      <th className="py-2 px-2">TIME (UTC)</th>
                      <th className="py-2 px-2">CHAIN</th>
                      <th className="py-2 px-2">FLOW ROUTE</th>
                      <th className="py-2 px-2 text-right">VOLUME</th>
                      <th className="py-2 px-2">PATTERN</th>
                      <th className="py-2 px-2">TX HASH</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isPaper
                        ? 'divide-[#D5CDBF] text-[#111216]'
                        : 'divide-obsidian-750/70 text-zinc-300'
                    }`}
                  >
                    {DEMO_TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="hover:bg-black/5 transition-colors">
                        <td className="py-2 px-2 text-zinc-600">#{tx.hopIndex}</td>
                        <td className="py-2 px-2 font-bold">{tx.id}</td>
                        <td className="py-2 px-2 text-zinc-600">{tx.timestamp.replace(' UTC', '')}</td>
                        <td className="py-2 px-2">
                          <span
                            className={`px-1 py-0.2 rounded-[4px] text-[9px] ${
                              tx.chain === 'Ethereum'
                                ? 'bg-black/10 text-current'
                                : 'bg-black text-white font-bold'
                            }`}
                          >
                            {tx.chain}
                          </span>
                        </td>
                        <td className="py-2 px-2 font-medium">
                          {DEMO_WALLETS[tx.from]?.label} &rarr; {DEMO_WALLETS[tx.to]?.label}
                        </td>
                        <td className="py-2 px-2 text-right font-bold">
                          {tx.amountFormatted}
                        </td>
                        <td className="py-2 px-2 text-zinc-600">
                          {tx.patternTag}
                        </td>
                        <td className="py-2 px-2 font-mono text-zinc-600 truncate max-w-[90px]">
                          {tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Centralized Exchange Off-Ramp Subpoena Schedule */}
            <div className="space-y-3 pt-6">
              <div className="flex items-center justify-between border-b pb-1 border-current/15">
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isPaper ? 'text-[#111216]' : 'text-sand-100'
                  }`}
                >
                  4. VASP Attribution &amp; Subpoena Schedule (Section 91 CrPC)
                </h2>
                <span className="text-[10px] font-mono text-zinc-600">SECTION 04 // ACTIONABLE FREEZE</span>
              </div>

              <div
                className={`p-4 rounded-[4px] border font-mono text-xs space-y-3 ${
                  isPaper
                    ? 'bg-[#EAE4D7]/70 border-[#C4B9A3]'
                    : 'bg-obsidian-850 border-obsidian-750'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 border-current/15">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-current" />
                    <span className="font-extrabold uppercase tracking-wider">
                      TARGET VASP: DEMO EXCHANGE (CLS-VASP-POLYGON-001)
                    </span>
                  </div>
                  <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-[4px] font-bold uppercase">
                    HIGH PRIORITY INTERCEPTION
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">TARGET DEPOSIT FORWARDER:</span>
                      <span className="font-bold">0x6d90218fbc789123ccae874019</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">CEX OMNIBUS HOTWALLET:</span>
                      <span className="font-bold">0x28C6c06298d514Db089934071355E5743bf21d60</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">INGESTION TRANSACTION:</span>
                      <span className="font-bold">TX-DEMO-008 ($680.00 USDT)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">FIU-IND REGISTRATION:</span>
                      <span className="font-bold">RE-IND-09 (REGISTERED / VERIFIED)</span>
                    </div>
                  </div>

                  <div
                    className={`p-2.5 rounded-[4px] border text-[10px] space-y-1 ${
                      isPaper
                        ? 'bg-[#F4F0E8] border-[#C4B9A3]'
                        : 'bg-obsidian-900 border-obsidian-750 text-zinc-300'
                    }`}
                  >
                    <span className="font-bold block uppercase tracking-wider text-zinc-600">
                      RECOMMENDED STATUTORY RELIEF
                    </span>
                    <p className="leading-tight">
                      • Immediate Section 91 CrPC notice to preserve linked KYC logs and internal deposit UID.
                    </p>
                    <p className="leading-tight">
                      • Administrative freeze order on customer balance equivalent to $680.00 USDT.
                    </p>
                    <p className="leading-tight">
                      • Disclosure of INR fiat off-ramp beneficiary accounts and UPI IDs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Section 65B / BSA Section 63 Certificate */}
            <div className="space-y-3 pt-6">
              <div className="flex items-center justify-between border-b pb-1 border-current/15">
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isPaper ? 'text-[#111216]' : 'text-sand-100'
                  }`}
                >
                  5. Certificate under Section 65B Indian Evidence Act / Section 63 BSA
                </h2>
                <span className="text-[10px] font-mono text-zinc-600">SECTION 05 // CERTIFICATE</span>
              </div>

              <div
                className={`p-4 rounded-[4px] border font-sans text-xs space-y-2 leading-relaxed ${
                  isPaper
                    ? 'bg-[#EAE4D7]/70 border-[#C4B9A3]'
                    : 'bg-obsidian-850 border-obsidian-750 text-zinc-300'
                }`}
              >
                <p>
                  I, the undersigned Forensic Examiner, certify that the computerized blockchain outputs, transaction topologies, and cryptographic records detailed in this dossier were produced by computer systems operating properly in lawful cyber forensic workflows.
                </p>
                <p>
                  During the relevant period, the hashing engines and cryptographic validation algorithms operated without interference or system malfunction that could affect the accuracy or authenticity of the digital evidence.
                </p>
              </div>
            </div>

            {/* Section 6: Officer Signature & SHA-256 Cryptographic Seal */}
            <div
              className={`pt-8 mt-6 border-t space-y-6 ${
                isPaper ? 'border-[#C4B9A3]' : 'border-obsidian-750'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                {/* Seal Stamp */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center font-mono font-extrabold text-[8px] tracking-tighter uppercase shrink-0 ${
                      isPaper
                        ? 'border-[#111216] text-[#111216]'
                        : 'border-sand-100 text-sand-100'
                    }`}
                  >
                    <span>MONOMER</span>
                    <span>SEALED</span>
                    <span>2026</span>
                  </div>
                  <div>
                    <span className="font-bold block uppercase tracking-wider">
                      CRYPTOGRAPHICALLY SEALED EVIDENCE
                    </span>
                    <span className="text-[10px] text-zinc-600 block">
                      SHA256: 8F2901BCE774910AA82CF019BCE84210
                    </span>
                    <span className="text-[9px] text-zinc-600 block">
                      Admissible under Indian Evidence Act Sec 65B &amp; BSA Sec 63
                    </span>
                  </div>
                </div>

                {/* Physical Signature Blocks */}
                <div className="flex items-center space-x-8 text-[10px]">
                  <div className="space-y-1.5">
                    <div
                      className={`w-36 h-7 border-b-2 flex items-end justify-start pb-0.5 font-mono text-[9px] ${
                        isPaper ? 'border-[#111216] text-zinc-600' : 'border-sand-100 text-zinc-400'
                      }`}
                    >
                      X _____________________
                    </div>
                    <div>
                      <span className="block font-bold uppercase tracking-wider">
                        LEAD EXAMINER
                      </span>
                      <span className="text-[9px] text-zinc-600 block">
                        Signature &amp; Date
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className={`w-36 h-7 border-b-2 flex items-end justify-start pb-0.5 font-mono text-[9px] ${
                        isPaper ? 'border-[#111216] text-zinc-600' : 'border-sand-100 text-zinc-400'
                      }`}
                    >
                      X _____________________
                    </div>
                    <div>
                      <span className="block font-bold uppercase tracking-wider">
                        SUPERVISING OFFICER
                      </span>
                      <span className="text-[9px] text-zinc-600 block">
                        Counter-Signature &amp; Seal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Notice */}
              <div className="text-center font-mono text-[9px] text-zinc-600 space-y-0.5 border-t border-current/15 pt-4">
                <p className="font-bold uppercase">
                  MONOMER CRYPTOCURRENCY FRAUD TRACING PLATFORM &bull; FORMAL FORENSIC DOSSIER
                </p>
                <p>
                  CASE: {DEMO_CASE.caseId} &bull; EVIDENCE HASH SEALED &bull; I4C / LEA SUITE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
