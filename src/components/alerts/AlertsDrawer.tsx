'use client';

import React, { useState } from 'react';
import {
  Bell,
  X,
  AlertTriangle,
  ShieldAlert,
  Send,
  ExternalLink,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { InvestigationAlert, AlertSeverity } from '@/types/investigation';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: InvestigationAlert[];
  onActionClick: (alert: InvestigationAlert) => void;
  onDispatchAlert: (alertId: string) => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onActionClick,
  onDispatchAlert,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'all'>('all');
  const [dispatchedMap, setDispatchedMap] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === 'all' || a.severity === filterSeverity
  );

  const handleDispatch = (alertId: string) => {
    setDispatchedMap((prev) => ({ ...prev, [alertId]: true }));
    onDispatchAlert(alertId);
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-950/80 text-red-400 border border-red-800">
            CRITICAL FREEZE
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-orange-950/80 text-orange-400 border border-orange-800">
            HIGH PRIORITY
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-yellow-950/80 text-yellow-400 border border-yellow-800">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#202020] text-[#aaaaaa] border border-[#333333]">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity">
      <div
        className="w-full max-w-md bg-[#121212] border-l border-[#242424] h-full flex flex-col shadow-2xl text-left select-none animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#242424] flex items-center justify-between bg-[#161616]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-red-950/50 border border-red-900 flex items-center justify-center text-red-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Real-Time LEA Alert Center
              </h2>
              <p className="text-[11px] text-[#888888] font-mono">
                Automated Typology & VASP Detection Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#888888] hover:text-white hover:bg-[#222222] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-2.5 bg-[#141414] border-b border-[#242424] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-[#888888]">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <div className="flex items-center space-x-1">
            {(['all', 'critical', 'high', 'medium'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition ${
                  filterSeverity === sev
                    ? 'bg-white text-black font-bold'
                    : 'text-[#888888] hover:text-white hover:bg-[#202020]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-[#666666] font-mono text-xs">
              No alerts match the selected severity filter.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isDispatched = dispatchedMap[alert.id] || alert.dispatchedToLea;

              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-lg border transition ${
                    alert.severity === 'critical'
                      ? 'bg-[#181111] border-red-900/60'
                      : alert.severity === 'high'
                      ? 'bg-[#181410] border-orange-900/50'
                      : 'bg-[#161616] border-[#2a2a2a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      {getSeverityBadge(alert.severity)}
                      <span className="text-[10px] font-mono text-[#888888]">
                        {alert.timestamp}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-[#666666] px-1.5 py-0.5 bg-[#111111] rounded border border-[#222222]">
                      {alert.id}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1">
                    {alert.title}
                  </h4>

                  <p className="text-xs text-[#cccccc] leading-relaxed mb-3">
                    {alert.message}
                  </p>

                  <div className="pt-2 border-t border-[#262626] flex items-center justify-between gap-2">
                    {alert.actionLabel && (
                      <button
                        onClick={() => {
                          onActionClick(alert);
                          onClose();
                        }}
                        className="inline-flex items-center space-x-1.5 text-[11px] font-mono font-semibold text-white hover:underline cursor-pointer"
                      >
                        <span>{alert.actionLabel}</span>
                        <ExternalLink className="w-3 h-3 text-[#aaaaaa]" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDispatch(alert.id)}
                      disabled={isDispatched}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[10px] font-mono transition ${
                        isDispatched
                          ? 'bg-green-950/60 text-green-400 border border-green-800'
                          : 'bg-[#222222] hover:bg-[#2c2c2c] text-white border border-[#383838]'
                      }`}
                      title="Dispatch alert payload to state cyber cell / I4C SAHYOG portal"
                    >
                      {isDispatched ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>DISPATCHED TO LEA</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 text-[#aaaaaa]" />
                          <span>DISPATCH TO SAHYOG</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 bg-[#111111] border-t border-[#242424] text-[10px] font-mono text-[#666666] flex justify-between items-center">
          <span>I4C / NCRP Alert Relay Service</span>
          <span className="text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE POLLING (500ms)
          </span>
        </div>
      </div>
    </div>
  );
};
