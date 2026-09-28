'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  MarkerType,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import { ForensicNode, NetworkZoneNode } from './CustomNodes';
import { ForensicEdge } from './ForensicEdge';
import {
  DEMO_WALLETS,
  DEMO_TRANSACTIONS,
  DEMO_DETECTIONS,
} from '@/data/demoInvestigation';
import {
  Filter,
  Eye,
  Percent,
  Play,
  Pause,
  Maximize2,
  RotateCcw,
  Zap,
  HelpCircle,
  X,
  MapPin,
  ChevronDown,
  Layers,
  Map,
  Compass,
} from 'lucide-react';

interface TransactionGraphProps {
  selectedWalletId: string | null;
  onSelectWallet: (walletId: string | null) => void;
  selectedTransactionId: string | null;
  onSelectTransaction: (txId: string) => void;
  activeDetectionId: string | null;
  highlightedNodeIds?: string[];
  highlightedEdgeIds?: string[];
  onClearHighlight?: () => void;
}

const nodeTypes: NodeTypes = {
  forensicNode: ForensicNode as any,
  networkZone: NetworkZoneNode as any,
};

const edgeTypes: EdgeTypes = {
  forensicEdge: ForensicEdge as any,
};

// Percentage mapping based on investigation telemetry
const TX_PERCENTAGES: Record<string, string> = {
  'TX-DEMO-001': '100%',
  'TX-DEMO-002': '40%',
  'TX-DEMO-003': '35%',
  'TX-DEMO-004': '25%',
  'TX-DEMO-005': '100%',
  'TX-DEMO-006': '99.7%',
  'TX-DEMO-007': '95%',
  'TX-DEMO-008': '97.4%',
};

// Primary money laundering flow path
const PRIMARY_LAUNDERING_NODES = [
  'victim',
  'suspect',
  'walletC',
  'bridge',
  'polygonWallet',
  'exchange',
];

const PRIMARY_LAUNDERING_EDGES = [
  'TX-DEMO-001',
  'TX-DEMO-003',
  'TX-DEMO-005',
  'TX-DEMO-006',
  'TX-DEMO-008',
];

// Generous, breathable coordinates for Horizontal Flow (Left-to-Right timeline)
const HORIZONTAL_COORDS: Record<string, { x: number; y: number }> = {
  victim: { x: 40, y: 290 },
  suspect: { x: 410, y: 290 },
  walletB: { x: 790, y: 40 },
  walletC: { x: 790, y: 290 },
  walletD: { x: 790, y: 540 },
  downstreamDest: { x: 1180, y: 40 },
  bridge: { x: 1180, y: 290 },
  polygonWallet: { x: 1590, y: 290 },
  exchange: { x: 1990, y: 290 },
};

// Optimal Coordinates for Vertical Hierarchy (Top-to-Bottom tree)
const VERTICAL_COORDS: Record<string, { x: number; y: number }> = {
  victim: { x: 500, y: 40 },
  suspect: { x: 500, y: 240 },
  walletB: { x: 100, y: 450 },
  walletC: { x: 500, y: 450 },
  walletD: { x: 900, y: 450 },
  downstreamDest: { x: 100, y: 660 },
  bridge: { x: 500, y: 660 },
  polygonWallet: { x: 500, y: 870 },
  exchange: { x: 500, y: 1080 },
};

const InnerTransactionGraph: React.FC<TransactionGraphProps> = ({
  selectedWalletId,
  onSelectWallet,
  selectedTransactionId,
  onSelectTransaction,
  activeDetectionId,
  highlightedNodeIds = [],
  highlightedEdgeIds = [],
  onClearHighlight,
}) => {
  const { fitView, setCenter } = useReactFlow();

  // Layout mode: 'horizontal' (default widescreen timeline) or 'vertical' (top-down tree)
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [chainFilter, setChainFilter] = useState<'all' | 'Ethereum' | 'Polygon'>('all');
  const [showZones, setShowZones] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [showEdgeLabels, setShowEdgeLabels] = useState(true);
  const [showPercentages, setShowPercentages] = useState(true);
  const [animateFlow, setAnimateFlow] = useState(true);
  const [isTracingPrimary, setIsTracingPrimary] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Active detection
  const activeDetection = useMemo(() => {
    return DEMO_DETECTIONS.find((d) => d.id === activeDetectionId);
  }, [activeDetectionId]);

  // Initial auto-fit view
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.12, duration: 450 });
    }, 120);
    return () => clearTimeout(timer);
  }, [fitView]);

  // Generate Network Zone Group Nodes based on layout
  const zoneNodes: Node[] = useMemo(() => {
    if (!showZones) return [];

    if (layout === 'horizontal') {
      return [
        {
          id: 'zone-eth',
          type: 'networkZone',
          position: { x: 15, y: 15 },
          data: {
            id: 'zone-eth',
            title: 'ETHEREUM MAINNET (L1)',
            subtitle: '7 ENTITIES • $2,000 USDT INFLOW & LAYERING',
            chain: 'Ethereum',
            width: 1460,
            height: 740,
          },
          draggable: false,
          selectable: false,
          zIndex: -1,
        },
        {
          id: 'zone-poly',
          type: 'networkZone',
          position: { x: 1545, y: 200 },
          data: {
            id: 'zone-poly',
            title: 'POLYGON POS (L2)',
            subtitle: '2 ENTITIES • $698 USDT LIQUIDATION',
            chain: 'Polygon',
            width: 735,
            height: 345,
          },
          draggable: false,
          selectable: false,
          zIndex: -1,
        },
      ];
    } else {
      return [
        {
          id: 'zone-eth',
          type: 'networkZone',
          position: { x: 60, y: 15 },
          data: {
            id: 'zone-eth',
            title: 'ETHEREUM MAINNET (L1)',
            subtitle: '7 ENTITIES • $2,000 USDT INFLOW & LAYERING',
            chain: 'Ethereum',
            width: 1130,
            height: 855,
          },
          draggable: false,
          selectable: false,
          zIndex: -1,
        },
        {
          id: 'zone-poly',
          type: 'networkZone',
          position: { x: 440, y: 830 },
          data: {
            id: 'zone-poly',
            title: 'POLYGON POS (L2)',
            subtitle: '2 ENTITIES • $698 USDT LIQUIDATION',
            chain: 'Polygon',
            width: 370,
            height: 460,
          },
          draggable: false,
          selectable: false,
          zIndex: -1,
        },
      ];
    }
  }, [showZones, layout]);

  // Transform raw DEMO_WALLETS into React Flow Nodes with dynamic positions & orientation
  const initialNodes: Node[] = useMemo(() => {
    const hasAnyNodeFilter =
      chainFilter !== 'all' ||
      Boolean(activeDetection) ||
      highlightedNodeIds.length > 0 ||
      isTracingPrimary;

    const coordsMap = layout === 'horizontal' ? HORIZONTAL_COORDS : VERTICAL_COORDS;

    const entityNodes: Node[] = Object.values(DEMO_WALLETS).map((wallet) => {
      const isSelected = selectedWalletId === wallet.id;
      const isDetectionAffected = activeDetection
        ? activeDetection.affectedNodes.includes(wallet.id)
        : false;
      const isExternalHighlighted = highlightedNodeIds.includes(wallet.id);
      const isPrimaryTraced = isTracingPrimary && PRIMARY_LAUNDERING_NODES.includes(wallet.id);

      const isHighlighted =
        isSelected || isDetectionAffected || isExternalHighlighted || isPrimaryTraced;

      // Filter by chain if active
      const matchesChainFilter =
        chainFilter === 'all' || wallet.chain.toLowerCase() === chainFilter.toLowerCase();

      const isDimmed = (hasAnyNodeFilter && !isHighlighted) || !matchesChainFilter;

      return {
        id: wallet.id,
        type: 'forensicNode',
        position: coordsMap[wallet.id] || wallet.position,
        data: {
          ...wallet,
          layout,
          isSelected,
          isHighlighted,
          isDimmed,
        },
      };
    });

    return [...zoneNodes, ...entityNodes];
  }, [
    selectedWalletId,
    activeDetection,
    highlightedNodeIds,
    chainFilter,
    isTracingPrimary,
    layout,
    zoneNodes,
  ]);

  // Transform raw DEMO_TRANSACTIONS into React Flow Edges with correct handle IDs and styling
  const initialEdges: Edge[] = useMemo(() => {
    const hasAnyEdgeFilter =
      chainFilter !== 'all' ||
      Boolean(activeDetection) ||
      highlightedEdgeIds.length > 0 ||
      isTracingPrimary;

    const isHorizontal = layout === 'horizontal';
    const sourceHandleId = isHorizontal ? 'source-right' : 'source-bottom';
    const targetHandleId = isHorizontal ? 'target-left' : 'target-top';

    return DEMO_TRANSACTIONS.map((tx) => {
      const isSelected = selectedTransactionId === tx.id;
      const isDetectionAffected = activeDetection
        ? activeDetection.affectedEdges.includes(tx.id)
        : false;
      const isExternalHighlighted = highlightedEdgeIds.includes(tx.id);
      const isConnectedToSelectedNode =
        selectedWalletId === tx.from || selectedWalletId === tx.to;
      const isPrimaryTraced = isTracingPrimary && PRIMARY_LAUNDERING_EDGES.includes(tx.id);

      const isHighlighted =
        isSelected ||
        isDetectionAffected ||
        isExternalHighlighted ||
        isConnectedToSelectedNode ||
        isPrimaryTraced;

      const matchesChainFilter =
        chainFilter === 'all' || tx.chain.toLowerCase() === chainFilter.toLowerCase();

      const isDimmed = (hasAnyEdgeFilter && !isHighlighted) || !matchesChainFilter;

      const strokeColor = isHighlighted ? '#ffffff' : isDimmed ? '#2f343a' : '#71717a';

      return {
        id: tx.id,
        source: tx.from,
        target: tx.to,
        sourceHandle: sourceHandleId,
        targetHandle: targetHandleId,
        type: 'forensicEdge',
        data: {
          ...tx,
          layout,
          percentage: TX_PERCENTAGES[tx.id],
          isHighlighted,
          isDimmed,
          showLabels: showEdgeLabels,
          showPercentages,
          animateFlow,
          onSelectTx: onSelectTransaction,
        },
        style: {
          stroke: strokeColor,
          strokeWidth: isHighlighted ? 2.8 : isDimmed ? 1.4 : 1.8,
          opacity: isDimmed ? 0.35 : 1,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isHighlighted ? '#ffffff' : isDimmed ? '#444444' : '#888888',
          width: 14,
          height: 14,
        },
      };
    });
  }, [
    selectedTransactionId,
    activeDetection,
    highlightedEdgeIds,
    selectedWalletId,
    chainFilter,
    showEdgeLabels,
    showPercentages,
    animateFlow,
    isTracingPrimary,
    layout,
    onSelectTransaction,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'networkZone') return;
      onSelectWallet(node.id);
    },
    [onSelectWallet]
  );

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      onSelectTransaction(edge.id);
    },
    [onSelectTransaction]
  );

  const handleFitView = () => {
    fitView({ padding: 0.12, duration: 400 });
  };

  const handleLayoutToggle = (newLayout: 'horizontal' | 'vertical') => {
    setLayout(newLayout);
    setTimeout(() => {
      fitView({ padding: 0.12, duration: 400 });
    }, 60);
  };

  const handleFocusEntity = (walletId: string) => {
    if (!walletId) return;
    onSelectWallet(walletId);
    const coordsMap = layout === 'horizontal' ? HORIZONTAL_COORDS : VERTICAL_COORDS;
    const pos = coordsMap[walletId];
    if (pos) {
      setCenter(pos.x + 125, pos.y + 85, { zoom: 1.05, duration: 500 });
    }
  };

  const handleReset = () => {
    setChainFilter('all');
    setIsTracingPrimary(false);
    setShowEdgeLabels(true);
    setShowPercentages(true);
    setShowZones(true);
    setAnimateFlow(true);
    onSelectWallet(null);
    if (onClearHighlight) {
      onClearHighlight();
    }
    setTimeout(() => {
      fitView({ padding: 0.12, duration: 400 });
    }, 50);
  };

  return (
    <div
      className="relative w-full h-full min-h-[500px] bg-[#0a0a0c] select-none overflow-hidden"
      style={{ width: '100%', height: '100%', minHeight: '500px' }}
    >
      {/* Top Operations Command Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Control Cluster: Layout Switcher + Chain Filter + Toggles */}
        <div className="flex items-center flex-wrap gap-1.5 pointer-events-auto">
          {/* Layout Switcher (Horizontal Flow vs Vertical Tree) */}
          <div className="flex items-center space-x-1 bg-[#131518]/95 border border-zinc-800 px-2 py-1 rounded-md shadow-lg backdrop-blur text-xs font-mono">
            <span className="text-zinc-500 text-[10px] mr-1 hidden sm:inline">VIEW:</span>
            <button
              onClick={() => handleLayoutToggle('horizontal')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                layout === 'horizontal'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title="Horizontal Timeline Flow (Optimized for widescreen monitors)"
            >
              <span>↔ Horizontal Flow</span>
            </button>
            <button
              onClick={() => handleLayoutToggle('vertical')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                layout === 'vertical'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title="Vertical Tree Hierarchy"
            >
              <span>↕ Tree</span>
            </button>
          </div>

          {/* Chain Filter */}
          <div className="flex items-center space-x-1 bg-[#131518]/95 border border-zinc-800 px-2 py-1 rounded-md shadow-lg backdrop-blur text-xs font-mono">
            <div className="flex items-center space-x-1 text-zinc-500 mr-1">
              <Filter className="w-3 h-3" />
              <span className="text-[10px] hidden sm:inline">CHAIN:</span>
            </div>

            {(['all', 'Ethereum', 'Polygon'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setChainFilter(c)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                  chainFilter === c
                    ? 'bg-zinc-200 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {c === 'all' ? 'ALL' : c === 'Ethereum' ? 'ETH L1' : 'POLYGON'}
              </button>
            ))}
          </div>

          {/* Zones & Flow Motion Toggles */}
          <div className="flex items-center space-x-1 bg-[#131518]/95 border border-zinc-800 px-2 py-1 rounded-md shadow-lg backdrop-blur text-xs font-mono">
            <button
              onClick={() => setShowZones(!showZones)}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                showZones
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Toggle network perimeter zones"
            >
              <Layers className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Zones</span>
            </button>

            <button
              onClick={() => setAnimateFlow(!animateFlow)}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                animateFlow
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Toggle fund motion animation"
            >
              {animateFlow ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
              <span className="hidden sm:inline">Motion</span>
            </button>

            <button
              onClick={() => setShowPercentages(!showPercentages)}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                showPercentages
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Toggle fund percentage splits"
            >
              <Percent className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Splits</span>
            </button>

            <button
              onClick={() => setShowEdgeLabels(!showEdgeLabels)}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                showEdgeLabels
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Toggle transaction amount labels"
            >
              <Eye className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Amounts</span>
            </button>
          </div>

          {/* Quick Flow Tracer Action */}
          <button
            onClick={() => setIsTracingPrimary(!isTracingPrimary)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold transition shadow-md backdrop-blur cursor-pointer ${
              isTracingPrimary
                ? 'bg-rose-500 text-white border border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : 'bg-[#181a1d] text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-700'
            }`}
            title="Highlight primary cash-out money laundering route"
          >
            <Zap className={`w-3 h-3 ${isTracingPrimary ? 'text-white' : 'text-amber-400'}`} />
            <span>{isTracingPrimary ? 'Exit Path Active' : 'Trace Exit Path'}</span>
          </button>
        </div>

        {/* Right Cluster: Entity Jump + Canvas Controls */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Quick Jump to Node Dropdown */}
          <div className="relative">
            <select
              value={selectedWalletId || ''}
              onChange={(e) => handleFocusEntity(e.target.value)}
              className="bg-[#131518]/95 border border-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1 rounded-md text-[10px] font-mono appearance-none cursor-pointer pr-6 shadow-lg backdrop-blur focus:outline-hidden focus:border-zinc-500"
            >
              <option value="">🎯 Focus Entity...</option>
              {Object.values(DEMO_WALLETS).map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label} ({w.balance})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-zinc-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Active AI Flow Isolation Pill */}
          {(highlightedNodeIds.length > 0 || highlightedEdgeIds.length > 0) && (
            <div className="bg-[#181a1d] border border-white text-white px-2.5 py-1 rounded-md shadow-lg flex items-center space-x-2 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span className="font-bold text-[10px]">AI FLOW ISOLATED</span>
              <span className="text-[9px] text-zinc-400">
                ({highlightedEdgeIds.length} txs, {highlightedNodeIds.length} wallets)
              </span>
              {onClearHighlight && (
                <button
                  onClick={onClearHighlight}
                  className="ml-1 px-1.5 py-0.5 bg-zinc-800 hover:bg-white hover:text-black rounded text-[9px] text-white transition flex items-center space-x-1 cursor-pointer"
                  title="Clear isolation and show full network"
                >
                  <X className="w-2.5 h-2.5" />
                  <span>CLEAR</span>
                </button>
              )}
            </div>
          )}

          {/* Canvas View Controls */}
          <div className="flex items-center space-x-1 bg-[#131518]/95 border border-zinc-800 p-1 rounded-md shadow-lg backdrop-blur">
            <button
              onClick={handleFitView}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Fit graph to view (Auto Scale)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowMiniMap(!showMiniMap)}
              className={`p-1 rounded transition cursor-pointer ${
                showMiniMap
                  ? 'bg-zinc-700 text-white'
                  : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title="Toggle MiniMap"
            >
              <Map className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Reset all filters and view"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowLegend(!showLegend)}
              className={`p-1 rounded transition cursor-pointer ${
                showLegend ? 'bg-white text-black' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title="Toggle graph legend"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Forensic Graph Legend */}
      {showLegend && (
        <div className="absolute top-14 right-3 z-30 w-76 bg-[#121316]/95 border border-zinc-700/80 p-3.5 rounded-lg shadow-2xl backdrop-blur-md text-xs font-mono space-y-2.5 text-zinc-300">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
            <span className="text-white font-bold text-[11px] tracking-wider uppercase flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>FORENSIC GRAPH GUIDE</span>
            </span>
            <button
              onClick={() => setShowLegend(false)}
              className="text-zinc-500 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-[10px]">
            <div className="flex items-start space-x-2">
              <span className="px-1.5 py-0.5 rounded bg-rose-950 border border-rose-500/50 text-rose-300 font-bold text-[8px] uppercase mt-0.5 shrink-0">
                HUB
              </span>
              <span>
                <strong className="text-white">Primary Suspect:</strong> Ingested $2,000 USDT from victim, split across 3 intermediary addresses in 24 seconds.
              </span>
            </div>

            <div className="flex items-start space-x-2">
              <span className="px-1.5 py-0.5 rounded bg-sky-950 border border-sky-500/50 text-sky-300 font-bold text-[8px] uppercase mt-0.5 shrink-0">
                COMPL
              </span>
              <span>
                <strong className="text-white">Reporting Victim:</strong> Defrauded source entity who reported phishing engagement.
              </span>
            </div>

            <div className="flex items-start space-x-2">
              <span className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/50 text-amber-300 font-bold text-[8px] uppercase mt-0.5 shrink-0">
                BRIDGE
              </span>
              <span>
                <strong className="text-white">Bridge Gateway:</strong> Smart contract protocol lock-and-mint transfer from Ethereum to Polygon POS.
              </span>
            </div>

            <div className="flex items-start space-x-2">
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold text-[8px] uppercase mt-0.5 shrink-0">
                CEX
              </span>
              <span>
                <strong className="text-white">Exchange Deposit:</strong> Centralized exchange hotwallet representing subpoena and KYC target.
              </span>
            </div>

            <div className="flex items-start space-x-2">
              <span className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/50 text-purple-300 font-bold text-[8px] uppercase mt-0.5 shrink-0">
                COLD
              </span>
              <span>
                <strong className="text-white">Parking Wallet:</strong> Static $500 balance remaining dormant without downstream hops.
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 text-[9px] text-zinc-500 flex justify-between">
            <span>• Hover edge: Inspect transaction hash</span>
            <span>• Click node: Open intelligence drawer</span>
          </div>
        </div>
      )}

      {/* React Flow Viewport */}
      <div className="w-full h-full" style={{ width: '100%', height: '100%', minHeight: '500px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onPaneClick={() => onSelectWallet(null)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.15}
          maxZoom={2.0}
          proOptions={{ hideAttribution: true }}
        >
          {/* Tactical Background Grid */}
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.2}
            color="#22252a"
          />

          {/* Bottom-Right Navigation Controls */}
          <Controls
            position="bottom-right"
            className="!bg-[#14161a] !border-zinc-800 !shadow-xl"
            showInteractive={false}
          />

          {/* Toggleable MiniMap positioned cleanly above controls */}
          {showMiniMap && (
            <MiniMap
              position="bottom-right"
              nodeColor={(n) => {
                if (n.type === 'networkZone') return 'transparent';
                const data = n.data as any;
                if (data.entityType === 'suspect') return '#f43f5e';
                if (data.entityType === 'victim') return '#38bdf8';
                if (data.entityType === 'bridge') return '#fbbf24';
                if (data.entityType === 'exchange') return '#34d399';
                if (data.id === 'walletD') return '#c084fc';
                return '#64748b';
              }}
              nodeStrokeColor="#181818"
              nodeStrokeWidth={1}
              nodeBorderRadius={3}
              maskColor="rgba(8, 8, 10, 0.85)"
              className="!w-40 !h-28 !bg-[#101114]/95 !border !border-zinc-800 !rounded-lg hidden md:block shadow-2xl !mb-14 !mr-2 backdrop-blur-md"
            />
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

export const TransactionGraph: React.FC<TransactionGraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <InnerTransactionGraph {...props} />
    </ReactFlowProvider>
  );
};
