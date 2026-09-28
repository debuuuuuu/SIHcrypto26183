'use client';

import React, { useEffect, useState } from 'react';
import { FastForward } from 'lucide-react';
import { DEMO_CASE } from '@/data/demoInvestigation';

interface InvestigationLoadingProps {
  onComplete: () => void;
  targetAddress?: string;
}

const INVESTIGATION_STEPS = [
  'Resolving target wallet',
  'Loading transaction history',
  'Tracing fund movement',
  'Building transaction graph',
  'Detecting behavioral patterns',
  'Checking entity intelligence',
  'Analyzing cross-chain activity',
  'Calculating risk signals',
  'Preparing evidence records',
];

export const InvestigationLoading: React.FC<InvestigationLoadingProps> = ({
  onComplete,
  targetAddress = DEMO_CASE.targetAddress,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalMs = 280;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < INVESTIGATION_STEPS.length - 1) {
          const next = prev + 1;
          setProgress(Math.round((next / (INVESTIGATION_STEPS.length - 1)) * 100));
          return next;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 300);
          return prev;
        }
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-[calc(100vh-3.25rem)] bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-8 select-none">
      <div className="max-w-md w-full bg-[#121212] border border-[#242424] rounded-lg p-6 space-y-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#242424] pb-3">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              INVESTIGATION IN PROGRESS
            </h2>
            <p className="text-[11px] text-[#888888] font-mono mt-0.5 truncate max-w-[260px]">
              Target: {targetAddress}
            </p>
          </div>

          <button
            onClick={onComplete}
            className="text-[11px] font-mono text-[#888888] hover:text-white border border-[#2e2e2e] hover:border-[#555555] px-2 py-0.5 rounded transition flex items-center space-x-1"
            title="Skip sequence"
          >
            <span>Skip</span>
            <FastForward className="w-3 h-3" />
          </button>
        </div>

        {/* Minimal Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-[#888888]">
            <span>Progress</span>
            <span className="text-white font-semibold">{progress}%</span>
          </div>
          <div className="w-full h-1 bg-[#1c1c1c] rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Telemetry Checklist */}
        <div className="space-y-2 font-mono text-xs text-left">
          {INVESTIGATION_STEPS.map((step, idx) => {
            const isFinished = idx < currentStep;
            const isCurrent = idx === currentStep;

            if (idx > currentStep + 1) return null;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between py-1 border-b border-[#1a1a1a] transition-all ${
                  isFinished
                    ? 'text-[#888888]'
                    : isCurrent
                    ? 'text-white font-semibold'
                    : 'text-[#444444]'
                }`}
              >
                <span>{step}</span>
                <span className="shrink-0 font-bold">
                  {isFinished ? '✓' : isCurrent ? '...' : ''}
                </span>
              </div>
            );
          })}
        </div>

        {/* Case Reference Footer */}
        <div className="text-[10px] font-mono text-[#555555] text-center pt-1">
          CASE INV-DEMO-2026-001 • SIMULATED ANALYSIS
        </div>
      </div>
    </div>
  );
};
