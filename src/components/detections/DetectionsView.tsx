'use client';

import React from 'react';
import { getAllDetections } from '@/lib/detectionEngine';
import { Eye, ChevronRight, ScanSearch } from 'lucide-react';

interface DetectionsViewProps {
  activeDetectionId: string | null;
  onSelectDetection: (id: string | null) => void;
  onSelectTab?: (tab: string) => void;
}

export const DetectionsView: React.FC<DetectionsViewProps> = ({
  activeDetectionId,
  onSelectDetection,
}) => {
  const detections = getAllDetections();

  return (
    <div className="h-full flex flex-col bg-obsidian-950 text-sand-100 p-4 lg:p-6 overflow-y-auto select-none font-sans space-y-4">
      {/* Header (Section 32) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-obsidian-750 gap-2">
        <div>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider block">
            DETECTION ENGINE // 05 FINDINGS
          </span>
          <h2 className="text-lg font-bold font-mono text-sand-100 tracking-tight">
            Algorithmic Behavioral Signatures
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            5 laundering heuristics confirmed across multi-hop execution pathway
          </p>
        </div>

        {activeDetectionId && (
          <button
            onClick={() => onSelectDetection(null)}
            className="text-xs font-mono text-sand-100 hover:bg-obsidian-850 border border-obsidian-750 bg-obsidian-900 px-2.5 py-1 rounded-[4px] transition flex items-center space-x-1.5 self-start cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span>RESET GRAPH ISOLATION</span>
          </button>
        )}
      </div>

      {/* Section 32: Technical Terminal Table */}
      <div className="max-w-4xl bg-obsidian-900 border border-obsidian-750 rounded-[4px] overflow-hidden font-mono text-xs">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-3.5 py-2 border-b border-obsidian-750 text-[10px] text-zinc-600 uppercase">
          <div className="col-span-1">SEV</div>
          <div className="col-span-6">PATTERN</div>
          <div className="col-span-2 text-right">CONFIDENCE</div>
          <div className="col-span-3 text-right">GRAPH ISOLATION</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-obsidian-750">
          {detections.map((pattern, index) => {
            const isActive = activeDetectionId === pattern.id;

            return (
              <div
                key={pattern.id}
                onClick={() => onSelectDetection(isActive ? null : pattern.id)}
                className={`grid grid-cols-12 gap-2 px-3.5 py-3 items-center transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-obsidian-850 text-sand-100 border-l-2 border-sand-300'
                    : 'hover:bg-obsidian-850 text-zinc-400'
                }`}
              >
                {/* Severity Dot */}
                <div className="col-span-1 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-graph-suspect" />
                </div>

                {/* Pattern Title & Indicators */}
                <div className="col-span-6 space-y-0.5">
                  <div className="font-semibold text-sand-100 text-xs flex items-center space-x-1.5">
                    <span>{pattern.title.toUpperCase()}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded-[2px] bg-obsidian-950 border border-obsidian-750 text-zinc-500">
                      {pattern.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-1">
                    {pattern.description}
                  </p>
                </div>

                {/* Confidence */}
                <div className="col-span-2 text-right">
                  <span className="text-sand-100 font-bold text-xs">{pattern.confidence}%</span>
                </div>

                {/* Action button */}
                <div className="col-span-3 text-right">
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-[3px] text-[10px] ${
                      isActive
                        ? 'bg-sand-100 text-obsidian-950 font-bold'
                        : 'bg-obsidian-950 text-zinc-400 border border-obsidian-750'
                    }`}
                  >
                    <span>{isActive ? 'ISOLATED' : 'HIGHLIGHT'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
