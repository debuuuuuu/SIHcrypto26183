'use client';

import React, { memo, useState } from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { ShieldAlert, ArrowUpRight } from 'lucide-react';
import { TransactionEdge } from '@/types/investigation';

export interface ForensicEdgeData extends Partial<TransactionEdge> {
  [key: string]: unknown;
  layout?: 'horizontal' | 'vertical' | 'orbital';
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
  const isHorizontal = edgeData.layout === 'horizontal';

  // Calculate smooth curved path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: isHorizontal ? 0.35 : 0.25,
  });

  // Staggered label placement in vertical mode to avoid collisions
  let computedLabelX = labelX;
  let computedLabelY = labelY;

  if (edgeData.layout === 'vertical') {
    if (id === 'TX-DEMO-002') {
      computedLabelY = labelY - 18;
    } else if (id === 'TX-DEMO-003') {
      computedLabelY = labelY + 22;
    } else if (id === 'TX-DEMO-004') {
      computedLabelY = labelY - 18;
    }
  }

  // Section 27: Stroke styling rules
  const strokeColor = isHighlighted
    ? '#F4F0E8'
    : isHovered
    ? '#D5CDBF'
    : isDimmed
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(255, 255, 255, 0.40)';

  const strokeWidth = isHighlighted ? 2 : isHovered ? 1.5 : 1;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (edgeData.onSelectTx) {
      edgeData.onSelectTx(id);
    }
  };

  return (
    <>
      {/* Base Edge Path */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          opacity: isDimmed ? 0.2 : 1,
          transition: 'stroke 0.2s, stroke-width 0.2s, opacity 0.2s',
        }}
      />

      {/* Animated Fund Transit Dash Layer */}
      {animateFlow && (
        <path
          d={edgePath}
          fill="none"
          stroke={isHighlighted ? '#F4F0E8' : 'rgba(255, 255, 255, 0.6)'}
          strokeWidth={strokeWidth}
          strokeDasharray="4 6"
          className="animated-flow-dash"
          style={{ pointerEvents: 'none', opacity: isDimmed ? 0.15 : 0.7 }}
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

      {/* HTML Edge Label Renderer */}
      {showLabels && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${computedLabelX}px,${computedLabelY}px)`,
              pointerEvents: 'all',
            }}
            className={`select-none z-20 group transition-opacity duration-200 ${
              isDimmed ? 'opacity-20' : 'opacity-100'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
          >
            {/* Tactical Pill Badge */}
            <div
              className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-[3px] font-mono text-[10px] cursor-pointer transition-colors border shadow-md ${
                isHighlighted
                  ? 'bg-obsidian-850 text-sand-100 border-sand-100'
                  : isHovered
                  ? 'bg-obsidian-850 text-sand-100 border-sand-300'
                  : 'bg-obsidian-900 text-zinc-400 border-obsidian-750 hover:border-sand-850 hover:text-sand-100'
              }`}
            >
              {/* Amount */}
              <span className="font-semibold tracking-tight text-sand-100 text-[10px]">
                {edgeData.amountFormatted || `$${edgeData.amount ?? 0}`}
              </span>

              {/* Percentage Split Badge (e.g. 40%, 35%, 25%) */}
              {showPercentages && edgeData.percentage && (
                <span className="bg-obsidian-950 text-sand-300 px-1 py-0.2 rounded-[2px] text-[9px] font-mono border border-obsidian-750">
                  {edgeData.percentage}
                </span>
              )}

              {/* Cross-chain tag if applicable */}
              {edgeData.patternTag === 'CROSS_CHAIN' && (
                <span className="bg-obsidian-950 text-sand-100 border border-obsidian-750 px-1 py-0.2 rounded-[2px] text-[8px] uppercase tracking-wider font-mono">
                  BRIDGE
                </span>
              )}
            </div>

            {/* Expanded Tactical Telemetry Card on Hover */}
            {isHovered && edgeData.hash && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-obsidian-900 border border-obsidian-750 p-2.5 rounded-[4px] shadow-2xl z-50 text-[10px] font-mono pointer-events-auto text-zinc-400 space-y-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-obsidian-750 pb-1">
                  <span className="text-sand-100 font-bold flex items-center space-x-1">
                    <ShieldAlert className="w-3 h-3 text-sand-100" />
                    <span>{edgeData.id}</span>
                  </span>
                  <span className="text-[9px] bg-obsidian-950 px-1.5 py-0.2 rounded-[2px] text-zinc-400 border border-obsidian-750">
                    HOP #{edgeData.hopIndex ?? 1}
                  </span>
                </div>

                <div className="space-y-1 text-[9px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">HASH</span>
                    <span className="text-sand-100 font-medium truncate max-w-[130px]">
                      {edgeData.hash.slice(0, 10)}...{edgeData.hash.slice(-6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">BLOCK</span>
                    <span className="text-zinc-400">{edgeData.blockNumber ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">CHAIN</span>
                    <span className="text-sand-100 font-semibold">{edgeData.chain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">PATTERN</span>
                    <span className="text-sand-100 font-semibold">
                      {edgeData.patternTag?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {edgeData.notes && (
                  <p className="text-[9px] text-zinc-400 pt-1 border-t border-obsidian-750 leading-tight line-clamp-2 font-sans">
                    {edgeData.notes}
                  </p>
                )}

                <div className="pt-1 text-[8px] text-zinc-600 flex items-center justify-between">
                  <span>Click edge to inspect</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-zinc-400" />
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
