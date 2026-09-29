'use client';

import React, { useEffect, useState } from 'react';
import { FastForward, Check, Circle } from 'lucide-react';
import { DEMO_CASE } from '@/data/demoInvestigation';

interface InvestigationLoadingProps {
  onComplete: () => void;
  targetAddress?: string;
}

const INVESTIGATION_STEPS = [
  'RESOLVING TARGET & MULTI-CHAIN COORDINATES',
  'QUERYING RPC & ON-CHAIN STATE',
  'TRACING PEEL CHAINS & LAYERED TRANSFERS',
  'MULTI-INPUT CLUSTERING HEURISTICS',
  'VASP IDENTIFICATION & OFF-RAMP DETECTION',
  'FIU-IND MATCHING & LEGAL JURISDICTIONS',
  'BRIDGE ANALYSIS & CROSS-LEDGER MAPPING',
  'RISK SCORING & PATTERN SYNTHESIS',
  'DOSSIER SEALING & SEC 65B GENERATION',
];

const MOCK_HASHES = [
  '0x71c8364f3b821a89a967520e1c526183d4982e01',
  '0x4e83362442b8d1bec281594cea3050c8eb01311c',
  '0xd4b261830172a45c8991aa0259b19ef22871991a',
  '0x28c6c06298d514db089934071355e5743bf21d60',
  '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
];

export const InvestigationLoading: React.FC<InvestigationLoadingProps> = ({
  onComplete,
  targetAddress = DEMO_CASE.targetAddress,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentHashIndex, setCurrentHashIndex] = useState(0);

  useEffect(() => {
    const hashTimer = setInterval(() => {
      setCurrentHashIndex((prev) => (prev + 1) % MOCK_HASHES.length);
    }, 180);
    return () => clearInterval(hashTimer);
  }, []);

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
          }, 350);
          return prev;
        }
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-[calc(100vh-52px)] bg-obsidian-950 bg-obsidian-dot-grid flex flex-col items-center justify-center px-4 py-8 select-none">
      <div className="max-w-lg w-full bg-obsidian-900 border border-obsidian-750 rounded-[6px] p-6 space-y-5 text-left animate-fade-in-up">
        {/* Header (Section 18) */}
        <div className="flex items-center justify-between border-b border-obsidian-750 pb-3">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-sand-100">
              MONOMER // FORENSIC ATTRIBUTION ENGINE
            </h2>
            <div className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate max-w-[280px]">
              TARGET: <span className="text-sand-100 font-bold">{targetAddress.slice(0, 8)}...{targetAddress.slice(-6)}</span>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="text-[11px] font-mono text-sand-300 hover:text-sand-100 border border-obsidian-750 hover:border-sand-850 px-2.5 py-1 rounded-[4px] bg-obsidian-950 transition cursor-pointer flex items-center space-x-1"
            title="Fast forward attribution"
          >
            <span>SKIP</span>
            <FastForward className="w-3 h-3" />
          </button>
        </div>

        {/* Reference 4: Segmented Progress Indicator */}
        <div className="space-y-1.5 font-mono">
          <div className="flex justify-between text-[10px] text-zinc-400">
            <span>PIPELINE PROGRESS</span>
            <span className="text-sand-100 font-bold">{progress}%</span>
          </div>

          <div className="grid grid-cols-9 gap-1 h-1.5">
            {INVESTIGATION_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-full rounded-[2px] transition-all duration-300 ${
                  i < currentStep
                    ? 'bg-sand-100 shadow-[0_0_8px_rgba(245,245,245,0.4)]'
                    : i === currentStep
                    ? 'bg-sand-400 animate-pulse'
                    : 'bg-obsidian-750'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 9-Step Attribution Checklist */}
        <div className="space-y-2 font-mono text-xs pt-1">
          {INVESTIGATION_STEPS.map((stepName, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const numStr = String(index + 1).padStart(2, '0');

            return (
              <div
                key={index}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-[4px] transition-all duration-300 ease-out text-[11px] border-l-2 ${
                  isCurrent
                    ? 'bg-obsidian-850 text-sand-100 font-semibold border-sand-300 translate-x-1 shadow-[0_4px_15px_rgba(0,0,0,0.4)]'
                    : isCompleted
                    ? 'text-zinc-400 border-transparent'
                    : 'text-zinc-600 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className={`transition-colors duration-300 ${isCurrent ? 'text-sand-300' : 'text-zinc-600'}`}>{numStr}</span>
                  <span className="truncate">{stepName}</span>
                </div>

                <div className="shrink-0 ml-2">
                  {isCompleted ? (
                    <span className="text-sand-100 font-bold">✓</span>
                  ) : isCurrent ? (
                    <span className="text-sand-300 font-bold animate-pulse">●</span>
                  ) : (
                    <span className="text-zinc-600">○</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active RPC Telemetry stream */}
        <div className="pt-2 border-t border-obsidian-750 flex items-center justify-between text-[10px] font-mono text-zinc-400">
          <span className="text-zinc-600">ON-CHAIN SCAN:</span>
          <span className="text-sand-300 truncate max-w-[280px]">
            {MOCK_HASHES[currentHashIndex]}
          </span>
        </div>
      </div>
    </div>
  );
};
