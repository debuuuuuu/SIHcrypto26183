'use client';

import React from 'react';
import { getAllDetections } from '@/lib/detectionEngine';
import { Eye, ChevronRight } from 'lucide-react';

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
    <div className="h-full flex flex-col bg-[#0a0a0a] text-white p-6 overflow-y-auto select-none font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-2 mb-6">
        <div>
          <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block">
            HEURISTIC ANALYSIS
          </span>
          <h2 className="text-xl font-bold font-sans text-white tracking-tight">
            Detected Behavioral Patterns
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            5 laundering patterns identified across investigated transaction sequences
          </p>
        </div>

        {activeDetectionId && (
          <button
            onClick={() => onSelectDetection(null)}
            className="text-xs font-mono text-white hover:bg-[#222222] border border-[#383838] bg-[#161616] px-3 py-1.5 rounded transition flex items-center space-x-1.5 self-start"
          >
            <Eye className="w-3.5 h-3.5 text-[#888888]" />
            <span>Reset Graph Filter</span>
          </button>
        )}
      </div>

      {/* Clean Numbered Investigation List */}
      <div className="space-y-3 max-w-4xl">
        {detections.map((pattern, index) => {
          const isActive = activeDetectionId === pattern.id;
          const numStr = String(index + 1).padStart(2, '0');

          return (
            <div
              key={pattern.id}
              onClick={() => onSelectDetection(isActive ? null : pattern.id)}
              className={`p-4 rounded border transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#1a1a1a] border-white shadow-sm'
                  : 'bg-[#111111] border-[#242424] hover:border-[#444444] hover:bg-[#161616]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start space-x-4">
                  {/* Number */}
                  <span className="text-sm font-mono font-bold text-[#666666] shrink-0 pt-0.5">
                    {numStr}
                  </span>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        {pattern.title}
                      </h3>
                      <span className="text-[10px] font-mono text-[#888888] uppercase border border-[#2a2a2a] px-1.5 py-0.2 rounded">
                        {pattern.severity}
                      </span>
                    </div>

                    <p className="text-xs text-[#aaaaaa] leading-relaxed">
                      {pattern.description}
                    </p>

                    {/* Telemetry signals */}
                    <div className="pt-2 space-y-1">
                      {pattern.indicators.map((ind, idx) => (
                        <div
                          key={idx}
                          className="text-[11px] font-mono text-[#777777] flex items-center space-x-1.5"
                        >
                          <span className="text-[#999999]">•</span>
                          <span>{ind}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Confidence & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-1 border-t sm:border-t-0 border-[#242424]">
                  <div className="text-left sm:text-right font-mono">
                    <span className="text-[10px] text-[#666666] block">CONFIDENCE</span>
                    <span className="text-sm font-bold text-white">
                      {pattern.confidence}%
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition flex items-center space-x-1 ${
                      isActive
                        ? 'bg-white text-black font-semibold'
                        : 'bg-[#1f1f1f] text-[#aaaaaa] hover:text-white'
                    }`}
                  >
                    <span>{isActive ? 'Isolated on Graph' : 'Highlight Flow'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
