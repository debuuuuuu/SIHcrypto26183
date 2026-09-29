'use client';

import React, { memo, useState } from 'react';
import {
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { ShieldAlert, ArrowUpRight } from 'lucide-react';
import { TransactionEdge } from '@/types/investigation';

export interface ForensicEdgeData extends Partial<TransactionEdge> {
  [key: string]: unknown;
  layout?: 'horizontal' | 'vertical' | 'orbital' | 'flow';
  percentage?: string;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  showLabels?: boolean;
  showPercentages?: boolean;
  animateFlow?: boolean;
  onSelectTx?: (txId: string) => void;
}

export const ForensicEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data = {},
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  const edgeData = data as ForensicEdgeData;
  const isHighlighted = Boolean(edgeData.isHighlighted);
  const isDimmed = Boolean(edgeData.isDimmed);
  const showLabels = edgeData.showLabels !== false;
  const showPercentages = Boolean(edgeData.showPercentages);
  const animateFlow = edgeData.animateFlow !== false;
  const isFlow = edgeData.layout === 'flow';

  let edgePath, labelX, labelY;

  // Orthogonal circuit board layout for flow mode (commit f9cc384)
  if (isFlow) {
    const [path, x, y] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 16,
    });
    edgePath = path;
    labelX = x;
    labelY = y;
  } else {
    const [path, x, y] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      curvature: 0.25,
    });
    edgePath = path;
    labelX = x;
    labelY = y;
  }

  const computedLabelX = labelX;
  const computedLabelY = labelY;

  // Pure Monochrome stroke rules
  const strokeColor = isHighlighted
    ? '#F5F5F5' // sand-100
    : isHovered
    ? '#A3A3A3'
    : isDimmed
    ? '#202020' // obsidian-750
    : '#555555'; // mono-500

  const strokeWidth = isHighlighted ? 2.5 : isHovered ? 2.2 : 1.8;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (edgeData.onSelectTx) {
      edgeData.onSelectTx(id);
    }
  };

  return (
    <>
      {/* Base Circuit Edge Path with Line Tracing Animation */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        className="edge-draw"
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          opacity: isDimmed ? 0.25 : 1,
          transition: 'stroke 0.2s, stroke-width 0.2s, opacity 0.2s',
        }}
      />

      {/* Animated Fund Transit Dash Layer (White Marching Ants) */}
      {animateFlow && (
        <path
          d={edgePath}
          fill="none"
          stroke="#F5F5F5"
          strokeWidth={isHighlighted ? 2.5 : 1.8}
          strokeDasharray={isHighlighted ? '4 8' : '3 6'}
          className="animated-flow-dash"
          style={{
            pointerEvents: 'none',
            opacity: isDimmed ? 0 : isHighlighted ? 0.9 : 0.45,
            filter: isHighlighted
              ? 'drop-shadow(0 0 6px rgba(245,245,245,0.7))'
              : 'none',
          }}
        />
      )}

      {/* Invisible wider hit area for hover/click */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      />

      {/* HTML Edge Label Renderer — Elevated Status Badge in Strict Monochrome */}
      {showLabels && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${computedLabelX}px,${computedLabelY}px)`,
              pointerEvents: 'all',
            }}
            className={`select-none z-20 group transition-all duration-200 pill-manifest ${
              isDimmed ? 'opacity-35' : 'opacity-100'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
          >
            {/* Tactical Flow Pill Badge */}
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-mono text-[10.5px] cursor-pointer transition-all border shadow-lg backdrop-blur-md ${
                isHighlighted
                  ? 'bg-sand-100 border-sand-100 text-obsidian-950 ring-2 ring-sand-100/30 shadow-[0_0_15px_rgba(245,245,245,0.3)]'
                  : isHovered
                  ? 'bg-obsidian-850 border-obsidian-700 text-sand-100 shadow-xl'
                  : 'bg-obsidian-900 border-obsidian-750 text-sand-300 hover:border-obsidian-700 hover:text-sand-100'
              }`}
            >
              {/* Active Flow Transit Dot */}
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isHighlighted ? 'bg-obsidian-950' : 'bg-sand-100 shadow-[0_0_5px_rgba(255,255,255,0.6)]'
                } animate-pulse shrink-0`}
              />

              {/* Amount */}
              <span
                className={`font-semibold tracking-tight ${
                  isHighlighted ? 'text-obsidian-950 font-bold' : 'text-sand-100 font-bold'
                }`}
              >
                {edgeData.amountFormatted || `$${edgeData.amount ?? 0}`}
              </span>

              {/* Percentage Split Badge (e.g. 100%, 40%, 35%, 25%) */}
              {showPercentages && edgeData.percentage && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono border font-semibold ${
                    isHighlighted
                      ? 'bg-obsidian-950 text-sand-100 border-obsidian-900'
                      : 'bg-obsidian-950 text-sand-300 border-obsidian-750'
                  }`}
                >
                  {edgeData.percentage}
                </span>
              )}

              {/* Cross-chain tag if applicable */}
              {edgeData.patternTag === 'CROSS_CHAIN' && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[8.5px] uppercase tracking-wider font-mono font-bold border ${
                    isHighlighted
                      ? 'bg-obsidian-950 text-sand-100 border-obsidian-900'
                      : 'bg-obsidian-950 text-sand-100 border-obsidian-750'
                  }`}
                >
                  ⇄ BRIDGE
                </span>
              )}
            </div>

            {/* Expanded Tactical Telemetry Card on Hover */}
            {isHovered && edgeData.hash && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-obsidian-900 border border-obsidian-750 p-3 rounded-lg shadow-2xl z-50 text-[10px] font-mono pointer-events-auto text-sand-400 space-y-1.5 backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-obsidian-750 pb-1.5">
                  <span className="text-sand-100 font-bold flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-sand-100" />
                    <span>{edgeData.id}</span>
                  </span>
                  <span className="text-[9px] bg-obsidian-850 px-1.5 py-0.5 rounded text-sand-400 border border-obsidian-750">
                    HOP #{edgeData.hopIndex ?? 1}
                  </span>
                </div>

                <div className="space-y-1 text-[9.5px]">
                  <div className="flex justify-between">
                    <span className="text-sand-500">HASH</span>
                    <span className="text-sand-200 font-medium truncate max-w-[130px]">
                      {edgeData.hash.slice(0, 10)}...{edgeData.hash.slice(-6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sand-500">BLOCK</span>
                    <span className="text-sand-400">{edgeData.blockNumber ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sand-500">CHAIN</span>
                    <span className="text-sand-100 font-bold">{edgeData.chain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sand-500">PATTERN</span>
                    <span className="text-sand-100 font-bold">
                      {edgeData.patternTag?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {edgeData.notes && (
                  <p className="text-[9px] text-sand-400 pt-1.5 border-t border-obsidian-750 leading-tight line-clamp-2 font-sans">
                    {edgeData.notes}
                  </p>
                )}

                <div className="pt-1 text-[8.5px] text-sand-500 flex items-center justify-between">
                  <span>Click edge to inspect</span>
                  <ArrowUpRight className="w-3 h-3 text-sand-500" />
                </div>
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

ForensicEdge.displayName = 'ForensicEdge';
