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
import { ForensicNode, NetworkZoneNode, OrbitalTracksNode } from './CustomNodes';
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
  orbitalTracks: OrbitalTracksNode as any,
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

// Flow layout: Linear progression from L1 ingress to L2 liquidation
const FLOW_COORDS: Record<string, { x: number; y: number }> = {
  victim: { x: 80, y: 320 },
  suspect: { x: 380, y: 320 },
  walletB: { x: 740, y: 120 },
  walletC: { x: 740, y: 320 },
  walletD: { x: 740, y: 520 },
  downstreamDest: { x: 1080, y: 120 },
  bridge: { x: 1080, y: 320 },
  polygonWallet: { x: 1420, y: 320 },
  exchange: { x: 1780, y: 320 },
};

// Orbital layout (Section 22): Concentric circular topology around Suspect hub
const ORBITAL_COORDS: Record<string, { x: number; y: number }> = {
  suspect: { x: 700, y: 400 }, // Center Hub
  victim: { x: 700, y: 720 },  // South Ingress
  walletB: { x: 380, y: 260 }, // North-West
  walletC: { x: 700, y: 120 }, // North Bridge Feeder
  walletD: { x: 1020, y: 260 }, // North-East Cold Parking
  downstreamDest: { x: 140, y: 160 }, // West Terminus
  bridge: { x: 550, y: -60 }, // North-West Bridge
  polygonWallet: { x: 850, y: -60 }, // North-East Polygon
  exchange: { x: 1150, y: -60 }, // Far North-East CEX Outflow
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

  // Section 22: Graph Modes: 'flow' or 'orbital'
  const [graphMode, setGraphMode] = useState<'flow' | 'orbital'>('flow');
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
      fitView({ padding: 0.16, duration: 400 });
    }, 100);
    return () => clearTimeout(timer);
  }, [fitView, graphMode]);

  // Network Zones for Flow & Orbital
  const zoneNodes: Node[] = useMemo(() => {
    if (!showZones) return [];

    if (graphMode === 'orbital') {
      return [
        {
          id: 'orbital-tracks-bg',
          type: 'orbitalTracks',
          position: { x: 0, y: -60 },
          data: { id: 'orbital-tracks-bg' },
          draggable: false,
          selectable: false,
          zIndex: -1,
        },
      ];
    }

    return [
      {
        id: 'zone-eth',
        type: 'networkZone',
        position: { x: 30, y: 40 },
        data: {
          id: 'zone-eth',
          title: 'ETHEREUM MAINNET (L1)',
          subtitle: '7 ENTITIES • $2,000 USDT INGRESS & LAYERING',
          chain: 'Ethereum',
          width: 1300,
          height: 600,
        },
        draggable: false,
        selectable: false,
        zIndex: -1,
      },
      {
        id: 'zone-poly',
        type: 'networkZone',
        position: { x: 1370, y: 220 },
        data: {
          id: 'zone-poly',
          title: 'POLYGON POS (L2)',
          subtitle: '2 ENTITIES • $680 USDT OFF-RAMP TERMINUS',
          chain: 'Polygon',
          width: 530,
          height: 250,
        },
        draggable: false,
        selectable: false,
        zIndex: -1,
      },
    ];
  }, [showZones, graphMode]);

  // Section 26: Connected Entity Discovery for Focus/Dimming
  const connectedWalletIds = useMemo(() => {
    if (!selectedWalletId) return new Set<string>();
    const connected = new Set<string>([selectedWalletId]);
    DEMO_TRANSACTIONS.forEach((tx) => {
      if (tx.from === selectedWalletId) connected.add(tx.to);
      if (tx.to === selectedWalletId) connected.add(tx.from);
    });
    return connected;
  }, [selectedWalletId]);

  // Transform raw DEMO_WALLETS into React Flow Nodes
  const initialNodes: Node[] = useMemo(() => {
    const coordsMap = graphMode === 'orbital' ? ORBITAL_COORDS : FLOW_COORDS;
    const hasFocusFilter = Boolean(selectedWalletId) || Boolean(activeDetection) || highlightedNodeIds.length > 0 || isTracingPrimary || chainFilter !== 'all';

    const entityNodes: Node[] = Object.values(DEMO_WALLETS).map((wallet) => {
      const isSelected = selectedWalletId === wallet.id;
      const isConnected = connectedWalletIds.has(wallet.id);
      const isDetectionAffected = activeDetection
        ? activeDetection.affectedNodes.includes(wallet.id)
        : false;
      const isExternalHighlighted = highlightedNodeIds.includes(wallet.id);
      const isPrimaryTraced = isTracingPrimary && PRIMARY_LAUNDERING_NODES.includes(wallet.id);

      const isFocused =
        isSelected ||
        isConnected ||
        isDetectionAffected ||
        isExternalHighlighted ||
        isPrimaryTraced;

      // Filter by chain if active
      const matchesChainFilter =
        chainFilter === 'all' || wallet.chain.toLowerCase() === chainFilter.toLowerCase();

      // Section 26: Dimming rule
      const isDimmed = (hasFocusFilter && !isFocused) || !matchesChainFilter;

      return {
        id: wallet.id,
        type: 'forensicNode',
        position: coordsMap[wallet.id] || wallet.position,
        data: {
          ...wallet,
          layout: graphMode,
          isSelected,
          isHighlighted: isFocused,
          isDimmed,
        },
      };
    });

    return [...zoneNodes, ...entityNodes];
  }, [
    selectedWalletId,
    connectedWalletIds,
    activeDetection,
    highlightedNodeIds,
    chainFilter,
    isTracingPrimary,
    graphMode,
    zoneNodes,
  ]);

  // Transform raw DEMO_TRANSACTIONS into React Flow Edges
  const initialEdges: Edge[] = useMemo(() => {
    const isHorizontal = graphMode === 'flow';
    const sourceHandleId = isHorizontal ? 'source-right' : 'source-bottom';
    const targetHandleId = isHorizontal ? 'target-left' : 'target-top';

    const hasFocusFilter = Boolean(selectedWalletId) || Boolean(activeDetection) || highlightedEdgeIds.length > 0 || isTracingPrimary || chainFilter !== 'all';

    return DEMO_TRANSACTIONS.map((tx) => {
      const isSelected = selectedTransactionId === tx.id;
      const isDirectlyConnected = selectedWalletId ? (tx.from === selectedWalletId || tx.to === selectedWalletId) : false;
      const isDetectionAffected = activeDetection
        ? activeDetection.affectedEdges.includes(tx.id)
        : false;
      const isExternalHighlighted = highlightedEdgeIds.includes(tx.id);
      const isPrimaryTraced = isTracingPrimary && PRIMARY_LAUNDERING_EDGES.includes(tx.id);

      const isHighlighted =
        isSelected ||
        isDirectlyConnected ||
        isDetectionAffected ||
        isExternalHighlighted ||
        isPrimaryTraced;

      const matchesChainFilter =
        chainFilter === 'all' || tx.chain.toLowerCase() === chainFilter.toLowerCase();

      const isDimmed = (hasFocusFilter && !isHighlighted) || !matchesChainFilter;

      return {
        id: tx.id,
        source: tx.from,
        target: tx.to,
        sourceHandle: sourceHandleId,
        targetHandle: targetHandleId,
        type: 'forensicEdge',
        data: {
          ...tx,
          percentage: TX_PERCENTAGES[tx.id],
          layout: graphMode,
          isHighlighted,
          isDimmed,
          showLabels: showEdgeLabels,
          showPercentages,
          animateFlow,
          onSelectTx: onSelectTransaction,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: isHighlighted ? '#F5F5F5' : isDimmed ? 'rgba(255,255,255,0.12)' : '#555555',
        },
      };
    });
  }, [
    selectedTransactionId,
    selectedWalletId,
    activeDetection,
    highlightedEdgeIds,
    chainFilter,
    isTracingPrimary,
    showEdgeLabels,
    showPercentages,
    animateFlow,
    onSelectTransaction,
    graphMode,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state changes with nodes and edges
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Click on node: opens intelligence panel & triggers focus
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'networkZone') return;
      onSelectWallet(node.id);
    },
    [onSelectWallet]
  );

  // Click on edge: selects transaction
  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      onSelectTransaction(edge.id);
    },
    [onSelectTransaction]
  );

  // Focus entity from select dropdown
  const handleFocusEntity = (walletId: string) => {
    if (!walletId) return;
    onSelectWallet(walletId);
    const coordsMap = graphMode === 'orbital' ? ORBITAL_COORDS : FLOW_COORDS;
    const target = coordsMap[walletId];
    if (target) {
      setCenter(target.x + 20, target.y + 20, { duration: 400, zoom: 1.15 });
    }
  };

  const handleFitView = () => {
    fitView({ padding: 0.16, duration: 350 });
  };

  const handleReset = () => {
    setGraphMode('flow');
    setChainFilter('all');
    setIsTracingPrimary(false);
    onSelectWallet(null);
    if (onClearHighlight) onClearHighlight();
    fitView({ padding: 0.16, duration: 350 });
  };

  return (
    <div className="w-full h-full relative select-none bg-obsidian-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        minZoom={0.25}
        maxZoom={2.4}
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Section 23: Obsidian Dot Grid */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255, 255, 255, 0.08)"
          className="bg-obsidian-950"
        />

        {showMiniMap && (
          <MiniMap
            nodeColor={(n) => {
              if (n.id === 'suspect')  return '#DDDDDD';
              if (n.id === 'victim')   return '#AAAAAA';
              if (n.id === 'exchange') return '#888888';
              if (n.id === 'bridge')   return '#666666';
              return '#555555';
            }}
            nodeStrokeWidth={1}
            nodeBorderRadius={12}
            className="!bg-[#0C0C0C] !border !border-[#202020] !rounded-[4px] !bottom-3 !right-3"
          />
        )}
      </ReactFlow>

      {/* Section 28: Compact Tactical HUD (Height: 30px, Background: #111216, Border: #23252D) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-30 font-mono text-[11px]">
        {/* Left Cluster: Modes & Filters */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          {/* Mode Switcher: FLOW vs ORBITAL */}
          <div className="h-[30px] flex items-center bg-obsidian-900 border border-obsidian-750 p-0.5 rounded-[4px] shadow-md">
            <button
              onClick={() => setGraphMode('flow')}
              className={`px-2.5 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                graphMode === 'flow'
                  ? 'bg-sand-100 text-obsidian-950 font-bold'
                  : 'text-zinc-400 hover:text-sand-100'
              }`}
            >
              FLOW
            </button>
            <button
              onClick={() => setGraphMode('orbital')}
              className={`px-2.5 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                graphMode === 'orbital'
                  ? 'bg-sand-100 text-obsidian-950 font-bold'
                  : 'text-zinc-400 hover:text-sand-100'
              }`}
            >
              ORBITAL
            </button>
          </div>

          {/* Chain Filters: ALL / ETH / POL */}
          <div className="h-[30px] flex items-center bg-obsidian-900 border border-obsidian-750 p-0.5 rounded-[4px] shadow-md">
            <button
              onClick={() => setChainFilter('all')}
              className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                chainFilter === 'all'
                  ? 'bg-obsidian-850 text-sand-100 font-bold border border-sand-850'
                  : 'text-zinc-400 hover:text-sand-100'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setChainFilter('Ethereum')}
              className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                chainFilter === 'Ethereum'
                  ? 'bg-obsidian-850 text-sand-100 font-bold border border-sand-850'
                  : 'text-zinc-400 hover:text-sand-100'
              }`}
            >
              ETH
            </button>
            <button
              onClick={() => setChainFilter('Polygon')}
              className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                chainFilter === 'Polygon'
                  ? 'bg-obsidian-850 text-sand-100 font-bold border border-sand-850'
                  : 'text-zinc-400 hover:text-sand-100'
              }`}
            >
              POL
            </button>
          </div>

          {/* Display Overlays: Splits, Amounts, Exit Path */}
          <div className="h-[30px] hidden sm:flex items-center space-x-1 bg-obsidian-900 border border-obsidian-750 p-0.5 rounded-[4px] shadow-md">
            <button
              onClick={() => setShowPercentages(!showPercentages)}
              className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                showPercentages ? 'bg-obsidian-850 text-sand-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Toggle split percentages"
            >
              SPLITS
            </button>
            <button
              onClick={() => setShowEdgeLabels(!showEdgeLabels)}
              className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                showEdgeLabels ? 'bg-obsidian-850 text-sand-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Toggle amounts"
            >
              AMOUNTS
            </button>
            <button
              onClick={() => setIsTracingPrimary(!isTracingPrimary)}
              className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer flex items-center space-x-1 ${
                isTracingPrimary
                  ? 'bg-sand-100 text-obsidian-950 font-bold'
                  : 'text-zinc-400 hover:text-sand-100'
              }`}
              title="Trace primary exit path to exchange"
            >
              <Zap className="w-2.5 h-2.5" />
              <span>EXIT PATH</span>
            </button>
          </div>
        </div>

        {/* Right Cluster: Quick Entity Jump & Canvas Controls */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          {/* Entity Focus Dropdown */}
          <div className="relative">
            <select
              value={selectedWalletId || ''}
              onChange={(e) => handleFocusEntity(e.target.value)}
              className="h-[30px] bg-obsidian-900 border border-obsidian-750 text-sand-300 hover:text-sand-100 px-2 py-0.5 rounded-[4px] text-[10px] font-mono appearance-none cursor-pointer pr-5 shadow-md outline-none"
            >
              <option value="">🎯 FOCUS ENTITY...</option>
              {Object.values(DEMO_WALLETS).map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label} ({w.balance})
                </option>
              ))}
            </select>
            <ChevronDown className="w-2.5 h-2.5 text-zinc-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* AI Flow Highlight Notification & Clear */}
          {(highlightedNodeIds.length > 0 || highlightedEdgeIds.length > 0) && (
            <div className="h-[30px] bg-obsidian-900 border border-sand-300 text-sand-100 px-2.5 rounded-[4px] flex items-center space-x-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-sand-100 animate-pulse" />
              <span className="text-[10px]">AI ISOLATION</span>
              {onClearHighlight && (
                <button
                  onClick={onClearHighlight}
                  className="ml-1 p-0.5 hover:bg-obsidian-850 rounded text-zinc-400 hover:text-sand-100"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Canvas View Controls */}
          <div className="h-[30px] flex items-center space-x-0.5 bg-obsidian-900 border border-obsidian-750 p-0.5 rounded-[4px] shadow-md">
            <button
              onClick={handleFitView}
              className="p-1 rounded-[2px] hover:bg-obsidian-850 text-zinc-400 hover:text-sand-100 transition cursor-pointer"
              title="Fit graph to canvas"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setShowMiniMap(!showMiniMap)}
              className={`p-1 rounded-[2px] transition cursor-pointer ${
                showMiniMap ? 'bg-obsidian-850 text-sand-100' : 'text-zinc-400 hover:text-sand-100'
              }`}
              title="Toggle MiniMap"
            >
              <Map className="w-3 h-3" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 rounded-[2px] hover:bg-obsidian-850 text-zinc-400 hover:text-sand-100 transition cursor-pointer"
              title="Reset graph view"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              onClick={() => setShowLegend(!showLegend)}
              className={`p-1 rounded-[2px] transition cursor-pointer ${
                showLegend ? 'bg-sand-100 text-obsidian-950' : 'text-zinc-400 hover:text-sand-100'
              }`}
              title="Toggle graph legend"
            >
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Graph Legend — grayscale hierarchy */}
      {showLegend && (
        <div className="absolute top-12 right-3 z-30 w-64 bg-[#0C0C0C] border border-[#303030] p-3 rounded-[4px] shadow-2xl text-[10px] font-mono space-y-2 text-[#888888]">
          <div className="flex items-center justify-between border-b border-[#202020] pb-1.5">
            <span className="text-[#F5F5F5] font-bold uppercase tracking-wider">
              ENTITY TYPE LEGEND
            </span>
            <button onClick={() => setShowLegend(false)} className="text-[#555555] hover:text-[#F5F5F5]">
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2 text-[10px]">
            {[
              { label: 'PRIMARY SUSPECT',   size: 14, ring: '#F5F5F5', desc: 'Largest node · solid white ring' },
              { label: 'VICTIM INGRESS',     size: 12, ring: '#CCCCCC', desc: 'Medium · light gray ring' },
              { label: 'VASP / EXCHANGE',    size: 11, ring: '#AAAAAA', desc: 'Medium · gray ring' },
              { label: 'CROSS-CHAIN BRIDGE', size: 10, ring: '#777777', desc: 'Small · dashed gray ring' },
              { label: 'INTERMEDIARY',       size: 9,  ring: '#555555', desc: 'Smallest · dark ring' },
            ].map((item) => (
              <div key={item.label} className="flex items-center space-x-2">
                <div
                  className="rounded-full shrink-0 flex items-center justify-center"
                  style={{ width: item.size + 4, height: item.size + 4, border: `1.5px solid ${item.ring}`, background: '#101010' }}
                >
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#FFFFFF', opacity: 0.5 }} />
                </div>
                <div>
                  <div className="text-[#DDDDDD] font-medium">{item.label}</div>
                  <div className="text-[#444444] text-[9px]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1.5 border-t border-[#202020] text-[9px] text-[#444444]">
            Click any node to focus its subgraph. Hierarchy by size + ring brightness.
          </div>
        </div>
      )}
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
