'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
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
  Maximize2,
  RotateCcw,
  Zap,
  HelpCircle,
  X,
  ChevronDown,
  Map,
  Play,
  Pause,
  Clock,
  Sparkles,
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

// Flow layout: Generous spacing with 180-200px horizontal gaps and 90px vertical gaps (ZERO overlapping)
const FLOW_COORDS: Record<string, { x: number; y: number }> = {
  victim:         { x: 80,   y: 470 }, // Column 1: Ingress (y: 470)
  suspect:        { x: 530,  y: 470 }, // Column 2: Target Hub (gap = 180px)
  walletB:        { x: 1000, y: 140 }, // Column 3: Top Relay (gap = 200px, 90px clear vertical gap from C)
  walletC:        { x: 1000, y: 470 }, // Column 3: Middle Bridge Feeder
  walletD:        { x: 1000, y: 800 }, // Column 3: Bottom Parking (90px clear vertical gap from C)
  downstreamDest: { x: 1470, y: 140 }, // Column 4: Top Downstream Hop (gap = 200px)
  bridge:         { x: 1470, y: 470 }, // Column 4: Middle Bridge Protocol Gateway
  polygonWallet:  { x: 1940, y: 470 }, // Column 5: Polygon L2 Transit (cross-chain gap = 200px)
  exchange:       { x: 2400, y: 470 }, // Column 6: CEX Off-Ramp Endpoint (gap = 190px)
};

// Orbital layout: Concentric circular topology around Suspect hub
const ORBITAL_COORDS: Record<string, { x: number; y: number }> = {
  suspect:        { x: 700, y: 400 },
  victim:         { x: 700, y: 720 },
  walletB:        { x: 380, y: 240 },
  walletC:        { x: 700, y: 100 },
  walletD:        { x: 1020, y: 240 },
  downstreamDest: { x: 120, y: 140 },
  bridge:         { x: 520, y: -80 },
  polygonWallet:  { x: 850, y: -80 },
  exchange:       { x: 1180, y: -80 },
};

// Progressive chronological reconstruction steps (block by block)
export interface ReconstructionStep {
  step: number;
  label: string;
  subtitle: string;
  time: string;
  description: string;
  nodeIds: string[];
  edgeIds: string[];
  zoneIds: string[];
}

export const RECONSTRUCTION_STEPS: ReconstructionStep[] = [
  {
    step: 0,
    label: 'INFLOW',
    subtitle: 'Victim Ingestion',
    time: '10:31:04 UTC',
    description: 'Victim wallet reports unauthorized fraudulent transfer of $2,000 USDT',
    nodeIds: ['victim'],
    edgeIds: [],
    zoneIds: ['zone-eth'],
  },
  {
    step: 1,
    label: 'TARGET HUB',
    subtitle: 'Suspect Materialization',
    time: '10:31:04 UTC',
    description: '100% of illicit proceeds ($2,000 USDT) ingested into central Suspect Hub',
    nodeIds: ['victim', 'suspect'],
    edgeIds: ['TX-DEMO-001'],
    zoneIds: ['zone-eth'],
  },
  {
    step: 2,
    label: 'RAPID FAN-OUT',
    subtitle: 'Automated Dispersal',
    time: '10:33:17 UTC',
    description: 'Suspect splits funds across Wallets B ($800), C ($700), D ($500) within 24s',
    nodeIds: ['victim', 'suspect', 'walletB', 'walletC', 'walletD'],
    edgeIds: ['TX-DEMO-001', 'TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-004'],
    zoneIds: ['zone-eth'],
  },
  {
    step: 3,
    label: 'LAYERING',
    subtitle: 'Secondary Transit & Bridge Feed',
    time: '10:35:02 UTC',
    description: 'Wallet B forwards $760 onward; Wallet C feeds $700 into Cross-Chain Gateway',
    nodeIds: ['victim', 'suspect', 'walletB', 'walletC', 'walletD', 'downstreamDest', 'bridge'],
    edgeIds: ['TX-DEMO-001', 'TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-004', 'TX-DEMO-005', 'TX-DEMO-007'],
    zoneIds: ['zone-eth'],
  },
  {
    step: 4,
    label: 'BRIDGE LEAP',
    subtitle: 'Cross-Chain Transfer to L2',
    time: '10:36:11 UTC',
    description: 'Bridge protocol executes cross-chain lock & mint, moving $698 net to Polygon L2',
    nodeIds: ['victim', 'suspect', 'walletB', 'walletC', 'walletD', 'downstreamDest', 'bridge', 'polygonWallet'],
    edgeIds: ['TX-DEMO-001', 'TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-004', 'TX-DEMO-005', 'TX-DEMO-007', 'TX-DEMO-006'],
    zoneIds: ['zone-eth', 'zone-poly'],
  },
  {
    step: 5,
    label: 'CEX OFF-RAMP',
    subtitle: 'Liquidation Point Terminus',
    time: '10:41:52 UTC',
    description: 'Polygon transit wallet executes deposit of $680 USDT to Centralized Exchange hotwallet',
    nodeIds: ['victim', 'suspect', 'walletB', 'walletC', 'walletD', 'downstreamDest', 'bridge', 'polygonWallet', 'exchange'],
    edgeIds: ['TX-DEMO-001', 'TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-004', 'TX-DEMO-005', 'TX-DEMO-007', 'TX-DEMO-006', 'TX-DEMO-008'],
    zoneIds: ['zone-eth', 'zone-poly'],
  },
];

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

  // Graph Modes: 'flow' or 'orbital'
  const [graphMode, setGraphMode] = useState<'flow' | 'orbital'>('flow');
  const [chainFilter, setChainFilter] = useState<'all' | 'Ethereum' | 'Polygon'>('all');
  const [showZones, setShowZones] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [showEdgeLabels, setShowEdgeLabels] = useState(true);
  const [showPercentages, setShowPercentages] = useState(true);
  const [animateFlow, setAnimateFlow] = useState(true);
  const [isTracingPrimary, setIsTracingPrimary] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Progressive block-by-block manifestation states
  const [isReconstructionActive, setIsReconstructionActive] = useState<boolean>(true);
  const [reconstructionStep, setReconstructionStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

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

  // Automated Sequential Block Manifestation (Advances block by block)
  useEffect(() => {
    if (!isReconstructionActive || !isPlaying) return;

    if (reconstructionStep >= RECONSTRUCTION_STEPS.length - 1) {
      setIsPlaying(false);
      return;
    }

    const interval = Math.round(950 / playbackSpeed);
    const timer = setTimeout(() => {
      setReconstructionStep((prev) => prev + 1);
    }, interval);

    return () => clearTimeout(timer);
  }, [isReconstructionActive, isPlaying, reconstructionStep, playbackSpeed]);

  // Smooth Camera Guidance during progressive reconstruction
  useEffect(() => {
    if (!isReconstructionActive || graphMode !== 'flow') return;

    const cameraTargets: Record<number, { x: number; y: number; zoom: number }> = {
      0: { x: 300, y: 550, zoom: 0.95 },
      1: { x: 450, y: 550, zoom: 0.9 },
      2: { x: 800, y: 570, zoom: 0.78 },
      3: { x: 1100, y: 570, zoom: 0.7 },
      4: { x: 1500, y: 570, zoom: 0.62 },
      5: { x: 1350, y: 570, zoom: 0.55 },
    };

    const target = cameraTargets[reconstructionStep];
    if (target) {
      setCenter(target.x, target.y, { duration: 750, zoom: target.zoom });
    }
  }, [reconstructionStep, isReconstructionActive, graphMode, setCenter]);

  // Current step config
  const currentStepConfig = useMemo(() => {
    if (!isReconstructionActive) {
      return RECONSTRUCTION_STEPS[RECONSTRUCTION_STEPS.length - 1];
    }
    return RECONSTRUCTION_STEPS[reconstructionStep] || RECONSTRUCTION_STEPS[0];
  }, [isReconstructionActive, reconstructionStep]);

  // Network Zones for Flow & Orbital (modeled after "Static models" in reference image)
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

    // Generously proportioned group zones with ample internal padding
    const allZones = [
      {
        id: 'zone-eth',
        type: 'networkZone',
        position: { x: 30, y: 70 },
        data: {
          id: 'zone-eth',
          title: 'ETHEREUM MAINNET (L1)',
          subtitle: '7 ENTITIES • $2,000 USDT INGRESS & LAYERING LAYER',
          chain: 'Ethereum',
          width: 1760,
          height: 1060,
        },
        draggable: false,
        selectable: false,
        zIndex: -1,
      },
      {
        id: 'zone-poly',
        type: 'networkZone',
        position: { x: 1890, y: 360 },
        data: {
          id: 'zone-poly',
          title: 'POLYGON POS (L2)',
          subtitle: '2 ENTITIES • $680 USDT OFF-RAMP TERMINUS',
          chain: 'Polygon',
          width: 830,
          height: 440,
        },
        draggable: false,
        selectable: false,
        zIndex: -1,
      },
    ];

    // Filter zones based on active reconstruction step
    if (isReconstructionActive) {
      return allZones.filter((z) => currentStepConfig.zoneIds.includes(z.id));
    }

    return allZones;
  }, [showZones, graphMode, isReconstructionActive, currentStepConfig]);

  // Connected Entity Discovery for Focus/Dimming
  const connectedWalletIds = useMemo(() => {
    if (!selectedWalletId) return new Set<string>();
    const connected = new Set<string>([selectedWalletId]);
    DEMO_TRANSACTIONS.forEach((tx) => {
      if (tx.from === selectedWalletId) connected.add(tx.to);
      if (tx.to === selectedWalletId) connected.add(tx.from);
    });
    return connected;
  }, [selectedWalletId]);

  // Transform raw DEMO_WALLETS into React Flow Nodes (filtered by progressive step + staggerIndex)
  const initialNodes: Node[] = useMemo(() => {
    const coordsMap = graphMode === 'orbital' ? ORBITAL_COORDS : FLOW_COORDS;

    // Explicit filter mode active (only dim when specific query or trace is active)
    const isExplicitFilterActive =
      Boolean(activeDetection) ||
      highlightedNodeIds.length > 0 ||
      isTracingPrimary ||
      chainFilter !== 'all';

    const entityNodes: Node[] = Object.values(DEMO_WALLETS)
      .filter((wallet) => {
        // If sequential reconstruction is active, only show nodes revealed up to this step
        if (isReconstructionActive) {
          return currentStepConfig.nodeIds.includes(wallet.id);
        }
        return true;
      })
      .map((wallet) => {
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

        // Non-focused nodes are dimmed only when an explicit filter/trace is active
        const isDimmed = isExplicitFilterActive ? !isFocused : !matchesChainFilter;

        // Stagger index for smooth cascade within multi-node steps
        let staggerIndex = 0;
        if (wallet.id === 'walletB') staggerIndex = 0;
        if (wallet.id === 'walletC') staggerIndex = 1;
        if (wallet.id === 'walletD') staggerIndex = 2;
        if (wallet.id === 'downstreamDest') staggerIndex = 0;
        if (wallet.id === 'bridge') staggerIndex = 1;

        return {
          id: wallet.id,
          type: 'forensicNode',
          position: coordsMap[wallet.id] || wallet.position,
          data: {
            ...wallet,
            layout: graphMode,
            staggerIndex,
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
    isReconstructionActive,
    currentStepConfig,
  ]);

  // Transform raw DEMO_TRANSACTIONS into React Flow Edges (filtered by progressive step)
  const initialEdges: Edge[] = useMemo(() => {
    const isHorizontal = graphMode === 'flow';
    const sourceHandleId = isHorizontal ? 'source-right' : 'source-bottom';
    const targetHandleId = isHorizontal ? 'target-left' : 'target-top';

    const isExplicitFilterActive =
      Boolean(activeDetection) ||
      highlightedEdgeIds.length > 0 ||
      isTracingPrimary ||
      chainFilter !== 'all';

    return DEMO_TRANSACTIONS.filter((tx) => {
      // If sequential reconstruction is active, only show edges manifested up to this step
      if (isReconstructionActive) {
        return currentStepConfig.edgeIds.includes(tx.id);
      }
      return true;
    }).map((tx) => {
      const isSelected = selectedTransactionId === tx.id;
      const isDirectlyConnected = selectedWalletId
        ? tx.from === selectedWalletId || tx.to === selectedWalletId
        : false;
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

      const isDimmed = isExplicitFilterActive ? !isHighlighted : !matchesChainFilter;

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
          width: 12,
          height: 12,
          color: isHighlighted ? '#F5F5F5' : isDimmed ? '#202020' : '#555555',
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
    isReconstructionActive,
    currentStepConfig,
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
      setCenter(target.x + 135, target.y + 120, { duration: 400, zoom: 1.1 });
    }
  };

  const handleFitView = () => {
    fitView({ padding: 0.14, duration: 400 });
  };

  const handleReset = () => {
    setGraphMode('flow');
    setChainFilter('all');
    setIsTracingPrimary(false);
    onSelectWallet(null);
    if (onClearHighlight) onClearHighlight();
    fitView({ padding: 0.14, duration: 400 });
  };

  // Replay sequential reconstruction from Step 0
  const handleReplaySequence = () => {
    setIsReconstructionActive(true);
    setReconstructionStep(0);
    setIsPlaying(true);
  };

  // Show all blocks immediately
  const handleShowAll = () => {
    setIsReconstructionActive(false);
    setIsPlaying(false);
    fitView({ padding: 0.14, duration: 400 });
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
        minZoom={0.2}
        maxZoom={2.4}
        defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Obsidian Dot Grid (Commit 099030a theme) */}
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
              if (n.id === 'suspect') return '#FFFFFF';
              if (n.id === 'victim') return '#D4D4D4';
              if (n.id === 'exchange') return '#A3A3A3';
              if (n.id === 'bridge') return '#737373';
              return '#525252';
            }}
            nodeStrokeWidth={1}
            nodeBorderRadius={4}
            className="!bg-obsidian-900 !border !border-obsidian-750 !rounded-md !bottom-16 !right-3 shadow-xl"
          />
        )}
      </ReactFlow>

      {/* Smooth Layout Transition CSS for React Flow Nodes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .react-flow__node {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `,
        }}
      />

      {/* Tactical HUD Bar (Top Control Panel — Strict Monochrome) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-30 font-mono text-[11px]">
        {/* Left Cluster: Modes, Filters & Replay */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          {/* Mode Switcher: FLOW vs ORBITAL */}
          <div className="h-[30px] flex items-center bg-obsidian-900 border border-obsidian-750 p-0.5 rounded-[6px] shadow-md relative">
            {['flow', 'orbital'].map((mode) => (
              <button
                key={mode}
                onClick={() => setGraphMode(mode as 'flow' | 'orbital')}
                className={`relative px-3 py-0.5 rounded-[4px] transition-colors cursor-pointer text-[10px] uppercase font-bold tracking-wider z-10 ${
                  graphMode === mode
                    ? 'text-obsidian-950'
                    : 'text-zinc-500 hover:text-sand-300'
                }`}
              >
                {graphMode === mode && (
                  <div className="absolute inset-0 bg-sand-100 rounded-[4px] -z-10 shadow-sm transition-all duration-300" />
                )}
                {mode}
              </button>
            ))}
          </div>

          {/* Chain Filters: ALL / ETH / POL */}
          <div className="h-[30px] flex items-center bg-obsidian-900 border border-obsidian-750 p-0.5 rounded-[6px] shadow-md relative">
            {['all', 'Ethereum', 'Polygon'].map((filter) => (
              <button
                key={filter}
                onClick={() => setChainFilter(filter as 'all' | 'Ethereum' | 'Polygon')}
                className={`relative px-2.5 py-0.5 rounded-[4px] transition-colors cursor-pointer text-[10px] uppercase font-bold tracking-wider z-10 ${
                  chainFilter === filter ? 'text-sand-100' : 'text-zinc-500 hover:text-sand-300'
                }`}
              >
                {chainFilter === filter && (
                  <div className="absolute inset-0 bg-obsidian-800 border border-obsidian-700 rounded-[4px] -z-10 transition-all duration-300" />
                )}
                {filter === 'all' ? 'ALL' : filter === 'Ethereum' ? 'ETH' : 'POL'}
              </button>
            ))}
          </div>

          {/* Forensic Sequence Replay Button */}
          <button
            onClick={handleReplaySequence}
            className="h-[30px] px-2.5 bg-obsidian-900 border border-obsidian-750 hover:border-sand-300 text-sand-300 hover:text-sand-100 rounded-[6px] shadow-md flex items-center space-x-1.5 transition cursor-pointer text-[10px] uppercase font-bold"
            title="Reconstruct on-chain fund flows block by block"
          >
            <RotateCcw className="w-3 h-3 text-sand-100" />
            <span className="hidden sm:inline">REPLAY FLOW</span>
          </button>

          {/* Display Overlays: Splits, Amounts, Exit Path */}
          <div className="h-[30px] hidden md:flex items-center space-x-1 bg-obsidian-900 border border-obsidian-750 p-0.5 rounded-[4px] shadow-md">
            <button
              onClick={() => setShowPercentages(!showPercentages)}
              className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer text-[10px] ${
                showPercentages
                  ? 'bg-obsidian-850 text-sand-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Toggle split percentages"
            >
              SPLITS
            </button>
            <button
              onClick={() => setShowEdgeLabels(!showEdgeLabels)}
              className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer text-[10px] ${
                showEdgeLabels
                  ? 'bg-obsidian-850 text-sand-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Toggle amounts"
            >
              AMOUNTS
            </button>
            <button
              onClick={() => setIsTracingPrimary(!isTracingPrimary)}
              className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer flex items-center space-x-1 text-[10px] ${
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
                showMiniMap
                  ? 'bg-obsidian-850 text-sand-100'
                  : 'text-zinc-400 hover:text-sand-100'
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
                showLegend
                  ? 'bg-sand-100 text-obsidian-950 font-bold'
                  : 'text-zinc-400 hover:text-sand-100'
              }`}
              title="Toggle graph legend"
            >
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING SEQUENTIAL FORENSIC RECONSTRUCTION PLAYER (Bottom HUD) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none font-mono">
        <div className="flex items-center space-x-3 bg-obsidian-900/95 border border-obsidian-750 px-4 py-2 rounded-xl shadow-2xl backdrop-blur-xl text-xs">
          {/* Play / Pause Toggle Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-obsidian-850 border border-obsidian-700 hover:border-sand-300 text-sand-100 hover:bg-obsidian-800 transition cursor-pointer"
            title={isPlaying ? 'Pause chronological reconstruction' : 'Resume reconstruction'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Replay Button */}
          <button
            onClick={handleReplaySequence}
            className="p-1.5 rounded-lg bg-obsidian-850 border border-obsidian-700 hover:border-sand-300 text-sand-300 hover:text-sand-100 transition cursor-pointer"
            title="Restart from Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Step Progress Indicators (Clickable Hop Dots) */}
          <div className="flex items-center space-x-1.5 px-2 border-l border-r border-obsidian-750">
            {RECONSTRUCTION_STEPS.map((s, idx) => {
              const isCurrent = isReconstructionActive && reconstructionStep === idx;
              const isPassed = !isReconstructionActive || reconstructionStep > idx;

              return (
                <button
                  key={s.step}
                  onClick={() => {
                    setIsReconstructionActive(true);
                    setReconstructionStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`px-2 py-1 rounded-[4px] text-[10px] font-bold transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-sand-100 text-obsidian-950 border-sand-100 shadow-[0_0_10px_rgba(255,255,255,0.4)] scale-105'
                      : isPassed
                      ? 'bg-obsidian-800 text-sand-200 border-obsidian-700 hover:border-sand-300'
                      : 'bg-obsidian-950 text-sand-500 border-obsidian-850 hover:text-sand-400'
                  }`}
                  title={`${s.time} — ${s.description}`}
                >
                  HOP {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Telemetry Status / Timestamp */}
          <div className="flex flex-col min-w-[170px] max-w-[280px]">
            <div className="flex items-center space-x-1.5 text-[10.5px]">
              <Clock className="w-3 h-3 text-sand-400 shrink-0" />
              <span className="text-sand-100 font-bold truncate">
                {currentStepConfig.label}
              </span>
              <span className="text-sand-500">•</span>
              <span className="text-sand-400 text-[10px]">{currentStepConfig.time}</span>
            </div>
            <span className="text-[9.5px] text-sand-400 truncate leading-tight mt-0.5">
              {currentStepConfig.description}
            </span>
          </div>

          {/* Playback Speed Toggle */}
          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}
            className="px-2 py-1 rounded bg-obsidian-850 border border-obsidian-700 hover:border-sand-300 text-sand-300 hover:text-sand-100 text-[10px] font-bold cursor-pointer transition"
            title="Adjust sequence playback speed"
          >
            {playbackSpeed}x
          </button>

          {/* Show All Toggle */}
          <button
            onClick={isReconstructionActive ? handleShowAll : handleReplaySequence}
            className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase transition border cursor-pointer ${
              !isReconstructionActive
                ? 'bg-obsidian-800 text-sand-100 border-obsidian-700 hover:bg-obsidian-750'
                : 'bg-sand-100 text-obsidian-950 border-sand-100 hover:bg-white'
            }`}
          >
            {!isReconstructionActive ? 'SHOW FLOW' : 'SHOW ALL'}
          </button>
        </div>
      </div>

      {/* Forensic Graph Legend — Strict Monochrome Hierarchy */}
      {showLegend && (
        <div className="absolute top-12 right-3 z-30 w-64 bg-obsidian-900/90 backdrop-blur-xl border border-obsidian-750 p-4 rounded-[8px] shadow-2xl text-[10px] font-mono space-y-3 text-sand-400">
          <div className="flex items-center justify-between border-b border-obsidian-750 pb-2">
            <span className="text-sand-100 font-bold uppercase tracking-wider">
              ENTITY TYPE LEGEND
            </span>
            <button
              onClick={() => setShowLegend(false)}
              className="text-sand-500 hover:text-sand-100 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-[10px]">
            {[
              {
                label: 'PRIMARY TARGET [HUB]',
                color: '#F5F5F5',
                desc: 'White border · Central entity',
              },
              {
                label: 'VICTIM INGRESS',
                color: '#D4D4D8',
                desc: 'Light gray · Initial source',
              },
              {
                label: 'VASP / EXCHANGE',
                color: '#A1A1AA',
                desc: 'Mid gray · Liquidation point',
              },
              {
                label: 'CROSS-CHAIN BRIDGE',
                color: '#71717A',
                desc: 'Dashed gray · Chain swap',
              },
              {
                label: 'INTERMEDIARY RELAYS',
                color: '#52525B',
                desc: 'Darkest · Transit nodes',
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center space-x-3">
                <div
                  className="rounded-full shrink-0"
                  style={{ width: 14, height: 14, backgroundColor: item.color }}
                />
                <div>
                  <div className="text-sand-200 font-bold">{item.label}</div>
                  <div className="text-sand-500 text-[9px] mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-obsidian-750 text-[9.5px] text-sand-500 leading-relaxed">
            Click any node to focus its subgraph and view detailed on-chain intelligence.
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
