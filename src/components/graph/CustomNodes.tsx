'use client';

import React, { memo, useState } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { WalletNode } from '@/types/investigation';
import {
  Target,
  ShieldAlert,
  GitBranch,
  Shuffle,
  Landmark,
  Hexagon,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

export interface CustomNodeData extends WalletNode {
  [key: string]: unknown;
  layout?: 'horizontal' | 'vertical' | 'orbital' | 'flow';
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
 * Group Box / Perimeter Network Zone — Strict Achromatic Monochrome
 * Modeled after workflow group containers (Total.js / nodal canvas)
 */
export const NetworkZoneNode = memo(({ data }: NodeProps<NetworkZoneNodeType>) => {
  const isPolygon = data.chain === 'Polygon';

  return (
    <div
      style={{
        width: data.width,
        height: data.height,
      }}
      className="relative rounded-2xl border border-obsidian-750 bg-obsidian-950/50 backdrop-blur-md pointer-events-none select-none transition-all duration-500 overflow-hidden shadow-2xl zone-manifest"
    >
      {/* Top Header Banner — modeled after "Static models" group box in reference */}
      <div className="w-full px-5 py-3 border-b border-obsidian-750 bg-obsidian-900/90 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm border border-obsidian-700 bg-obsidian-850 text-sand-100 shadow-sm">
            {isPolygon ? '⬡' : '⟠'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-sand-100">
                {data.title}
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border bg-obsidian-950 text-sand-300 border-obsidian-750 font-bold">
                {isPolygon ? 'L2 OFF-RAMP' : 'L1 DISPERSAL'}
              </span>
            </div>
            {data.subtitle && (
              <p className="text-[10px] font-mono text-sand-400 tracking-wide mt-0.5">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Technical Perimeter Coordinates */}
        <div className="hidden sm:flex items-center space-x-2 font-mono text-[10px] text-sand-500">
          <span className="px-2 py-0.5 rounded bg-obsidian-950 border border-obsidian-750 text-sand-400">
            {isPolygon ? 'POLYGON POS' : 'ETHEREUM MAINNET'}
          </span>
          <span className="w-2 h-2 rounded-full bg-sand-100 animate-pulse" />
        </div>
      </div>

      {/* Cyber Grid Watermark */}
      <div className="absolute inset-0 top-12 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Corner Tech Brackets */}
      <div className="absolute top-2 left-2 text-[9px] text-obsidian-700 font-mono">┌</div>
      <div className="absolute top-2 right-2 text-[9px] text-obsidian-700 font-mono">┐</div>
      <div className="absolute bottom-2 left-2 text-[9px] text-obsidian-700 font-mono">└</div>
      <div className="absolute bottom-2 right-2 text-[9px] text-obsidian-700 font-mono">┘</div>
    </div>
  );
});

NetworkZoneNode.displayName = 'NetworkZoneNode';

export interface OrbitalTracksData extends Record<string, unknown> {
  id: string;
}

export type OrbitalTracksNodeType = Node<OrbitalTracksData, 'orbitalTracks'>;

/**
 * Concentric Orbital Network Track Topology — Strict Monochrome
 */
export const OrbitalTracksNode = memo(({ data }: NodeProps<OrbitalTracksNodeType>) => {
  return (
    <div className="pointer-events-none select-none w-[1500px] h-[900px] relative">
      <svg viewBox="0 0 1500 900" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="orbitalSlice" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#202020" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#101010" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Orbital Track 1 */}
        <ellipse
          cx="700"
          cy="400"
          rx="340"
          ry="210"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x="700"
          y="180"
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
          fontFamily="sans-serif"
          fontWeight="500"
          textAnchor="middle"
        >
          ORBIT 01 // CORE DISPERSAL LAYER
        </text>

        {/* Orbital Track 2 */}
        <ellipse
          cx="700"
          cy="400"
          rx="520"
          ry="330"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="700"
          y="60"
          fill="rgba(255,255,255,0.3)"
          fontSize="10"
          fontFamily="sans-serif"
          fontWeight="500"
          textAnchor="middle"
        >
          ORBIT 02 // CROSS-CHAIN BRIDGE TRANSIT CORRIDOR
        </text>

        {/* Orbital Track 3 */}
        <ellipse
          cx="700"
          cy="400"
          rx="720"
          ry="460"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="5 5"
        />
        <text
          x="700"
          y="-70"
          fill="rgba(255,255,255,0.25)"
          fontSize="10"
          fontFamily="sans-serif"
          fontWeight="500"
          textAnchor="middle"
        >
          ORBIT 03 // VASP / CEX LIQUIDATION SPHERE
        </text>

        {/* Highlighted sector arc */}
        <path d="M 700 400 L 1150 220 A 720 460 0 0 1 1280 400 Z" fill="url(#orbitalSlice)" />

        {/* Center telemetry label */}
        <text
          x="700"
          y="325"
          fill="#F5F5F5"
          fontSize="26"
          fontWeight="bold"
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          110
        </text>
        <text
          x="700"
          y="345"
          fill="#AAAAAA"
          fontSize="9"
          fontFamily="sans-serif"
          fontWeight="600"
          textAnchor="middle"
          letterSpacing="0.1em"
        >
          TOPOLOGY COORDINATES • ETHEREUM / POLYGON
        </text>

        {/* Radial degree axes */}
        <line
          x1="700"
          y1="0"
          x2="700"
          y2="800"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <line
          x1="100"
          y1="400"
          x2="1300"
          y2="400"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      </svg>
    </div>
  );
});

OrbitalTracksNode.displayName = 'OrbitalTracksNode';

/**
 * Visual Workflow Forensic Node — Strict Achromatic Monochrome
 *
 * Modeled after rich nodal workflow editors (Total.js / n8n / React Flow)
 * with structured headers, visible port connectors, telemetry tables, and risk metrics.
 *
 * Visual hierarchy via SIZE + LINE WEIGHT + SHAPE + CONTRAST:
 * - suspect:      brightest white border (#F5F5F5), solid border, white halo, TARGET [HUB]
 * - victim:       medium light gray (#CCCCCC), solid border, VICTIM
 * - exchange:     silver border (#AAAAAA), dotted border accent, CEX / KYC
 * - bridge:       gray border (#888888), dashed border accent, BRIDGE
 * - intermediary: dark gray border (#555555), RELAY
 */
export const ForensicNode = memo(({ data }: NodeProps<ForensicNodeType>) => {
  const {
    label,
    address,
    entityType,
    balance,
    riskScore = 0,
    role,
    tags = [],
    txCount = 1,
    chain,
    isSelected,
    isHighlighted,
    isDimmed,
  } = data;

  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeFocus = isSelected || isHighlighted || isHovered;

  // Copy address helper
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Node Icon & Badge Config — Pure Monochrome Achromatic Hierarchy
  const getEntityConfig = () => {
    switch (entityType) {
      case 'suspect':
        return {
          icon: Target,
          badgeText: 'TARGET [HUB]',
          badgeClass: 'bg-sand-100 text-obsidian-950 border-sand-100 font-bold shadow-[0_0_12px_rgba(245,245,245,0.4)]',
          iconBoxClass: 'bg-sand-100/10 border-sand-100 text-sand-100 shadow-[0_0_8px_rgba(245,245,245,0.2)]',
          borderClass: 'border-sand-100 shadow-[0_0_20px_rgba(245,245,245,0.14)]',
          roleText: role || 'Primary Suspect Hub',
        };
      case 'victim':
        return {
          icon: ShieldAlert,
          badgeText: 'VICTIM',
          badgeClass: 'bg-obsidian-950 text-sand-200 border-sand-400 font-semibold',
          iconBoxClass: 'bg-obsidian-850 border-sand-400/80 text-sand-200',
          borderClass: 'border-sand-300/80',
          roleText: role || 'Defrauded Inflow',
        };
      case 'bridge':
        return {
          icon: Shuffle,
          badgeText: 'BRIDGE',
          badgeClass: 'bg-obsidian-950 text-sand-300 border-sand-500 font-semibold border-dashed',
          iconBoxClass: 'bg-obsidian-850 border-sand-500/80 text-sand-300',
          borderClass: 'border-sand-400/80 border-dashed',
          roleText: role || 'Cross-Chain Protocol',
        };
      case 'exchange':
        return {
          icon: Landmark,
          badgeText: 'CEX / KYC',
          badgeClass: 'bg-obsidian-950 text-sand-200 border-sand-400 font-semibold',
          iconBoxClass: 'bg-obsidian-850 border-sand-400/80 text-sand-200',
          borderClass: 'border-sand-300/80',
          roleText: role || 'Off-Ramp Liquidation',
        };
      case 'polygon':
        return {
          icon: Hexagon,
          badgeText: 'POLYGON L2',
          badgeClass: 'bg-obsidian-950 text-sand-300 border-sand-500 font-semibold',
          iconBoxClass: 'bg-obsidian-850 border-sand-500/80 text-sand-300',
          borderClass: 'border-sand-400/80',
          roleText: role || 'L2 Transit Hop',
        };
      default:
        return {
          icon: GitBranch,
          badgeText: 'RELAY',
          badgeClass: 'bg-obsidian-950 text-sand-400 border-obsidian-700 font-medium',
          iconBoxClass: 'bg-obsidian-850 border-obsidian-750 text-sand-400',
          borderClass: 'border-obsidian-750',
          roleText: role || 'Intermediary Hop',
        };
    }
  };

  const config = getEntityConfig();
  const IconComponent = config.icon;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: data.staggerIndex ? `${(data.staggerIndex as number) * 120}ms` : undefined,
      }}
      className={`group relative flex flex-col bg-gradient-to-b from-obsidian-850 via-obsidian-900 to-obsidian-950 rounded-xl w-[270px] select-none cursor-pointer transition-all duration-300 shadow-2xl overflow-hidden backdrop-blur-xl border node-manifest ${
        isSelected
          ? 'border-sand-100 ring-2 ring-sand-100/30 shadow-[0_0_30px_rgba(245,245,245,0.25)] z-30 scale-[1.02]'
          : activeFocus
          ? 'border-sand-200 shadow-[0_0_20px_rgba(245,245,245,0.15)] z-20 scale-[1.01]'
          : `${config.borderClass} hover:border-sand-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.6)] z-10`
      } ${isDimmed ? 'opacity-30 filter grayscale-[60%]' : 'opacity-100'}`}
    >
      {/* Top subtle highlight rim */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sand-100/25 to-transparent pointer-events-none z-20" />

      {/* Top Handle for orbital or vertical layout */}
      <Handle
        type="target"
        id="target-top"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-sand-100 !border-2 !border-obsidian-950 !rounded-full !-top-[5px] shadow-[0_0_6px_rgba(245,245,245,0.7)] hover:!scale-150 transition-all cursor-crosshair z-30"
      />

      {/* 1. NODE HEADER BAR — Icon Badge + Title + Category Pill */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-obsidian-800/90 border-b border-obsidian-750/90 backdrop-blur-md">
        <div className="flex items-center space-x-2.5 truncate max-w-[170px]">
          {/* Icon Badge */}
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border shadow-sm transition-transform duration-300 group-hover:scale-105 ${config.iconBoxClass}`}
          >
            <IconComponent className="w-3.5 h-3.5" />
          </div>

          {/* Title and Role */}
          <div className="flex flex-col truncate">
            <span className="font-bold text-[13px] text-sand-100 tracking-tight truncate leading-tight group-hover:text-white transition-colors">
              {label}
            </span>
            <span className="text-[9.5px] font-mono text-sand-400 truncate leading-tight mt-0.5 tracking-wide">
              {config.roleText}
            </span>
          </div>
        </div>

        {/* Category Pill */}
        <span
          className={`text-[9px] font-mono px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wider ${config.badgeClass}`}
        >
          {config.badgeText}
        </span>
      </div>

      {/* 2. CONNECTION BUS / PORTS — Single glowing precision handle on left & right (NO duplicate dots) */}
      <div className="relative px-3 py-1.5 bg-obsidian-950 border-b border-obsidian-750 flex items-center justify-between text-[9px] font-mono text-sand-400">
        {/* Ingress Port Section */}
        <div className="relative flex items-center">
          <Handle
            type="target"
            id="target-left"
            position={Position.Left}
            className="!w-2.5 !h-2.5 !bg-sand-100 !border-2 !border-obsidian-950 !rounded-full shadow-[0_0_8px_rgba(245,245,245,0.8)] hover:!scale-150 transition-all cursor-crosshair z-30"
          />
          <span className="font-semibold tracking-wider uppercase text-sand-300 pl-2 select-none text-[8.5px]">
            IN
          </span>
        </div>

        {/* Subtle Bus Telemetry Divider */}
        <div className="flex items-center space-x-1.5 opacity-30">
          <span className="w-1 h-1 rounded-full bg-sand-100" />
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-sand-100 to-transparent" />
          <span className="w-1 h-1 rounded-full bg-sand-100" />
        </div>

        {/* Egress Port Section */}
        <div className="relative flex items-center justify-end">
          <span className="font-semibold tracking-wider uppercase text-sand-300 pr-2 select-none text-[8.5px]">
            OUT
          </span>
          <Handle
            type="source"
            id="source-right"
            position={Position.Right}
            className="!w-2.5 !h-2.5 !bg-sand-100 !border-2 !border-obsidian-950 !rounded-full shadow-[0_0_8px_rgba(245,245,245,0.8)] hover:!scale-150 transition-all cursor-crosshair z-30"
          />
        </div>
      </div>

      {/* 3. STRUCTURED TELEMETRY & ATTRIBUTES */}
      <div className="flex flex-col p-3 space-y-2 bg-obsidian-900/60 text-[11px]">
        {/* Unified Key Attributes Panel (Address & Balance) */}
        <div className="bg-obsidian-850/80 rounded-lg p-2.5 border border-obsidian-750 space-y-2">
          {/* Address Row with Copy Action */}
          <div className="flex justify-between items-center">
            <span className="text-sand-500 font-mono text-[10px] uppercase tracking-wider">
              Address
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-obsidian-950/70 hover:bg-obsidian-800 border border-obsidian-750 hover:border-sand-400 text-sand-300 hover:text-sand-100 transition group/copy"
              title="Copy address"
            >
              <span className="font-mono text-[10.5px] font-medium">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              {copied ? (
                <Check className="w-2.5 h-2.5 text-sand-100" />
              ) : (
                <Copy className="w-2.5 h-2.5 text-sand-500 group-hover/copy:text-sand-200" />
              )}
            </button>
          </div>

          {/* Hairline Divider */}
          <div className="h-[1px] w-full bg-obsidian-750/70" />

          {/* Balance Row */}
          <div className="flex justify-between items-center">
            <span className="text-sand-500 font-mono text-[10px] uppercase tracking-wider">
              Balance
            </span>
            <div className="flex items-baseline">
              <span className="font-mono font-bold text-sand-100 text-[12px] tracking-tight">
                {balance.includes(' ') ? balance.split(' ')[0] : balance}
              </span>
              {balance.includes(' ') && (
                <span className="font-mono text-[9.5px] text-sand-400 ml-1 font-medium">
                  {balance.split(' ')[1]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Threat Score Assessment Panel */}
        <div className="bg-obsidian-850/80 rounded-lg p-2.5 border border-obsidian-750 space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-sand-500 uppercase tracking-wider">Threat Score</span>
            <span className="font-bold text-sand-100 flex items-center space-x-1">
              <span>{riskScore}</span>
              <span className="text-sand-500 font-normal">/100</span>
              <span className="text-sand-600">•</span>
              <span
                className={
                  riskScore >= 70
                    ? 'text-sand-100 font-bold'
                    : riskScore >= 40
                    ? 'text-sand-200'
                    : 'text-sand-400'
                }
              >
                {riskScore >= 70 ? 'CRITICAL' : riskScore >= 40 ? 'ELEVATED' : 'MINIMAL'}
              </span>
            </span>
          </div>

          {/* Precision Monochrome Progress Bar */}
          <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden border border-obsidian-750 p-[0.5px]">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-sand-400 via-sand-200 to-sand-100 shadow-[0_0_6px_rgba(245,245,245,0.4)]"
              style={{ width: `${Math.min(100, Math.max(8, riskScore))}%` }}
            />
          </div>
        </div>

        {/* Forensic Classification Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-obsidian-950 text-sand-300 border border-obsidian-750 hover:border-sand-400 transition"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded-md bg-obsidian-950 text-sand-500 border border-obsidian-750">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 4. NODE FOOTER — Chain, Stats & Inspect Action */}
      <div className="px-3.5 py-2 bg-obsidian-850 border-t border-obsidian-750 flex items-center justify-between text-[10px] font-mono text-sand-400">
        <div className="flex items-center space-x-1.5">
          <span className="text-sand-300 font-medium">
            {chain === 'Polygon' ? '⬡ POL L2' : '⟠ ETH L1'}
          </span>
          <span className="text-sand-600">•</span>
          <span>{txCount} TXs</span>
        </div>
        <div className="flex items-center space-x-1 text-sand-300 group-hover:text-sand-100 transition">
          <span className="font-semibold tracking-wide text-[10.5px]">Inspect</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Bottom Handle for orbital or vertical layout */}
      <Handle
        type="source"
        id="source-bottom"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-sand-100 !border-2 !border-obsidian-950 !rounded-full !-bottom-[5px] shadow-[0_0_6px_rgba(245,245,245,0.7)] hover:!scale-150 transition-all cursor-crosshair z-30"
      />
    </div>
  );
});

ForensicNode.displayName = 'ForensicNode';
