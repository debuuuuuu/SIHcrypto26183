'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  Download,
  Info,
  Check,
  Shield,
  X,
  Bell,
  FileText,
} from 'lucide-react';
import { DEMO_CASE } from '@/data/demoInvestigation';
import { InvestigationCase } from '@/types/investigation';

interface HeaderProps {
  currentScreen: 'landing' | 'loading' | 'dashboard';
  onReset: () => void;
  onOpenReport: () => void;
  onExportJson?: () => void;
  unreadAlertCount?: number;
  onToggleAlerts?: () => void;
  caseData?: InvestigationCase;
  onDirectDashboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onReset,
  onOpenReport,
  onExportJson,
  unreadAlertCount = 0,
  onToggleAlerts,
  caseData,
  onDirectDashboard,
}) => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const activeCase = caseData || DEMO_CASE;

  const handleExport = () => {
    if (onExportJson) {
      onExportJson();
    } else {
      const dataStr = JSON.stringify(activeCase, null, 2);
      navigator.clipboard.writeText(dataStr);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  return (
    <>
      <header className="no-print h-[52px] bg-obsidian-950 border-b border-obsidian-750 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 select-none transition-all">
        {/* Left: Tactical Brand & Case Coordinates (Section 7) */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div
            onClick={onReset}
            className="flex items-center space-x-2 cursor-pointer group"
            title="Return to investigation portal"
          >
            <div className="w-6 h-6 rounded-[4px] bg-obsidian-850 border border-obsidian-750 flex items-center justify-center group-hover:border-sand-300 transition-colors">
              <span className="text-[11px] font-mono font-bold text-sand-100">M</span>
            </div>
            <span className="font-mono font-bold tracking-wider text-xs text-sand-100 group-hover:text-white transition-colors">
              MONOMER
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase px-1.5 py-0.2 bg-obsidian-850 border border-obsidian-750 rounded-[2px] hidden sm:inline">
              SIH 2026
            </span>
          </div>

          {/* Case Identity Coordinates when in Dashboard */}
          {currentScreen === 'dashboard' && (
            <div className="hidden md:flex items-center space-x-2 pl-3 border-l border-obsidian-750 font-mono text-xs">
              <span className="text-[11px] font-mono text-sand-100 px-2 py-0.5 bg-obsidian-850 border border-obsidian-750 rounded-[4px]">
                {activeCase.caseId}
              </span>

              {/* NCRP Reference */}
              {activeCase.ncrpAckNumber && (
                <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-zinc-400 px-2 py-0.5 rounded-[4px] bg-obsidian-850 border border-obsidian-750">
                  <span className="text-zinc-600">NCRP:</span>
                  <span className="text-sand-300">{activeCase.ncrpAckNumber}</span>
                </div>
              )}

              {/* Case Status */}
              <div className="hidden xl:flex items-center space-x-1.5 text-[10px] text-zinc-400 px-2 py-0.5 rounded-[4px] bg-obsidian-850 border border-obsidian-750">
                <span className="w-1.5 h-1.5 rounded-full bg-sand-100" />
                <span>CASE ACTIVE</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Technical Telemetry & Operational Actions (Section 7) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* RPC Live Telemetry */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 bg-obsidian-850 border border-obsidian-750 rounded-[4px] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-sand-100"></span>
            <span className="text-zinc-500">RPC</span>
            <span className="text-sand-300 font-medium">ONLINE</span>
          </div>

          {/* FIU-IND Gateway Status */}
          <div className="hidden xl:flex items-center space-x-1.5 px-2 py-0.5 bg-obsidian-850 border border-obsidian-750 rounded-[4px] text-[11px] font-mono text-zinc-400">
            <Shield className="w-3 h-3 text-zinc-500" />
            <span>FIU-IND GATEWAY</span>
          </div>

          {/* Real-Time Alerts Drawer Trigger */}
          {currentScreen === 'dashboard' && onToggleAlerts && (
            <button
              onClick={onToggleAlerts}
              className="relative px-2.5 py-1 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 hover:border-sand-300 text-zinc-400 hover:text-sand-100 rounded-[4px] transition-colors cursor-pointer flex items-center space-x-1.5 text-[11px] font-mono"
              title="Open Real-Time LEA Alert Center"
            >
              <Bell className="w-3 h-3 text-zinc-400" />
              <span>{String(unreadAlertCount).padStart(2, '0')} ALERTS</span>
              {unreadAlertCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5F5F5] ml-0.5" />
              )}
            </button>
          )}

          {/* SIH Info Modal Button */}
          <button
            onClick={() => setShowDemoModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 text-zinc-400 hover:text-sand-100 rounded-[4px] text-[11px] font-mono transition-colors cursor-pointer"
            title="Forensic architecture specification"
          >
            <Info className="w-3 h-3 text-zinc-400" />
            <span className="hidden sm:inline">SIH INFO</span>
          </button>

          {/* Direct Dashboard Button (Landing screen only) */}
          {currentScreen === 'landing' && onDirectDashboard && (
            <button
              onClick={onDirectDashboard}
              className="flex items-center space-x-1.5 bg-sand-100 hover:bg-white text-obsidian-950 px-3.5 py-1 rounded-[4px] text-xs font-mono font-bold transition-colors cursor-pointer shadow-xs"
            >
              <span>CONSOLE</span>
              <span>&rarr;</span>
            </button>
          )}

          {/* Operational Buttons (Dashboard screen only) */}
          {currentScreen === 'dashboard' && (
            <div className="flex items-center space-x-2 border-l border-obsidian-750 pl-2 sm:pl-3">
              <button
                onClick={handleExport}
                className="hidden sm:flex items-center space-x-1.5 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 hover:border-sand-300 px-2.5 py-1 rounded-[4px] text-[11px] font-mono text-sand-300 hover:text-sand-100 transition-colors cursor-pointer"
                title="Export telemetry metadata to clipboard"
              >
                <Download className="w-3 h-3 text-zinc-400" />
                <span>EXPORT</span>
              </button>

              <button
                onClick={onOpenReport}
                className="flex items-center space-x-1.5 bg-sand-100 hover:bg-white text-obsidian-950 px-3 py-1 rounded-[4px] text-xs font-mono font-bold transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-3 h-3 text-obsidian-950" />
                <span>COURT REPORT</span>
              </button>

              <button
                onClick={onReset}
                className="p-1.5 text-zinc-400 hover:text-sand-100 hover:bg-obsidian-850 rounded-[4px] border border-transparent hover:border-obsidian-750 transition-colors cursor-pointer"
                title="Reset to Ingestion Portal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Copied to clipboard toast */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 bg-obsidian-850 border border-obsidian-750 text-sand-100 px-3.5 py-2 rounded-[4px] shadow-2xl flex items-center space-x-2 text-xs font-mono z-50">
          <Check className="w-3.5 h-3.5 text-sand-100" />
          <span>Case telemetry copied to clipboard</span>
        </div>
      )}

      {/* SIH Info Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
          <div className="max-w-lg w-full bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-obsidian-750 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-sand-100 font-mono font-bold text-xs uppercase tracking-wider">
                  Monomer Forensic Architecture &bull; SIH 2026
                </span>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-zinc-400 hover:text-sand-100 p-1 rounded-[4px] hover:bg-obsidian-850 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-400 font-sans leading-relaxed">
              <p>
                <strong className="text-sand-100 font-mono">Objective:</strong> Rapid de-anonymization and VASP attribution of suspect cryptocurrency addresses reported in cyber fraud cases (NCRP / I4C).
              </p>
              <div className="p-3 rounded-[4px] bg-obsidian-850 border border-obsidian-750 space-y-1.5 font-mono text-[11px]">
                <div className="text-sand-100 font-semibold">Core Forensic Capabilities:</div>
                <div className="text-zinc-400 leading-normal">
                  • Automated Multi-Input Clustering Heuristics<br/>
                  • FIU-IND Registered VASP Attribution Engine<br/>
                  • Peel-Chain &amp; Cross-Chain Bridge Ingress Tracing<br/>
                  • Section 65B Indian Evidence Act Print-Ready Dossier<br/>
                  • Real-Time LEA Alert Center with Instant Freeze Schedules<br/>
                  • Public Multi-Chain JSON-RPC Blockchain Indexer
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-3.5 py-1.5 bg-sand-100 hover:bg-white text-obsidian-950 rounded-[4px] text-xs font-mono font-semibold transition cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
