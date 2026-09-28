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
  layout?: 'horizontal' | 'vertical';
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
  const isHorizontal = edgeData.layout !== 'vertical';

  // Calculate smooth curved path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: isHorizontal ? 0.35 : 0.3,
  });

  // Staggered label placement in vertical mode to avoid collisions
  let computedLabelX = labelX;
  let computedLabelY = labelY;

  if (!isHorizontal) {
    if (id === 'TX-DEMO-002') {
      // Left fan-out to Wallet B
      computedLabelY = labelY - 18;
    } else if (id === 'TX-DEMO-003') {
      // Center fan-out to Wallet C
      computedLabelY = labelY + 22;
    } else if (id === 'TX-DEMO-004') {
      // Right fan-out to Wallet D
      computedLabelY = labelY - 18;
    }
  }

  // Determine stroke styling
  const isBridge = edgeData.patternTag === 'CROSS_CHAIN';
  const strokeColor = isHighlighted
    ? '#ffffff'
    : isHovered
    ? '#e2e8f0'
    : isDimmed
    ? '#2f343a'
    : isBridge
    ? '#a1a1aa'
    : '#71717a';

  const strokeWidth = isHighlighted ? 3 : isHovered ? 2.4 : isDimmed ? 1.4 : 1.8;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (edgeData.onSelectTx) {
      edgeData.onSelectTx(id);
    }
  };

  return (
    <>
      {/* Glow path behind highlighted/hovered edge */}
      {(isHighlighted || isHovered) && (
        <path
          d={edgePath}
          fill="none"
          stroke="#ffffff"
          strokeWidth={strokeWidth + 4}
          strokeOpacity={0.12}
          strokeLinecap="round"
        />
      )}

      {/* Base Edge Path */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          opacity: isDimmed ? 0.55 : 1,
          transition: 'stroke 0.15s, stroke-width 0.15s',
        }}
      />

      {/* Animated Fund Transit Dash Layer */}
      {animateFlow && (
        <path
          d={edgePath}
          fill="none"
          stroke={isHighlighted ? '#ffffff' : '#666666'}
          strokeWidth={strokeWidth}
          strokeDasharray="4 6"
          className="animated-flow-dash"
          style={{ pointerEvents: 'none', opacity: isDimmed ? 0.35 : 0.8 }}
        />
      )}

      {/* Invisible wider hit area for easy hover/click */}
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
            className="select-none z-20 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
          >
            {/* Tactical Pill Badge */}
            <div
              className={`flex items-center space-x-1.5 px-2 py-1 rounded-sm font-mono text-[10px] cursor-pointer transition-all duration-150 border backdrop-blur-md shadow-lg ${
                isHighlighted
                  ? 'bg-[#181818] text-white border-white ring-2 ring-white/60 shadow-[0_0_12px_rgba(255,255,255,0.25)] scale-105'
                  : isHovered
                  ? 'bg-[#202020] text-white border-[#888888]'
                  : isDimmed
                  ? 'bg-[#121212]/90 text-[#888888] border-[#252525] opacity-70'
                  : 'bg-[#141414]/95 text-[#cccccc] border-[#303030] hover:border-[#777777]'
              }`}
            >
              {/* Pattern Icon / Dot */}
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isHighlighted
                    ? 'bg-white shadow-[0_0_6px_#ffffff]'
                    : edgeData.patternTag === 'CROSS_CHAIN'
                    ? 'bg-[#bbbbbb]'
                    : 'bg-[#666666]'
                }`}
              />

              {/* Amount */}
              <span className="font-bold tracking-tight text-white text-[10px]">
                {edgeData.amountFormatted || `$${edgeData.amount ?? 0}`}
              </span>

              {/* Percentage Split Badge (e.g. 40%, 35%, 25%) */}
              {showPercentages && edgeData.percentage && (
                <span className="bg-zinc-800 text-zinc-200 px-1 py-0.5 rounded text-[9px] font-semibold border border-zinc-700">
                  {edgeData.percentage}
                </span>
              )}

              {/* Cross-chain tag if applicable */}
              {edgeData.patternTag === 'CROSS_CHAIN' && (
                <span className="bg-amber-950/80 text-amber-300 border border-amber-500/40 px-1 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">
                  BRIDGE
                </span>
              )}
            </div>

            {/* Expanded Tactical Telemetry Card on Hover */}
            {isHovered && edgeData.hash && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-[#101010] border border-[#3e3e3e] p-2.5 rounded shadow-2xl z-50 text-[10px] font-mono pointer-events-auto text-[#cccccc] space-y-1.5 animate-in fade-in zoom-in-95 duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-[#242424] pb-1">
                  <span className="text-white font-bold flex items-center space-x-1">
                    <ShieldAlert className="w-3 h-3 text-white" />
                    <span>{edgeData.id}</span>
                  </span>
                  <span className="text-[9px] bg-[#202020] px-1.5 py-0.2 rounded text-[#aaaaaa] border border-[#2e2e2e]">
                    HOP #{edgeData.hopIndex ?? 1}
                  </span>
                </div>

                <div className="space-y-1 text-[9px]">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">HASH</span>
                    <span className="text-[#ffffff] font-medium truncate max-w-[130px]">
                      {edgeData.hash.slice(0, 10)}...{edgeData.hash.slice(-6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">BLOCK</span>
                    <span className="text-[#cccccc]">{edgeData.blockNumber ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">CHAIN</span>
                    <span className="text-white font-semibold">{edgeData.chain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">PATTERN</span>
                    <span className="text-white font-semibold">
                      {edgeData.patternTag?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {edgeData.notes && (
                  <p className="text-[9px] text-[#888888] pt-1 border-t border-[#222222] leading-tight line-clamp-2">
                    {edgeData.notes}
                  </p>
                )}

                <div className="pt-1 text-[8px] text-[#666666] flex items-center justify-between">
                  <span>Click edge to inspect details</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-[#888888]" />
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
