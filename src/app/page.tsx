'use client';

import React, { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { StartInvestigation } from '@/components/landing/StartInvestigation';
import { InvestigationLoading } from '@/components/loading/InvestigationLoading';
import { CaseOverviewView } from '@/components/overview/CaseOverviewView';
import { TransactionGraph } from '@/components/graph/TransactionGraph';
import { WalletIntelligencePanel } from '@/components/intelligence/WalletIntelligencePanel';
import { DetectionsView } from '@/components/detections/DetectionsView';
import { InvestigationTimeline } from '@/components/timeline/InvestigationTimeline';
import { CrossChainView } from '@/components/crosschain/CrossChainView';
import { VaspClusteringView } from '@/components/vasp/VaspClusteringView';
import { MixerAnalysisView } from '@/components/mixer/MixerAnalysisView';
import { AlertsDrawer } from '@/components/alerts/AlertsDrawer';
import { AiAssistantPanel } from '@/components/ai/AiAssistantPanel';
import { EvidenceRegistry } from '@/components/evidence/EvidenceRegistry';
import { InvestigationReportModal } from '@/components/report/InvestigationReportModal';
import {
  DEMO_CASE,
  DEMO_WALLETS,
  DEMO_TRANSACTIONS,
  DEMO_DETECTIONS,
  DEMO_EVIDENCE,
} from '@/data/demoInvestigation';
import { INITIAL_ALERTS } from '@/lib/alertEngine';
import { hydrateCaseWithNcrp, NcrpComplaintRecord } from '@/lib/ncrpRegistry';
import {
  InvestigationCase,
  InvestigationAlert,
} from '@/types/investigation';
import {
  LayoutDashboard,
  GitBranch,
  Clock,
  ShieldAlert,
  ArrowLeftRight,
  ShieldCheck,
  Bot,
  FileText,
  ChevronLeft,
  Building2,
  ShieldOff,
} from 'lucide-react';

type Screen = 'landing' | 'loading' | 'dashboard';
type ActiveTab =
  | 'overview'
  | 'graph'
  | 'timeline'
  | 'detections'
  | 'vasp'
  | 'crosschain'
  | 'privacy'
  | 'evidence'
  | 'ai';

interface NavItem {
  id: ActiveTab | 'report';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: string;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [activeTab, setActiveTab] = useState<ActiveTab>('graph');
  const [currentCase, setCurrentCase] = useState<InvestigationCase>(() =>
    hydrateCaseWithNcrp(DEMO_CASE)
  );
  const [alerts, setAlerts] = useState<InvestigationAlert[]>(INITIAL_ALERTS);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const [selectedWalletId, setSelectedWalletId] = useState<string | null>('suspect');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [activeDetectionId, setActiveDetectionId] = useState<string | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [highlightedEdgeIds, setHighlightedEdgeIds] = useState<string[]>([]);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Unread alerts count
  const unreadAlertCount = alerts.filter((a) => !a.read).length;

  // Handlers for investigation flow
  const handleStartDemo = () => {
    setCurrentCase(hydrateCaseWithNcrp(DEMO_CASE));
    setCurrentScreen('loading');
  };

  const handleCustomStart = (params: {
    address: string;
    chain: string;
    period: string;
    hops: number;
    minAmount: number;
    ncrpComplaint?: NcrpComplaintRecord;
    isLiveIndex?: boolean;
  }) => {
    if (params.ncrpComplaint) {
      setCurrentCase(hydrateCaseWithNcrp(DEMO_CASE, params.ncrpComplaint.ackNumber));
    } else {
      setCurrentCase({
        ...DEMO_CASE,
        targetAddress: params.address,
        chains: [params.chain],
        status: params.isLiveIndex ? 'LIVE RPC INDEXED' : 'ANALYSIS ACTIVE',
      });
    }
    setCurrentScreen('loading');
  };

  const handleLoadingComplete = () => {
    setCurrentScreen('dashboard');
    setActiveTab('graph');
    setSelectedWalletId('suspect');
  };

  const handleReset = () => {
    setCurrentScreen('landing');
    setActiveTab('graph');
    setSelectedWalletId('suspect');
    setSelectedTransactionId(null);
    setActiveDetectionId(null);
    setHighlightedNodeIds([]);
    setHighlightedEdgeIds([]);
    setIsAlertsOpen(false);
  };

  // Node selection callback
  const handleSelectWallet = useCallback((walletId: string | null) => {
    setSelectedWalletId(walletId);
    if (walletId) {
      setIsRightPanelOpen(true);
    }
  }, []);

  // Transaction selection callback
  const handleSelectTransaction = useCallback((txId: string) => {
    setSelectedTransactionId(txId);
    const tx = DEMO_TRANSACTIONS.find((t) => t.id === txId);
    if (tx) {
      setSelectedWalletId(tx.to);
    }
  }, []);

  // Detection selection callback
  const handleSelectDetection = useCallback((detectionId: string | null) => {
    setActiveDetectionId(detectionId);
    if (detectionId) {
      setActiveTab('graph');
    }
  }, []);

  // AI flow highlight
  const handleHighlightFlow = useCallback((nodes: string[], edges: string[]) => {
    setHighlightedNodeIds(nodes);
    setHighlightedEdgeIds(edges);
    setActiveTab('graph');
  }, []);

  // Clear AI flow highlight
  const handleClearHighlight = useCallback(() => {
    setHighlightedNodeIds([]);
    setHighlightedEdgeIds([]);
  }, []);

  // Handle alert interaction
  const handleAlertAction = (alert: InvestigationAlert) => {
    if (alert.actionType === 'FREEZE_NOTICE' || alert.actionType === 'VIEW_VASP') {
      setActiveTab('vasp');
    } else if (alert.actionType === 'OPEN_REPORT') {
      setIsReportModalOpen(true);
    } else if (alert.targetEntityId) {
      setSelectedWalletId(alert.targetEntityId);
      setActiveTab('graph');
    }

    // Mark as read
    setAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, read: true } : a))
    );
  };

  const handleDispatchAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, dispatchedToLea: true, read: true } : a
      )
    );
  };

  // Grouped Navigation Items (Section 10 of prompt + VASP & Mixers)
  const navGroups: NavGroup[] = [
    {
      name: 'CASE',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'graph', label: 'Graph', icon: GitBranch, count: '9' },
        { id: 'timeline', label: 'Timeline', icon: Clock, count: '8' },
      ],
    },
    {
      name: 'ANALYSIS',
      items: [
        { id: 'detections', label: 'Detections', icon: ShieldAlert, count: '5' },
        { id: 'vasp', label: 'VASP Clusters', icon: Building2, count: '2' },
        { id: 'crosschain', label: 'Cross-chain', icon: ArrowLeftRight, count: '2' },
        { id: 'privacy', label: 'Mixers & Privacy', icon: ShieldOff, count: '2' },
        { id: 'evidence', label: 'Evidence', icon: ShieldCheck, count: '6' },
      ],
    },
    {
      name: 'ASSIST',
      items: [
        { id: 'ai', label: 'AI Investigator', icon: Bot },
        { id: 'report', label: 'Report', icon: FileText, count: 'PDF' },
      ],
    },
  ];

  return (
    <div className="min-h-screen h-full flex-1 flex flex-col bg-[#0a0a0a] text-[#ededed] w-full max-w-full overflow-x-hidden">
      {/* Global Header */}
      <Header
        currentScreen={currentScreen}
        onReset={handleReset}
        onOpenReport={() => setIsReportModalOpen(true)}
        unreadAlertCount={unreadAlertCount}
        onToggleAlerts={() => setIsAlertsOpen(true)}
        caseData={currentCase}
      />

      {/* Screen 1: Landing Start Screen */}
      {currentScreen === 'landing' && (
        <StartInvestigation
          onStartDemo={handleStartDemo}
          onCustomStart={handleCustomStart}
        />
      )}

      {/* Screen 2: Technical Investigation Loading */}
      {currentScreen === 'loading' && (
        <InvestigationLoading onComplete={handleLoadingComplete} />
      )}

      {/* Screen 3: Main Investigation Dashboard */}
      {currentScreen === 'dashboard' && (
        <div className="no-print flex-1 flex overflow-hidden relative w-full max-w-full h-[calc(100vh-3.5rem)] min-h-[500px]">
          {/* Left Navigation Sidebar - Compact, Monochromatic, Grouped */}
          <aside className="no-print w-56 lg:w-60 bg-[#101010] border-r border-[#222222] flex flex-col justify-between shrink-0 select-none z-20">
            <div className="p-3 space-y-4 overflow-y-auto">
              {/* Quick Case Stats Card */}
              <div className="bg-[#141414] border border-[#242424] p-3 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[#888888] border-b border-[#242424] pb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#666666]">
                    CASE TELEMETRY
                  </span>
                  <span className="text-[10px] text-white font-semibold">
                    {currentCase.chains.length} CHAINS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#666666] block text-[9px] uppercase tracking-wider">Total Sum</span>
                    <span className="text-white font-bold">${currentCase.totalValue.toLocaleString()} USDT</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block text-[9px] uppercase tracking-wider">Risk Score</span>
                    <span className="text-white font-bold">{currentCase.riskScore} / 100</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block text-[9px] uppercase tracking-wider">Entities</span>
                    <span className="text-[#cccccc] font-medium">{currentCase.walletCount} Tracked</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block text-[9px] uppercase tracking-wider">Timeframe</span>
                    <span className="text-[#cccccc] font-medium">10m 48s</span>
                  </div>
                </div>

                {/* NCRP Ack Pill in Telemetry */}
                {currentCase.ncrpAckNumber && (
                  <div className="pt-1.5 border-t border-[#202020] text-[10px] text-blue-400 truncate">
                    <span className="text-[#666666] block text-[8px] uppercase">NCRP Complaint</span>
                    <span className="font-semibold select-all">{currentCase.ncrpAckNumber}</span>
                  </div>
                )}
              </div>

              {/* Grouped Navigation Menu */}
              <div className="space-y-4 font-mono text-xs">
                {navGroups.map((group) => (
                  <div key={group.name} className="space-y-1">
                    <div className="text-[10px] font-bold text-[#666666] uppercase tracking-wider px-2 pb-0.5">
                      {group.name}
                    </div>

                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.id === 'report') {
                              setIsReportModalOpen(true);
                            } else {
                              setActiveTab(item.id);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-sm transition text-left cursor-pointer ${
                            isActive
                              ? 'bg-[#e5e5e5] text-[#000000] font-semibold'
                              : 'text-[#888888] hover:text-[#ffffff] hover:bg-[#1a1a1a]'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? 'text-[#000000]' : 'text-[#666666]'
                              }`}
                            />
                            <span className="truncate text-xs">{item.label}</span>
                          </div>

                          {item.count && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                                isActive
                                  ? 'bg-[#000000] text-[#ffffff]'
                                  : 'bg-[#181818] text-[#888888] border border-[#2a2a2a]'
                              }`}
                            >
                              {item.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Bottom: Alert Status indicator */}
            <div className="p-3 border-t border-[#222222] bg-[#0c0c0c] text-[11px] font-mono space-y-1">
              <button
                onClick={() => setIsAlertsOpen(true)}
                className="w-full flex items-center justify-between text-[#aaaaaa] hover:text-white transition p-1 rounded hover:bg-[#181818]"
              >
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Real-Time Alerts</span>
                </div>
                <span className="font-bold text-white bg-red-950 border border-red-800 px-1.5 py-0.2 rounded text-[10px]">
                  {alerts.length}
                </span>
              </button>
            </div>
          </aside>

          {/* Center Main Stage Content */}
          <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0a0a0a] relative">
            {activeTab === 'overview' && (
              <CaseOverviewView
                onNavigate={(tab) => {
                  if (tab === 'report') {
                    setIsReportModalOpen(true);
                  } else {
                    setActiveTab(tab as ActiveTab);
                  }
                }}
                onOpenReport={() => setIsReportModalOpen(true)}
                onSelectWallet={handleSelectWallet}
                caseData={currentCase}
              />
            )}

            {activeTab === 'graph' && (
              <div
                className="w-full h-full flex-1 min-h-0 relative"
                style={{ width: '100%', height: '100%' }}
              >
                <TransactionGraph
                  selectedWalletId={selectedWalletId}
                  onSelectWallet={handleSelectWallet}
                  selectedTransactionId={selectedTransactionId}
                  onSelectTransaction={handleSelectTransaction}
                  activeDetectionId={activeDetectionId}
                  highlightedNodeIds={highlightedNodeIds}
                  highlightedEdgeIds={highlightedEdgeIds}
                  onClearHighlight={handleClearHighlight}
                />
              </div>
            )}

            {activeTab === 'timeline' && (
              <InvestigationTimeline
                selectedTransactionId={selectedTransactionId}
                onSelectTransaction={handleSelectTransaction}
                onFocusGraph={() => setActiveTab('graph')}
              />
            )}

            {activeTab === 'detections' && (
              <DetectionsView
                activeDetectionId={activeDetectionId}
                onSelectDetection={handleSelectDetection}
                onSelectTab={(tab) => {
                  if (tab === 'report') {
                    setIsReportModalOpen(true);
                  } else {
                    setActiveTab(tab as ActiveTab);
                  }
                }}
              />
            )}

            {activeTab === 'vasp' && (
              <VaspClusteringView
                onSelectWallet={(walletId) => {
                  handleSelectWallet(walletId);
                  setActiveTab('graph');
                }}
                onOpenReport={() => setIsReportModalOpen(true)}
              />
            )}

            {activeTab === 'crosschain' && (
              <CrossChainView
                onFocusNode={(nodeId) => {
                  setSelectedWalletId(nodeId);
                  setActiveTab('graph');
                }}
              />
            )}

            {activeTab === 'privacy' && (
              <MixerAnalysisView
                onSelectWallet={(walletId) => {
                  handleSelectWallet(walletId);
                  setActiveTab('graph');
                }}
              />
            )}

            {activeTab === 'evidence' && (
              <EvidenceRegistry
                onSelectEntity={(address) => {
                  const match = Object.values(DEMO_WALLETS).find(
                    (w) => w.address.toLowerCase() === address.toLowerCase()
                  );
                  if (match) {
                    setSelectedWalletId(match.id);
                    setActiveTab('graph');
                  }
                }}
              />
            )}

            {activeTab === 'ai' && (
              <AiAssistantPanel
                onHighlightFlow={handleHighlightFlow}
                onSelectWallet={(walletId) => {
                  handleSelectWallet(walletId);
                }}
                onSelectTransaction={(txId) => {
                  handleSelectTransaction(txId);
                }}
                onFocusTab={(tab) => {
                  if (tab === 'report') {
                    setIsReportModalOpen(true);
                  } else {
                    setActiveTab(tab as ActiveTab);
                  }
                }}
              />
            )}
          </main>

          {/* Right Intelligence Context Drawer (Collapsible) */}
          <aside
            className={`no-print border-l border-[#222222] transition-all duration-200 z-30 shrink-0 ${
              isRightPanelOpen ? 'w-80 lg:w-96' : 'w-0 overflow-hidden border-none'
            }`}
          >
            {isRightPanelOpen && (
              <WalletIntelligencePanel
                walletId={selectedWalletId}
                onClose={() => setIsRightPanelOpen(false)}
                onSelectWallet={handleSelectWallet}
              />
            )}
          </aside>

          {/* Floating Drawer Toggle if closed */}
          {!isRightPanelOpen && (
            <button
              onClick={() => setIsRightPanelOpen(true)}
              className="absolute right-3 top-3 z-30 bg-[#161616] hover:bg-[#222222] border border-[#333333] text-white p-2 rounded-sm shadow-xl transition flex items-center space-x-1.5 text-xs font-mono cursor-pointer"
              title="Open Wallet Intelligence Drawer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Intelligence</span>
            </button>
          )}
        </div>
      )}

      {/* Real-Time LEA Alert Center Drawer */}
      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onActionClick={handleAlertAction}
        onDispatchAlert={handleDispatchAlert}
      />

      {/* Case Report Modal */}
      <InvestigationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        caseData={currentCase}
      />
    </div>
  );
}
