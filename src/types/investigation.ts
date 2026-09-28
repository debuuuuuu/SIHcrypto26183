export type EntityType =
  | 'victim'
  | 'suspect'
  | 'intermediary'
  | 'bridge'
  | 'exchange'
  | 'polygon';

export interface WalletNode {
  id: string;
  address: string;
  label: string;
  entityType: EntityType;
  chain: 'Ethereum' | 'Polygon';
  balance: string;
  riskScore: number;
  tags: string[];
  description: string;
  totalReceived: string;
  totalSent: string;
  txCount: number;
  firstSeen: string;
  lastActive: string;
  position: { x: number; y: number };
  associatedWallets: string[];
  detectedPatterns: string[];
  role?: string;
}

export type PatternTag =
  | 'INITIAL_TRANSFER'
  | 'FAN_OUT'
  | 'CROSS_CHAIN'
  | 'RAPID_MOVEMENT'
  | 'EXCHANGE_INTERACTION';

export interface TransactionEdge {
  id: string;
  hash: string;
  from: string;
  to: string;
  asset: string;
  amount: number;
  amountFormatted: string;
  timestamp: string;
  status: 'confirmed' | 'flagged' | 'pending';
  hopIndex: number;
  patternTag: PatternTag;
  blockNumber: number;
  chain: 'Ethereum' | 'Polygon';
  notes?: string;
}

export interface DetectionPattern {
  id: string;
  title: string;
  description: string;
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedNodes: string[];
  affectedEdges: string[];
  indicators: string[];
  evidenceIds: string[];
}

export interface RiskSignal {
  category: string;
  scoreContribution: number;
  maxScore: number;
  rationale: string;
  severity: 'high' | 'medium' | 'low';
}

export interface RiskAssessment {
  score: number;
  maxScore: number;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  signals: RiskSignal[];
  disclaimer: string;
}

export interface EvidenceRecord {
  id: string;
  type: string;
  timestamp: string;
  sourceHash: string;
  sourceTxId: string;
  description: string;
  relatedEntities: string[];
  confidence: number;
  proofType: string;
}

export interface CrossChainHop {
  sourceChain: string;
  targetChain: string;
  bridgeEntity: string;
  bridgeTxHash: string;
  claimTxHash: string;
  asset: string;
  amount: number;
  amountFormatted: string;
  latencySeconds: number;
  confidence: number;
  notes?: string;
}

export interface InvestigationCase {
  caseId: string;
  caseName: string;
  targetAddress: string;
  startTime: string;
  endTime: string;
  status: string;
  chains: string[];
  totalValue: number;
  transactionCount: number;
  walletCount: number;
  riskScore: number;
  classification: string;
  reportingVictim: string;
  jurisdiction: string;
  // NCRP & SAHYOG Integration fields
  ncrpAckNumber?: string;
  sahyogTicketId?: string;
  complainantName?: string;
  policeStationJurisdiction?: string;
  firOrGdNumber?: string;
  reportingPortal?: 'NCRP' | 'SAHYOG' | 'DIRECT_LEA';
  sahyogStatus?: 'SYNCED' | 'NOTICE_SERVED' | 'FREEZE_REQUESTED' | 'COMPLETED';
  crimeSubCategory?: string;
}

export interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  evidenceRefs?: string[];
  suggestedAction?: string;
  highlightNodes?: string[];
  highlightEdges?: string[];
}

// -----------------------------------------------------------------------------
// VASP & Clustering Types
// -----------------------------------------------------------------------------
export interface VaspEntity {
  id: string;
  name: string;
  shortName: string;
  logoText?: string;
  jurisdiction: string;
  fiuIndRegistered: boolean;
  complianceRating: 'A' | 'B' | 'C' | 'NON_COMPLIANT';
  nodalEmail: string;
  emergencyPortalUrl: string;
  clusterCount: number;
  totalVolumeTrackedUSDT: string;
  knownDepositPatterns: string[];
}

export interface VaspCluster {
  clusterId: string;
  vaspId: string;
  vaspName: string;
  rootAddress: string;
  associatedAddresses: string[];
  confidence: number;
  heuristicUsed: 'SWEEP_CONSOLIDATION' | 'GAS_SPONSOR' | 'MULTI_INPUT' | 'TIMING_BURST';
  totalVolumeUSD: number;
  lastActive: string;
}

// -----------------------------------------------------------------------------
// Privacy Protocol & Mixer Types
// -----------------------------------------------------------------------------
export type PrivacyProtocolType =
  | 'TORNADO_CASH'
  | 'RAILGUN'
  | 'WASABI_COINJOIN'
  | 'SINBAD_BLENDER'
  | 'INSTANT_EXCHANGE';

export interface MixerInteraction {
  id: string;
  protocol: PrivacyProtocolType;
  poolName: string;
  chain: string;
  contractAddress: string;
  depositTxHash: string;
  withdrawalTxHash?: string;
  denomination: string;
  anonymitySetSize: number;
  deanonymizationConfidence: number;
  relayerAddress?: string;
  matchedHeuristics: string[];
  timeDeltaMinutes?: number;
  status: 'IDENTIFIED' | 'CORRELATED' | 'UNLINKED';
}

// -----------------------------------------------------------------------------
// Real-Time Alert Types
// -----------------------------------------------------------------------------
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'info';
export type AlertCategory =
  | 'VASP_DEPOSIT'
  | 'RAPID_LAYERING'
  | 'BRIDGE_EGRESS'
  | 'MIXER_TOUCH'
  | 'SAHYOG_AUTO_FREEZE'
  | 'LIVE_MEMPOOL';

export interface InvestigationAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  targetEntityId?: string;
  targetTxId?: string;
  actionLabel?: string;
  actionType?: 'FOCUS_NODE' | 'OPEN_REPORT' | 'FREEZE_NOTICE' | 'VIEW_VASP';
  dispatchedToLea: boolean;
  read: boolean;
}

