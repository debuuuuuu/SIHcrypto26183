'use client';

import React, { memo, useState } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { WalletNode } from '@/types/investigation';

export interface CustomNodeData extends WalletNode {
  [key: string]: unknown;
  layout?: 'horizontal' | 'vertical' | 'orbital';
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
 * Monochrome Network Perimeter Zone
 */
export const NetworkZoneNode = memo(({ data }: NodeProps<NetworkZoneNodeType>) => {
  return (
    <div
      style={{ width: data.width, height: data.height }}
      className="relative rounded-[6px] border border-[#202020] bg-[#050505]/40 pointer-events-none select-none transition-opacity duration-300"
    >
      <div className="absolute top-2.5 left-3 flex items-center space-x-2">
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#303030] bg-[#0C0C0C] text-[#F5F5F5]">
          <span>{data.chain === 'Polygon' ? '⬡' : '⟠'}</span>
          <span>{data.title}</span>
        </div>
        {data.subtitle && (
          <span className="text-[10px] font-mono text-[#555555] tracking-wide hidden sm:inline">
            {data.subtitle}
          </span>
        )}
      </div>
    </div>
  );
});

NetworkZoneNode.displayName = 'NetworkZoneNode';

export interface OrbitalTracksData extends Record<string, unknown> {
  id: string;
}

export type OrbitalTracksNodeType = Node<OrbitalTracksData, 'orbitalTracks'>;

/**
 * Concentric Orbital Network Track Topology — fully monochrome
 */
export const OrbitalTracksNode = memo(({ data }: NodeProps<OrbitalTracksNodeType>) => {
  return (
    <div className="pointer-events-none select-none w-[1500px] h-[900px] relative">
      <svg viewBox="0 0 1500 900" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="orbitalCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orbitalSlice" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#555555" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#333333" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Ambient center glow */}
        <circle cx="700" cy="400" r="320" fill="url(#orbitalCenterGlow)" />

        {/* Orbital Track 1 */}
        <ellipse cx="700" cy="400" rx="340" ry="210" fill="none" stroke="#202020" strokeWidth="1" strokeDasharray="3 3" />
        <text x="700" y="180" fill="#444444" fontSize="10" fontFamily="monospace" textAnchor="middle">
          ORBIT 01 // CORE DISPERSAL LAYER
        </text>

        {/* Orbital Track 2 */}
        <ellipse cx="700" cy="400" rx="520" ry="330" fill="none" stroke="#202020" strokeWidth="1" strokeDasharray="4 4" />
        <text x="700" y="60" fill="#444444" fontSize="10" fontFamily="monospace" textAnchor="middle">
          ORBIT 02 // CROSS-CHAIN BRIDGE TRANSIT CORRIDOR
        </text>

        {/* Orbital Track 3 */}
        <ellipse cx="700" cy="400" rx="720" ry="460" fill="none" stroke="#202020" strokeWidth="1" strokeDasharray="5 5" />
        <text x="700" y="-70" fill="#444444" fontSize="10" fontFamily="monospace" textAnchor="middle">
          ORBIT 03 // VASP / CEX LIQUIDATION SPHERE
        </text>

        {/* Highlighted sector arc */}
        <path d="M 700 400 L 1150 220 A 720 460 0 0 1 1280 400 Z" fill="url(#orbitalSlice)" />

        {/* Center telemetry label */}
        <text x="700" y="325" fill="#F5F5F5" fontSize="26" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          110
        </text>
        <text x="700" y="345" fill="#666666" fontSize="9" fontFamily="monospace" textAnchor="middle" letterSpacing="0.1em">
          TOPOLOGY COORDINATES • ETHEREUM / POLYGON
        </text>

        {/* Radial degree axes */}
        <line x1="700" y1="0" x2="700" y2="800" stroke="#181818" strokeWidth="1" strokeDasharray="2 4" />
        <line x1="100" y1="400" x2="1300" y2="400" stroke="#181818" strokeWidth="1" strokeDasharray="2 4" />
      </svg>
    </div>
  );
});

OrbitalTracksNode.displayName = 'OrbitalTracksNode';

/**
 * Forensic Graph Entity Node — strictly monochrome.
 * Visual hierarchy via SIZE + LINE WEIGHT + SHAPE, NOT color.
 *
 * suspect:      largest, brightest white ring (#F5F5F5), solid border
 * victim:       medium, light gray ring (#CCCCCC), solid border
 * exchange:     medium, light gray ring (#BBBBBB), dotted border
 * bridge:       small, gray ring (#888888), dashed border
 * intermediary: smallest, dark gray ring (#555555)
 */
export const ForensicNode = memo(({ data }: NodeProps<ForensicNodeType>) => {
  const {
    label,
    address,
    entityType,
    balance,
    isSelected,
    isHighlighted,
    isDimmed,
  } = data;

  const [isHovered, setIsHovered] = useState(false);
  const activeFocus = isSelected || isHighlighted || isHovered;

  // Grayscale ring color — brighter = higher forensic importance
  const getRingColor = () => {
    if (isSelected) return '#FFFFFF';
    switch (entityType) {
      case 'suspect':     return activeFocus ? '#FFFFFF' : '#E5E5E5';
      case 'victim':      return activeFocus ? '#DDDDDD' : '#AAAAAA';
      case 'exchange':    return activeFocus ? '#CCCCCC' : '#888888';
      case 'bridge':      return activeFocus ? '#AAAAAA' : '#666666';
      default:            return activeFocus ? '#888888' : '#444444';
    }
  };

  // Ring width communicates entity importance
  const getRingWidth = () => {
    switch (entityType) {
      case 'suspect':  return activeFocus ? 2.5 : 2;
      case 'victim':   return activeFocus ? 2 : 1.5;
      case 'exchange': return activeFocus ? 1.5 : 1;
      default:         return 1;
    }
  };

  // Node orb diameter
  const getDiameter = () => {
    switch (entityType) {
      case 'suspect':  return 50;
      case 'exchange': return 44;
      case 'victim':   return 40;
      case 'bridge':   return 36;
      default:         return 32;
    }
  };

  // Border style — shape differentiates entity type
  const getBorderStyle = (): 'solid' | 'dashed' | 'dotted' => {
    switch (entityType) {
      case 'bridge':       return 'dashed';
      case 'exchange':     return 'solid';
      default:             return 'solid';
    }
  };

  // Core fill — dark with slight variation
  const getCoreFill = () => {
    switch (entityType) {
      case 'suspect':  return '#181818';
      case 'victim':   return '#141414';
      case 'exchange': return '#101010';
      default:         return '#0C0C0C';
    }
  };

  const diameter   = getDiameter();
  const ringColor  = getRingColor();
  const ringWidth  = getRingWidth();
  const borderStyle = getBorderStyle();

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 select-none ${
        isDimmed ? 'opacity-15' : 'opacity-100'
      }`}
      style={{ zIndex: activeFocus ? 30 : 10 }}
    >
      {/* React Flow Handles */}
      <Handle type="target"  id="target-left"   position={Position.Left}   className="!w-1.5 !h-1.5 !bg-[#050505] !border-[#303030] !rounded-full !opacity-0" />
      <Handle type="source"  id="source-right"  position={Position.Right}  className="!w-1.5 !h-1.5 !bg-[#050505] !border-[#303030] !rounded-full !opacity-0" />
      <Handle type="target"  id="target-top"    position={Position.Top}    className="!w-1.5 !h-1.5 !bg-[#050505] !border-[#303030] !rounded-full !opacity-0" />
      <Handle type="source"  id="source-bottom" position={Position.Bottom} className="!w-1.5 !h-1.5 !bg-[#050505] !border-[#303030] !rounded-full !opacity-0" />

      {/* Node orb container */}
      <div
        className="relative flex items-center justify-center rounded-full transition-transform duration-200"
        style={{
          width:     diameter + 14,
          height:    diameter + 14,
          transform: activeFocus ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {/* Subtle focus halo — white only */}
        {activeFocus && (
          <div
            className="absolute inset-0 rounded-full transition-opacity duration-200"
            style={{
              backgroundColor: '#FFFFFF',
              opacity: 0.06,
              filter: 'blur(10px)',
            }}
          />
        )}

        {/* Outer ring */}
        <div
          className="absolute rounded-full transition-all duration-200"
          style={{
            width:        diameter + 8,
            height:       diameter + 8,
            border:       `${ringWidth}px ${borderStyle} ${ringColor}`,
          }}
        />

        {/* Central orb */}
        <div
          className="relative rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            width:           diameter,
            height:          diameter,
            backgroundColor: getCoreFill(),
            border:          `1px solid ${ringColor}`,
          }}
        >
          {/* Inner white dot — size = forensic priority */}
          <div
            style={{
              width:           entityType === 'suspect' ? 10 : 6,
              height:          entityType === 'suspect' ? 10 : 6,
              backgroundColor: '#FFFFFF',
              borderRadius:    '50%',
              opacity:         activeFocus ? 0.9 : 0.5,
            }}
          />
        </div>
      </div>

      {/* Label */}
      <div className="mt-1 flex flex-col items-center pointer-events-none text-center max-w-[140px]">
        <span
          className="font-mono text-[11px] font-semibold tracking-tight transition-colors truncate max-w-full"
          style={{ color: activeFocus ? '#F5F5F5' : '#AAAAAA' }}
        >
          {label.toUpperCase()}
        </span>

        <span className="font-mono text-[10px] text-[#555555] tracking-wider">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>

        {activeFocus && (
          <span className="mt-0.5 text-[9px] font-mono px-1.5 py-0.2 bg-[#0C0C0C] border border-[#303030] text-[#AAAAAA] rounded-[3px]">
            {balance}
          </span>
        )}
      </div>
    </div>
  );
});

ForensicNode.displayName = 'ForensicNode';
