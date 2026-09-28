'use client';

import React, { memo, useState } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import {
  User,
  ShieldAlert,
  Wallet,
  ArrowLeftRight,
  Building2,
  Layers,
  Copy,
  Check,
  Lock,
  ArrowRight,
  ArrowDownRight,
  ExternalLink,
} from 'lucide-react';
import { WalletNode } from '@/types/investigation';

export interface CustomNodeData extends WalletNode {
  [key: string]: unknown;
  layout?: 'horizontal' | 'vertical';
  isSelected?: boolean;
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

export type ForensicNodeType = Node<CustomNodeData, 'forensicNode'>;

export interface NetworkZoneData extends Record<string, unknown> {
  id: string;
  title: string;
  subtitle: string;
  chain: 'Ethereum' | 'Polygon';
  width: number;
  height: number;
}

export type NetworkZoneNodeType = Node<NetworkZoneData, 'networkZone'>;

/**
 * Background Network Perimeter / Group Container Node
 */
export const NetworkZoneNode = memo(({ data }: NodeProps<NetworkZoneNodeType>) => {
  const isPolygon = data.chain === 'Polygon';

  return (
    <div
      style={{ width: data.width, height: data.height }}
      className={`relative rounded-2xl border pointer-events-none select-none transition-all duration-300 ${
        isPolygon
          ? 'border-purple-500/25 bg-gradient-to-br from-purple-950/15 via-[#130f1c]/25 to-transparent shadow-[inset_0_0_40px_rgba(168,85,247,0.04)]'
          : 'border-zinc-700/35 bg-gradient-to-br from-zinc-900/20 via-[#0e1013]/25 to-transparent shadow-[inset_0_0_40px_rgba(255,255,255,0.02)]'
      }`}
    >
      {/* Network Header Pill */}
      <div className="absolute top-3 left-3.5 flex items-center space-x-2">
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md ${
            isPolygon
              ? 'bg-purple-950/70 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
              : 'bg-[#15171a]/85 border-zinc-700/60 text-zinc-300 shadow-md'
          }`}
        >
          <span className="text-xs">{isPolygon ? '⬡' : '⟠'}</span>
          <span>{data.title}</span>
        </div>
        {data.subtitle && (
          <span className="text-[10px] font-mono text-zinc-500 tracking-wide hidden sm:inline">
            {data.subtitle}
          </span>
        )}
      </div>

      {/* Watermark in corner */}
      <div className="absolute bottom-3 right-4 pointer-events-none opacity-15 text-[26px] font-mono font-black select-none text-zinc-500 tracking-widest">
        {isPolygon ? 'POLYGON POS' : 'ETHEREUM MAINNET'}
      </div>
    </div>
  );
});

NetworkZoneNode.displayName = 'NetworkZoneNode';

/**
 * Tactical Forensic Entity Node Card
 */
export const ForensicNode = memo(({ data }: NodeProps<ForensicNodeType>) => {
  const {
    id,
    label,
    address,
    entityType,
    chain,
    balance,
    riskScore,
    isSelected,
    isHighlighted,
    isDimmed,
    role,
    txCount,
    layout = 'horizontal',
  } = data;

  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Entity-specific iconography
  const getEntityIcon = () => {
    switch (entityType) {
      case 'victim':
        return <User className="w-3.5 h-3.5 text-sky-400" />;
      case 'suspect':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'bridge':
        return <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />;
      case 'exchange':
        return <Building2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'polygon':
        return <Layers className="w-3.5 h-3.5 text-purple-400" />;
      default:
        if (id === 'walletD') {
          return <Lock className="w-3.5 h-3.5 text-purple-400" />;
        }
        return <Wallet className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  // Tactical Role Badges
  const getRoleBadge = () => {
    if (entityType === 'suspect') {
      return {
        badge: 'TARGET HUB',
        sub: 'PRIMARY SUSPECT',
        colorClass: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
      };
    }
    if (entityType === 'victim') {
      return {
        badge: 'COMPLAINANT',
        sub: 'VICTIM INGRESS',
        colorClass: 'bg-sky-950/80 text-sky-300 border-sky-500/50',
      };
    }
    if (entityType === 'bridge') {
      return {
        badge: 'BRIDGE GATEWAY',
        sub: 'CROSS-CHAIN',
        colorClass: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
      };
    }
    if (entityType === 'exchange') {
      return {
        badge: 'CEX OFF-RAMP',
        sub: 'SUBPOENA POINT',
        colorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
      };
    }
    if (id === 'walletD') {
      return {
        badge: 'COLD STORAGE',
        sub: 'DORMANT PARKING',
        colorClass: 'bg-purple-950/80 text-purple-300 border-purple-500/50',
      };
    }
    return {
      badge: role?.toUpperCase() || 'INTERMEDIARY',
      sub: 'LAYERING HOP',
      colorClass: 'bg-zinc-900 text-zinc-300 border-zinc-700',
    };
  };

  const roleMeta = getRoleBadge();
  const isSuspectTarget = entityType === 'suspect';

  // Semantic border & glow styling
  const getCardBorderClasses = () => {
    if (isSelected) {
      return 'border-white bg-[#191a1d] shadow-[0_0_20px_rgba(255,255,255,0.22)] ring-1 ring-white scale-[1.02]';
    }
    if (isHighlighted) {
      return 'border-zinc-200 bg-[#16171a] shadow-[0_0_14px_rgba(255,255,255,0.12)] scale-[1.01]';
    }
    if (isDimmed) {
      return 'border-zinc-800/60 bg-[#0d0d0e] opacity-40 hover:opacity-90 hover:border-zinc-600';
    }
    if (isSuspectTarget) {
      return 'border-rose-500/60 bg-[#141011] shadow-[0_0_14px_rgba(244,63,94,0.15)] hover:border-rose-400';
    }
    if (entityType === 'victim') {
      return 'border-sky-500/40 bg-[#0f1418] hover:border-sky-400';
    }
    if (entityType === 'bridge') {
      return 'border-amber-500/40 bg-[#16130d] hover:border-amber-400';
    }
    if (entityType === 'exchange') {
      return 'border-emerald-500/45 bg-[#0f1612] hover:border-emerald-400';
    }
    if (id === 'walletD') {
      return 'border-purple-500/40 bg-[#130f18] hover:border-purple-400';
    }
    return 'border-[#26282b] bg-[#111214] hover:border-[#4b5057]';
  };

  return (
    <div
      className={`relative rounded-lg transition-all duration-200 cursor-pointer select-none w-[250px] shadow-xl border ${getCardBorderClasses()}`}
    >
      {/* Corner Tactical Reticles for Selected or Target Suspect */}
      {(isSelected || isSuspectTarget) && (
        <>
          <div
            className={`absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 pointer-events-none rounded-tl-sm ${
              isSuspectTarget && !isSelected ? 'border-rose-400' : 'border-white'
            }`}
          />
          <div
            className={`absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 pointer-events-none rounded-tr-sm ${
              isSuspectTarget && !isSelected ? 'border-rose-400' : 'border-white'
            }`}
          />
          <div
            className={`absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 pointer-events-none rounded-bl-sm ${
              isSuspectTarget && !isSelected ? 'border-rose-400' : 'border-white'
            }`}
          />
          <div
            className={`absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 pointer-events-none rounded-br-sm ${
              isSuspectTarget && !isSelected ? 'border-rose-400' : 'border-white'
            }`}
          />
        </>
      )}

      {/* Dynamic Connection Handles for Horizontal vs Vertical Layouts */}
      {layout === 'horizontal' ? (
        <>
          <Handle
            type="target"
            id="target-left"
            position={Position.Left}
            className="!w-2.5 !h-2.5 !bg-[#121214] !border-2 !border-[#777777] hover:!border-white !rounded-full -left-1.5 transition-colors shadow-sm"
          />
          <Handle
            type="source"
            id="source-right"
            position={Position.Right}
            className="!w-2.5 !h-2.5 !bg-[#121214] !border-2 !border-[#777777] hover:!border-white !rounded-full -right-1.5 transition-colors shadow-sm"
          />
        </>
      ) : (
        <>
          <Handle
            type="target"
            id="target-top"
            position={Position.Top}
            className="!w-2.5 !h-2.5 !bg-[#121214] !border-2 !border-[#777777] hover:!border-white !rounded-full -top-1.5 transition-colors shadow-sm"
          />
          <Handle
            type="source"
            id="source-bottom"
            position={Position.Bottom}
            className="!w-2.5 !h-2.5 !bg-[#121214] !border-2 !border-[#777777] hover:!border-white !rounded-full -bottom-1.5 transition-colors shadow-sm"
          />
        </>
      )}

      <div className="p-3 space-y-2.5">
        {/* Top Header: Role Tag + Chain Badge */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
          <div className="flex items-center space-x-1.5 truncate">
            <span
              className={`text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-sm uppercase border ${roleMeta.colorClass}`}
            >
              {roleMeta.badge}
            </span>
            {roleMeta.sub && (
              <span className="text-[9px] font-mono text-zinc-500 hidden sm:inline truncate">
                {roleMeta.sub}
              </span>
            )}
          </div>

          <span
            className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border shrink-0 ${
              chain === 'Ethereum'
                ? 'bg-[#16181b] border-zinc-700/60 text-zinc-300'
                : 'bg-purple-950/50 border-purple-500/40 text-purple-300'
            }`}
          >
            {chain === 'Ethereum' ? 'ETH L1' : 'POLYGON'}
          </span>
        </div>

        {/* Node Body: Icon + Label + Monospace Address with Copy Trigger */}
        <div className="flex items-start space-x-2.5">
          <div
            className={`p-1.5 rounded-md shrink-0 mt-0.5 border ${
              isSuspectTarget
                ? 'bg-rose-950/50 border-rose-500/50'
                : entityType === 'victim'
                ? 'bg-sky-950/50 border-sky-500/40'
                : entityType === 'bridge'
                ? 'bg-amber-950/50 border-amber-500/40'
                : entityType === 'exchange'
                ? 'bg-emerald-950/50 border-emerald-500/40'
                : id === 'walletD'
                ? 'bg-purple-950/50 border-purple-500/40'
                : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            {getEntityIcon()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-white truncate font-sans tracking-tight">
                {label}
              </h4>
              {txCount !== undefined && (
                <span className="text-[9px] font-mono text-zinc-400 uppercase ml-1 shrink-0">
                  {txCount} {txCount === 1 ? 'TX' : 'TXS'}
                </span>
              )}
            </div>

            {/* Address with Click-to-Copy */}
            <div
              onClick={handleCopy}
              className="group/addr inline-flex items-center space-x-1 mt-0.5 px-1 py-0.5 rounded hover:bg-zinc-800/80 cursor-pointer transition text-[10px] font-mono text-zinc-400 hover:text-white"
              title="Click to copy address"
            >
              <span>
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              {copied ? (
                <Check className="w-2.5 h-2.5 text-emerald-400" />
              ) : (
                <Copy className="w-2.5 h-2.5 opacity-0 group-hover/addr:opacity-100 transition-opacity text-zinc-400" />
              )}
              {copied && <span className="text-[8px] text-emerald-400 font-sans">COPIED</span>}
            </div>
          </div>
        </div>

        {/* Tactical 10-Segment LED Risk Meter */}
        <div className="bg-[#101114] border border-zinc-800/80 p-1.5 rounded-md space-y-1">
          <div className="flex items-center justify-between text-[9px] font-mono">
            <span className="text-zinc-500 tracking-wider uppercase">THREAT RATING</span>
            <span
              className={`font-mono font-bold ${
                riskScore >= 70
                  ? 'text-rose-400'
                  : riskScore >= 40
                  ? 'text-amber-300'
                  : 'text-emerald-400'
              }`}
            >
              {riskScore}/100
            </span>
          </div>

          {/* 10 Visual LED Blocks */}
          <div className="grid grid-cols-10 gap-0.5 h-1.5 w-full">
            {Array.from({ length: 10 }).map((_, i) => {
              const threshold = (i + 1) * 10;
              const isFilled = riskScore >= threshold - 5;
              return (
                <div
                  key={i}
                  className={`h-full rounded-xs transition-colors duration-150 ${
                    isFilled
                      ? riskScore >= 70
                        ? 'bg-rose-500 shadow-[0_0_4px_rgba(244,63,94,0.6)]'
                        : riskScore >= 40
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                      : 'bg-zinc-800/50'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom Financial Telemetry Footer */}
        <div className="pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono">
          <div className="truncate mr-2">
            <span className="text-zinc-500 text-[8px] uppercase tracking-wider block">
              HOLDING BALANCE
            </span>
            <span className="text-zinc-200 font-semibold truncate block">
              {balance}
            </span>
          </div>

          <div className="text-right shrink-0">
            <span className="text-zinc-500 text-[8px] uppercase tracking-wider block">
              FLOW STATUS
            </span>
            <span
              className={`font-semibold flex items-center justify-end space-x-0.5 ${
                isSuspectTarget
                  ? 'text-rose-400'
                  : id === 'walletD'
                  ? 'text-purple-300'
                  : 'text-zinc-300'
              }`}
            >
              <span>{isSuspectTarget ? 'HUB / ACTIVE' : id === 'walletD' ? 'PARKED' : 'TRACED'}</span>
              <ArrowDownRight className="w-2.5 h-2.5 text-zinc-500" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ForensicNode.displayName = 'ForensicNode';

