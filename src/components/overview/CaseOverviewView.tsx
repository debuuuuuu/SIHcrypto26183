'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  Clock,
  ShieldAlert,
  ArrowRight,
  ArrowUpRight,
  Shield,
  Building2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import {
  DEMO_CASE,
  DEMO_WALLETS,
  DEMO_TRANSACTIONS,
  DEMO_DETECTIONS,
  DEMO_EVIDENCE,
} from '@/data/demoInvestigation';
import { InvestigationCase } from '@/types/investigation';

interface CaseOverviewViewProps {
  onNavigate: (tab: string) => void;
  onOpenReport: () => void;
  onSelectWallet: (walletId: string) => void;
  caseData?: InvestigationCase;
}

// 8 Transactions for the Image 4 Radial Segmented Chart
const RADIAL_SECTORS = [
  { id: 'TX-001', label: 'Victim Ingress', amount: '$2,000', pct: '100%', radiusRatio: 1.0, sub: 'ETH Inflow' },
  { id: 'TX-002', label: 'Wallet B Split', amount: '$800', pct: '40%', radiusRatio: 0.72, sub: 'Dispersal' },
  { id: 'TX-003', label: 'Wallet C Bridge', amount: '$700', pct: '35%', radiusRatio: 0.65, sub: 'Bridge Feed' },
  { id: 'TX-004', label: 'Wallet D Park', amount: '$500', pct: '25%', radiusRatio: 0.52, sub: 'Cold Storage' },
  { id: 'TX-005', label: 'Contract Lock', amount: '$700', pct: '35%', radiusRatio: 0.65, sub: 'L1 Gateway' },
  { id: 'TX-006', label: 'Polygon Claim', amount: '$698', pct: '34.9%', radiusRatio: 0.64, sub: 'L2 Mint' },
  { id: 'TX-007', label: 'Relay Outflow', amount: '$760', pct: '38%', radiusRatio: 0.69, sub: 'Layering' },
  { id: 'TX-008', label: 'CEX Deposit', amount: '$680', pct: '34%', radiusRatio: 0.62, sub: 'Off-Ramp' },
];

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
  const policeStation = activeCase.policeStationJurisdiction || 'Cyber Crime Police Station, CID';
  const firNo = activeCase.firOrGdNumber || 'FIR No. 412/2026 U/S 66D IT Act';

  const [activeRadialIndex, setActiveRadialIndex] = useState<number | null>(null);

  return (
    <div className="h-full w-full overflow-y-auto bg-obsidian-950 text-sand-100 p-4 lg:p-6 font-sans select-none space-y-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* NCRP & Case Coordination Header */}
        <div className="bg-obsidian-900 border border-obsidian-750 p-4 rounded-[6px] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-obsidian-750 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sand-100">
                OVERVIEW // CASE / {ncrpAck}
              </span>
            </div>
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-[10px] px-2 py-0.5 rounded-[4px] bg-obsidian-850 text-sand-300 border border-obsidian-750">
                {sahyogTicket}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-[4px] bg-obsidian-950 text-sand-100 border border-obsidian-750 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sand-100" />
                <span>SAHYOG ACTIVE</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-2.5 bg-obsidian-950 border border-obsidian-750 rounded-[4px]">
              <span className="text-zinc-600 block text-[9px] uppercase">COMPLAINANT</span>
              <span className="text-sand-100 font-semibold truncate block mt-0.5">{complainant}</span>
            </div>
            <div className="p-2.5 bg-obsidian-950 border border-obsidian-750 rounded-[4px]">
              <span className="text-zinc-600 block text-[9px] uppercase">FIR / GD REFERENCE</span>
              <span className="text-sand-300 truncate block mt-0.5">{firNo}</span>
            </div>
            <div className="p-2.5 bg-obsidian-950 border border-obsidian-750 rounded-[4px]">
              <span className="text-zinc-600 block text-[9px] uppercase">JURISDICTION</span>
              <span className="text-zinc-400 truncate block mt-0.5">{policeStation}</span>
            </div>
            <div className="p-2.5 bg-obsidian-950 border border-obsidian-750 rounded-[4px]">
              <span className="text-zinc-600 block text-[9px] uppercase">LEDGER NETWORKS</span>
              <span className="text-sand-100 font-semibold block mt-0.5">{activeCase.chains.join(' · ')}</span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* ROW 1: Organic Funnel Flow (Reference 3) + Radial Petal Wheel (Reference 4) */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Funnel Flow Chart (7 cols) - Inspired by Image 3 */}
          <div className="lg:col-span-7 bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-5 space-y-4 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-obsidian-750 pb-2">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold font-mono text-sand-100">99.2%</span>
                    <span className="text-xs font-mono text-zinc-400">FUNDS TRACED</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono block mt-0.5">
                    $1,984.00 accounted of $2,000.00 initial loss across 8 transactions
                  </span>
                </div>
                <div className="text-right font-mono text-xs hidden sm:block">
                  <span className="text-zinc-500 text-[10px] uppercase block">TOTAL VELOCITY</span>
                  <span className="text-sand-100 font-bold">10m 48s</span>
                </div>
              </div>

              {/* Organic Smooth Bezier Funnel Visualization (Exact match to Reference 3) */}
              <div className="relative pt-4 pb-2">
                {/* Stage column headers on top */}
                <div className="grid grid-cols-4 text-center font-mono text-[11px] text-sand-300 pb-2">
                  <div>
                    <span className="text-sand-100 font-bold block">$2,000</span>
                    <span className="text-[9px] text-zinc-500 uppercase">Victim</span>
                  </div>
                  <div>
                    <span className="text-sand-100 font-bold block">$2,000</span>
                    <span className="text-[9px] text-zinc-500 uppercase">Suspect</span>
                  </div>
                  <div>
                    <span className="text-sand-100 font-bold block">$700</span>
                    <span className="text-[9px] text-zinc-500 uppercase">Bridge</span>
                  </div>
                  <div>
                    <span className="text-sand-100 font-bold block">$680</span>
                    <span className="text-[9px] text-zinc-500 uppercase">CEX Outflow</span>
                  </div>
                </div>

                {/* SVG Smooth Funnel Waves */}
                <div className="w-full h-28 relative">
                  <svg
                    viewBox="0 0 600 120"
                    preserveAspectRatio="none"
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="funnelBand1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                        <stop offset="33%" stopColor="#E5E5E5" stopOpacity="0.75" />
                        <stop offset="66%" stopColor="#A3A3A3" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#71717A" stopOpacity="0.55" />
                      </linearGradient>
                      <linearGradient id="funnelBand2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#A3A3A3" stopOpacity="0.35" />
                        <stop offset="50%" stopColor="#71717A" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3F3F46" stopOpacity="0.18" />
                      </linearGradient>
                    </defs>

                    {/* Outer ambient contour */}
                    <path
                      d="
                        M 0, 10
                        C 75, 10, 75, 10, 150, 10
                        C 225, 10, 225, 35, 300, 35
                        C 375, 35, 375, 45, 450, 45
                        C 525, 45, 525, 45, 600, 45
                        L 600, 75
                        C 525, 75, 525, 75, 450, 75
                        C 375, 75, 375, 85, 300, 85
                        C 225, 85, 225, 110, 150, 110
                        C 75, 110, 75, 110, 0, 110
                        Z
                      "
                      fill="url(#funnelBand2)"
                    />

                    {/* Core dense flow stream */}
                    <path
                      d="
                        M 0, 20
                        C 75, 20, 75, 20, 150, 20
                        C 225, 20, 225, 42, 300, 42
                        C 375, 42, 375, 50, 450, 50
                        C 525, 50, 525, 50, 600, 50
                        L 600, 70
                        C 525, 70, 525, 70, 450, 70
                        C 375, 70, 375, 78, 300, 78
                        C 225, 78, 225, 100, 150, 100
                        C 75, 100, 75, 100, 0, 100
                        Z
                      "
                      fill="url(#funnelBand1)"
                    />

                    {/* Vertical Stage Divider Hairlines */}
                    <line x1="150" y1="0" x2="150" y2="120" stroke="#2A2A2A" strokeWidth="1" />
                    <line x1="300" y1="0" x2="300" y2="120" stroke="#2A2A2A" strokeWidth="1" />
                    <line x1="450" y1="0" x2="450" y2="120" stroke="#2A2A2A" strokeWidth="1" />
                  </svg>

                  {/* Percentage Badges inside the stream (Matching Image 3) */}
                  <div className="absolute inset-0 grid grid-cols-4 items-center pointer-events-none">
                    <div className="flex justify-center">
                      <span className="px-2.5 py-0.5 bg-[#FFFFFF] text-[#050505] text-[10px] font-mono font-bold rounded-full shadow-sm">
                        100%
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <span className="px-2.5 py-0.5 bg-[#FFFFFF] text-[#050505] text-[10px] font-mono font-bold rounded-full shadow-sm">
                        100%
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <span className="px-2.5 py-0.5 bg-[#FFFFFF] text-[#050505] text-[10px] font-mono font-bold rounded-full shadow-sm">
                        35%
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <span className="px-2.5 py-0.5 bg-[#FFFFFF] text-[#050505] text-[10px] font-mono font-bold rounded-full shadow-sm">
                        34%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stage Names Underneath */}
                <div className="grid grid-cols-4 text-center font-mono text-[10px] text-zinc-400 pt-2 border-t border-obsidian-750">
                  <span className="truncate">Ingress Loss</span>
                  <span className="truncate">Syndicate Hub</span>
                  <span className="truncate">Bridge Relay</span>
                  <span className="truncate">CEX Hotwallet</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-obsidian-750 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>PATHWAY: ETHEREUM L1 &rarr; POLYGON BRIDGE &rarr; CEX OFF-RAMP</span>
              <button
                onClick={() => onNavigate('graph')}
                className="text-sand-100 hover:text-sand-300 font-bold transition flex items-center space-x-1 cursor-pointer"
              >
                <span>OPEN GRAPH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Radial Segmented Wheel (5 cols) - Exact Match to Reference 4 */}
          <div className="lg:col-span-5 bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-5 space-y-3 text-left flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-obsidian-750 pb-2">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider font-bold">
                  TRANCHE SPECTRUM // 8 RECONSTRUCTED FLOWS
                </span>
                <h3 className="text-xs font-mono font-bold text-sand-100 mt-0.5">
                  Analytical Radial Decomposition
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-obsidian-850 border border-obsidian-750 text-sand-300">
                8 TRANCHES
              </span>
            </div>

            {/* SVG Segmented Radial Petal Wheel (Inspired by Image 4) */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="relative w-48 h-48">
                <svg viewBox="-110 -110 220 220" className="w-full h-full overflow-visible">
                  {/* Background 8-sector boundary petals */}
                  {RADIAL_SECTORS.map((sector, i) => {
                    const angleStep = (2 * Math.PI) / 8;
                    const startAngle = i * angleStep - Math.PI / 2;
                    const endAngle = startAngle + angleStep;
                    const rOuter = 95;
                    const rInner = 20;

                    // Petal curve with soft corner
                    const x1 = rOuter * Math.cos(startAngle);
                    const y1 = rOuter * Math.sin(startAngle);
                    const x2 = rOuter * Math.cos(endAngle);
                    const y2 = rOuter * Math.sin(endAngle);
                    const x3 = rInner * Math.cos(endAngle);
                    const y3 = rInner * Math.sin(endAngle);
                    const x4 = rInner * Math.cos(startAngle);
                    const y4 = rInner * Math.sin(startAngle);

                    // Inner shaded sector based on volume
                    const rValue = 20 + sector.radiusRatio * 72;
                    const vx1 = rValue * Math.cos(startAngle);
                    const vy1 = rValue * Math.sin(startAngle);
                    const vx2 = rValue * Math.cos(endAngle);
                    const vy2 = rValue * Math.sin(endAngle);

                    const isHovered = activeRadialIndex === i;

                    return (
                      <g
                        key={sector.id}
                        onMouseEnter={() => setActiveRadialIndex(i)}
                        onMouseLeave={() => setActiveRadialIndex(null)}
                        className="cursor-pointer transition-transform duration-150"
                      >
                        {/* Outer dark petal container */}
                        <path
                          d={`M ${x4} ${y4} L ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z`}
                          fill={isHovered ? '#1F1F1F' : '#141414'}
                          stroke="#2A2A2A"
                          strokeWidth="1"
                        />

                        {/* Inner shaded sector (Variable radius per volume) */}
                        <path
                          d={`M ${x4} ${y4} L ${vx1} ${vy1} A ${rValue} ${rValue} 0 0 1 ${vx2} ${vy2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z`}
                          fill={isHovered ? '#FFFFFF' : '#D4D4D4'}
                          opacity={isHovered ? 0.95 : 0.78}
                        />

                        {/* Label in sector */}
                        {(() => {
                          const midAngle = startAngle + angleStep / 2;
                          const tx = (rOuter - 26) * Math.cos(midAngle);
                          const ty = (rOuter - 26) * Math.sin(midAngle);
                          return (
                            <text
                              x={tx}
                              y={ty}
                              fill={isHovered ? '#050505' : '#111111'}
                              fontSize="8"
                              fontWeight="bold"
                              fontFamily="monospace"
                              textAnchor="middle"
                              dominantBaseline="central"
                            >
                              {sector.pct}
                            </text>
                          );
                        })()}
                      </g>
                    );
                  })}

                  {/* Central hub */}
                  <circle cx="0" cy="0" r="18" fill="#0A0A0A" stroke="#2A2A2A" strokeWidth="1.5" />
                  <text
                    x="0"
                    y="1"
                    fill="#F5F5F5"
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    8 TXs
                  </text>
                </svg>
              </div>

              {/* Dynamic tooltip on active sector */}
              <div className="h-9 flex items-center justify-center font-mono text-center text-xs">
                {activeRadialIndex !== null ? (
                  <div className="space-y-0.5">
                    <span className="text-sand-100 font-bold">
                      {RADIAL_SECTORS[activeRadialIndex].id} &bull; {RADIAL_SECTORS[activeRadialIndex].label}
                    </span>
                    <span className="text-[10px] text-zinc-400 block">
                      Volume: {RADIAL_SECTORS[activeRadialIndex].amount} ({RADIAL_SECTORS[activeRadialIndex].pct} Allocation)
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-zinc-500">
                    Hover segments to inspect hop volume &amp; percentage
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* ROW 2: Dotted Detections (Image 3 Left) + Tactical Targets + Temporal Velocity */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Detections with Dotted Hairline Progress Tracks (Matching Image 3) */}
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-4 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-obsidian-750 pb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sand-100">
                01 // DETECTION PATTERNS
              </span>
              <button
                onClick={() => onNavigate('detections')}
                className="text-[10px] font-mono text-zinc-400 hover:text-sand-100 transition"
              >
                VIEW ALL &rarr;
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs pt-1">
              {[
                { title: 'Rapid Fan-Out Dispersal', score: '96%', dots: '............................' },
                { title: 'Centralized Exchange Off-Ramp', score: '94%', dots: '......................' },
                { title: 'Layering Velocity (24s Window)', score: '91%', dots: '....................' },
                { title: 'Cross-Chain Bridge Hopping', score: '89%', dots: '......................' },
                { title: 'Dormant Cold Storage Parking', score: '78%', dots: '....................' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-sans text-xs truncate mr-2">{item.title}</span>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-zinc-600 hidden sm:inline select-none">{item.dots}</span>
                    <span className="text-sand-100 font-bold font-mono">{item.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Key Syndicate Interceptions (Matching Image 3 Center) */}
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-4 space-y-3 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-obsidian-750 pb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sand-100">
                  02 // ACTIONABLE TARGETS
                </span>
                <span className="text-[10px] font-mono text-zinc-500">3 ENTITIES</span>
              </div>

              <div className="space-y-2 pt-1 font-mono text-xs">
                <div
                  onClick={() => onSelectWallet('suspect')}
                  className="p-2 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 rounded-[4px] cursor-pointer transition flex justify-between items-center"
                >
                  <div>
                    <span className="text-sand-100 font-bold block text-[11px]">Primary Suspect</span>
                    <span className="text-[10px] text-zinc-500 select-all">0x7A92...F2D</span>
                  </div>
                  <span className="text-[10px] text-sand-300 bg-obsidian-900 px-1.5 py-0.5 rounded-[4px] border border-obsidian-750">
                    RISK 94
                  </span>
                </div>

                <div
                  onClick={() => onSelectWallet('exchange')}
                  className="p-2 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 rounded-[4px] cursor-pointer transition flex justify-between items-center"
                >
                  <div>
                    <span className="text-sand-100 font-bold block text-[11px]">Demo Exchange (CEX)</span>
                    <span className="text-[10px] text-zinc-500 select-all">0x28C...556D</span>
                  </div>
                  <span className="text-[10px] text-sand-100 bg-obsidian-900 px-1.5 py-0.5 rounded-[4px] border border-obsidian-750 font-bold">
                    $680 SUBPOENA
                  </span>
                </div>

                <div
                  onClick={() => onSelectWallet('walletD')}
                  className="p-2 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 rounded-[4px] cursor-pointer transition flex justify-between items-center"
                >
                  <div>
                    <span className="text-sand-100 font-bold block text-[11px]">Static Cold Wallet D</span>
                    <span className="text-[10px] text-zinc-500 select-all">0x4E8...311C</span>
                  </div>
                  <span className="text-[10px] text-sand-300 bg-obsidian-900 px-1.5 py-0.5 rounded-[4px] border border-obsidian-750">
                    $500 FREEZE
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenReport}
              className="w-full py-1.5 bg-sand-100 hover:bg-white text-obsidian-950 rounded-[4px] text-xs font-mono font-bold transition cursor-pointer mt-2"
            >
              PREPARE SECTION 91 NOTICE &rarr;
            </button>
          </div>

          {/* Card 3: Temporal Crime Window Velocity (Matching Image 3 Right) */}
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-4 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-obsidian-750 pb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sand-100">
                03 // TEMPORAL VELOCITY
              </span>
              <span className="text-[10px] font-mono text-sand-300">10-MIN WINDOW</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-bold text-sand-100">10m 48s</span>
                <span className="text-[10px] text-zinc-500">PEAK: 14:21:08 UTC</span>
              </div>

              {/* Grayscale Activity Heatmap Grid (Inspired by Sales by Hour in Image 3) */}
              <div className="space-y-1 pt-1">
                <div className="grid grid-cols-10 gap-1 h-5">
                  {[1.0, 0.9, 0.7, 0.6, 0.8, 0.4, 0.9, 0.5, 0.3, 0.8].map((val, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor:
                          val > 0.8 ? '#FFFFFF' : val > 0.6 ? '#A3A3A3' : val > 0.4 ? '#52525B' : '#2A2A2A',
                      }}
                      className="rounded-[2px] h-full"
                      title={`Minute +${idx} activity intensity`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-zinc-500">
                  <span>14:21:00</span>
                  <span>14:25:00</span>
                  <span>14:31:48</span>
                </div>
              </div>

              <div className="pt-2 border-t border-obsidian-750 text-[10px] text-zinc-400 space-y-1 font-sans">
                <p>• 100% of victim disbursement atomized within 24 seconds.</p>
                <p>• Cross-chain bridge hop completed in 69 seconds.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Fast Jump Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <button
            onClick={() => onNavigate('graph')}
            className="p-3 bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-750 hover:border-sand-300 rounded-[4px] text-left transition flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="text-[11px] font-mono font-bold text-sand-100 block">TRANSACTION GRAPH</span>
              <span className="text-[9px] font-mono text-zinc-500">Interactive network</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={() => onNavigate('timeline')}
            className="p-3 bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-750 hover:border-sand-300 rounded-[4px] text-left transition flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="text-[11px] font-mono font-bold text-sand-100 block">TIMELINE LEDGER</span>
              <span className="text-[9px] font-mono text-zinc-500">8 Traced transfers</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={() => onNavigate('evidence')}
            className="p-3 bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-750 hover:border-sand-300 rounded-[4px] text-left transition flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="text-[11px] font-mono font-bold text-sand-100 block">EVIDENCE LOCKBOX</span>
              <span className="text-[9px] font-mono text-zinc-500">6 Sealed artifacts</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={onOpenReport}
            className="p-3 bg-sand-100 hover:bg-white text-obsidian-950 rounded-[4px] text-left transition flex items-center justify-between cursor-pointer shadow-xs"
          >
            <div>
              <span className="text-[11px] font-mono font-bold block">COURT DOSSIER</span>
              <span className="text-[9px] font-mono text-obsidian-850">Sec 65B Certified</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-obsidian-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
