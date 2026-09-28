'use client';

import React, { useState } from 'react';
import {
  Bell,
  X,
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
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase bg-obsidian-850 text-sand-100 border border-sand-850">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5F5F5]" />
            <span>CRITICAL FREEZE</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase bg-obsidian-850 text-sand-300 border border-obsidian-750">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA]" />
            <span>HIGH PRIORITY</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase bg-obsidian-850 text-zinc-300 border border-obsidian-750">
            <span className="w-1.5 h-1.5 rounded-full bg-sand-300" />
            <span>NOTICE</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase bg-obsidian-850 text-zinc-400 border border-obsidian-750">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            <span>INFO</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs transition-opacity select-none">
      <div
        className="w-full max-w-md bg-obsidian-900 border-l border-obsidian-750 h-full flex flex-col shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-obsidian-750 flex items-center justify-between bg-obsidian-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-obsidian-850 border border-obsidian-750 flex items-center justify-center text-sand-100">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-sand-100 font-mono uppercase tracking-wider">
                LIVE ALERTS / OPERATIONAL FEED
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono">
                Real-Time Typology &amp; VASP Detection Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-zinc-400 hover:text-sand-100 hover:bg-obsidian-850 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-2.5 bg-obsidian-850 border-b border-obsidian-750 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-zinc-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[11px]">FILTER:</span>
          </div>

          <div className="flex items-center space-x-1">
            {(['all', 'critical', 'high', 'medium'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase transition cursor-pointer ${
                  filterSeverity === sev
                    ? 'bg-sand-100 text-obsidian-950 font-bold'
                    : 'text-zinc-400 hover:text-sand-100 hover:bg-obsidian-750'
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
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              No alerts match the selected severity filter.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isDispatched = dispatchedMap[alert.id] || alert.dispatchedToLea;

              return (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-[4px] border border-obsidian-750 bg-obsidian-850 space-y-2.5 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {getSeverityBadge(alert.severity)}
                      <span className="text-[10px] font-mono text-zinc-400">
                        {alert.timestamp}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 px-1.5 py-0.5 bg-obsidian-900 rounded-[4px] border border-obsidian-750">
                      {alert.id}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-sand-100 font-mono">
                    {alert.title}
                  </h4>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {alert.message}
                  </p>

                  <div className="pt-2 border-t border-obsidian-750/70 flex items-center justify-between gap-2">
                    {alert.actionLabel ? (
                      <button
                        onClick={() => {
                          onActionClick(alert);
                          onClose();
                        }}
                        className="inline-flex items-center space-x-1.5 text-[11px] font-mono font-bold text-sand-100 hover:text-sand-300 cursor-pointer transition-colors"
                      >
                        <span>{alert.actionLabel}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-400" />
                      </button>
                    ) : (
                      <span />
                    )}

                    <button
                      onClick={() => handleDispatch(alert.id)}
                      disabled={isDispatched}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-[4px] text-[10px] font-mono transition cursor-pointer ${
                        isDispatched
                          ? 'bg-obsidian-900 text-sand-100 border border-sand-850'
                          : 'bg-obsidian-900 hover:bg-obsidian-750 text-sand-300 border border-obsidian-750'
                      }`}
                      title="Dispatch alert payload to state cyber cell / I4C SAHYOG portal"
                    >
                      {isDispatched ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-sand-100" />
                          <span>DISPATCHED TO LEA</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 text-zinc-400" />
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
        <div className="p-3 bg-obsidian-950 border-t border-obsidian-750 text-[10px] font-mono text-zinc-500 flex justify-between items-center">
          <span>I4C / NCRP Alert Relay Service</span>
          <span className="text-sand-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sand-100" />
            <span>LIVE POLLING (500ms)</span>
          </span>
        </div>
      </div>
    </div>
  );
};
