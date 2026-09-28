'use client';

import React, { useState } from 'react';
import {
  FileText,
  RotateCcw,
  Download,
  Info,
  Check,
  Shield,
  Layers,
  X,
  Bell,
  Building,
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
      <header className="no-print h-13 bg-[#111111] border-b border-[#242424] flex items-center justify-between px-4 sticky top-0 z-40 select-none">
        {/* Left: Brand & Case Identity */}
        <div className="flex items-center space-x-4">
          <div
            onClick={onReset}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded bg-[#222222] border border-[#383838] flex items-center justify-center text-white font-bold group-hover:bg-[#2e2e2e] transition">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-sans font-bold tracking-tight text-sm text-white">
                  MONOMER
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1f1f1f] text-[#aaaaaa] border border-[#333333]">
                  SIH 2026
                </span>
              </div>
            </div>
          </div>

          {/* Case Identity when in Dashboard */}
          {currentScreen === 'dashboard' && (
            <div className="hidden md:flex items-center space-x-2.5 pl-4 border-l border-[#242424]">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-[#888888]">
                <span>CASE</span>
                <span className="font-semibold text-white px-1.5 py-0.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded">
                  {activeCase.caseId}
                </span>
              </div>

              {/* NCRP Badge */}
              {activeCase.ncrpAckNumber && (
                <div className="hidden lg:flex items-center space-x-1.5 text-[11px] font-mono text-blue-400 px-2 py-0.5 rounded bg-blue-950/40 border border-blue-900/60">
                  <Building className="w-3 h-3 text-blue-400" />
                  <span>NCRP: {activeCase.ncrpAckNumber}</span>
                </div>
              )}

              <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#cccccc] px-2 py-0.5 rounded bg-[#181818] border border-[#2e2e2e]">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="tracking-wide uppercase font-medium">{activeCase.status}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions & Demo Badges */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Real-Time Alerts Bell */}
          {currentScreen === 'dashboard' && onToggleAlerts && (
            <button
              onClick={onToggleAlerts}
              className="relative p-2 bg-[#1c1c1c] hover:bg-[#252525] border border-[#383838] text-white rounded transition cursor-pointer flex items-center justify-center"
              title="Open Real-Time LEA Alert Center"
            >
              <Bell className="w-4 h-4 text-white" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[9px] font-bold font-mono animate-pulse">
                  {unreadAlertCount}
                </span>
              )}
            </button>
          )}

          {/* Simulated Data Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-[#181818] border border-[#2a2a2a] px-2.5 py-1 rounded text-[11px] font-mono text-[#888888]">
            <Shield className="w-3 h-3 text-[#aaaaaa]" />
            <span>LEA CERTIFIED</span>
          </div>

          {/* DEMO MODE Badge */}
          <button
            onClick={() => setShowDemoModal(true)}
            className="flex items-center space-x-1.5 bg-[#1c1c1c] hover:bg-[#252525] border border-[#383838] px-2.5 py-1 rounded text-xs font-mono font-medium text-white transition cursor-pointer"
            title="Prototype scope & disclaimer notice"
          >
            <span>SIH INFO</span>
            <Info className="w-3 h-3 text-[#888888]" />
          </button>

          {/* Direct Dashboard button when on landing screen */}
          {currentScreen === 'landing' && onDirectDashboard && (
            <button
              onClick={onDirectDashboard}
              className="flex items-center space-x-1.5 bg-[#ffffff] hover:bg-[#e5e5e5] text-black px-3 py-1 rounded text-xs font-bold transition cursor-pointer shadow-sm"
            >
              <span>Enter Dashboard &rarr;</span>
            </button>
          )}

          {/* Dashboard Control Buttons */}
          {currentScreen === 'dashboard' && (
            <div className="flex items-center space-x-1.5 border-l border-[#242424] pl-2 sm:pl-3">
              <button
                onClick={handleExport}
                className="hidden sm:flex items-center space-x-1.5 bg-[#181818] hover:bg-[#222222] border border-[#2e2e2e] hover:border-[#404040] px-2.5 py-1 rounded text-xs text-[#cccccc] hover:text-white transition"
                title="Export metadata to clipboard"
              >
                <Download className="w-3.5 h-3.5 text-[#888888]" />
                <span>Export</span>
              </button>

              <button
                onClick={onOpenReport}
                className="flex items-center space-x-1.5 bg-[#ffffff] hover:bg-[#e5e5e5] text-[#000000] px-3 py-1 rounded text-xs font-semibold shadow-sm transition"
              >
                <FileText className="w-3.5 h-3.5 text-black" />
                <span>Report</span>
              </button>

              <button
                onClick={onReset}
                className="p-1.5 text-[#888888] hover:text-white hover:bg-[#222222] rounded border border-transparent hover:border-[#333333] transition"
                title="Reset to Start Screen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Copy Notification Toast */}
      {copiedNotification && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#1c1c1c] border border-[#444444] text-white text-xs px-3 py-2 rounded shadow-xl flex items-center space-x-2">
          <Check className="w-4 h-4 text-white" />
          <span>Case metadata copied to clipboard</span>
        </div>
      )}

      {/* Prototype Scope Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#141414] border border-[#333333] rounded-lg max-w-md w-full p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#242424] pb-2.5">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-white">
                SIH 2026 System Architecture
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-[#888888] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#cccccc] leading-relaxed">
              <strong className="text-white">MONOMER</strong> integrates direct NCRP/SAHYOG complaint ingestion, live multi-chain indexer APIs, VASP clustering algorithms, mixer de-anonymization heuristics, and automated LEA court-admissible reports under Section 65B of the Bharatiya Sakshya Adhiniyam / Evidence Act.
            </p>

            <div className="bg-[#0c0c0c] border border-[#242424] rounded p-3 text-[11px] font-mono text-[#888888] space-y-1.5">
              <div className="flex justify-between">
                <span>Active Portal:</span>
                <span className="text-white font-sans">NCRP & SAHYOG Sync</span>
              </div>
              <div className="flex justify-between">
                <span>Indexed Chains:</span>
                <span className="text-white font-sans">Ethereum, Polygon, Arbitrum, Bitcoin</span>
              </div>
              <div className="flex justify-between">
                <span>VASP Identification:</span>
                <span className="text-white font-sans">Heuristic Sweep & Hotwallet Pool Attribution</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-1.5 bg-[#ffffff] hover:bg-[#e5e5e5] text-black text-xs font-semibold rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
