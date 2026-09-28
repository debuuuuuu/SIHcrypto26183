import {
  DEMO_CASE,
  DEMO_WALLETS,
  DEMO_TRANSACTIONS,
  DEMO_DETECTIONS,
  DEMO_RISK_ASSESSMENT,
  DEMO_EVIDENCE,
  DEMO_CROSS_CHAIN_HOP,
} from '@/data/demoInvestigation';
import { getWalletRiskAssessment } from '@/lib/riskEngine';
import { FocusAction } from '@/types/ai';

/**
 * Helper to resolve wallet key from ID, address, or label
 */
function resolveWalletId(walletIdOrAddress: string): string | null {
  if (!walletIdOrAddress) return null;
  const input = walletIdOrAddress.trim().toLowerCase();

  // 1. Direct ID match
  if (DEMO_WALLETS[input]) return input;

  // 2. Exact or substring address match
  for (const [key, wallet] of Object.entries(DEMO_WALLETS)) {
    if (wallet.address.toLowerCase() === input || wallet.address.toLowerCase().includes(input)) {
      return key;
    }
  }

  // 3. Label / Alias match (e.g., "wallet b", "wallet-b", "suspect", "bridge")
  const normalized = input.replace(/[\s\-_]/g, '');
  for (const [key, wallet] of Object.entries(DEMO_WALLETS)) {
    const labelNorm = wallet.label.toLowerCase().replace(/[\s\-_]/g, '');
    const keyNorm = key.toLowerCase().replace(/[\s\-_]/g, '');
    if (labelNorm === normalized || keyNorm === normalized) {
      return key;
    }
  }

  return null;
}

// -----------------------------------------------------------------------------
// 1. Case and Entity Tools
// -----------------------------------------------------------------------------

export function get_investigation_summary() {
  return {
    caseId: DEMO_CASE.caseId,
    caseName: DEMO_CASE.caseName,
    targetAddress: DEMO_CASE.targetAddress,
    status: DEMO_CASE.status,
    chains: DEMO_CASE.chains,
    investigatedVolumeUSDT: DEMO_CASE.totalValue,
    riskScore: DEMO_CASE.riskScore,
    riskLevel: 'HIGH',
    classification: DEMO_CASE.classification,
    reportingVictim: DEMO_CASE.reportingVictim,
    totalTransactions: DEMO_CASE.transactionCount,
    totalWallets: DEMO_CASE.walletCount,
    timeframe: '10:31:04 UTC – 10:41:52 UTC (10m 48s)',
  };
}

export function get_wallet(walletIdOrAddress: string) {
  const resolvedId = resolveWalletId(walletIdOrAddress);
  if (!resolvedId) {
    return {
      error: `Wallet "${walletIdOrAddress}" was not found in the MONOMER investigation dataset.`,
      availableWallets: Object.keys(DEMO_WALLETS),
    };
  }

  const w = DEMO_WALLETS[resolvedId];
  return {
    id: w.id,
    label: w.label,
    address: w.address,
    entityType: w.entityType,
    chain: w.chain,
    balance: w.balance,
    riskScore: w.riskScore,
    role: w.role || w.entityType,
    tags: w.tags,
    description: w.description,
    totalReceived: w.totalReceived,
    totalSent: w.totalSent,
    txCount: w.txCount,
    firstSeen: w.firstSeen,
    lastActive: w.lastActive,
    associatedWallets: w.associatedWallets,
    detectedPatterns: w.detectedPatterns,
  };
}

export function get_wallet_transactions(walletIdOrAddress: string) {
  const resolvedId = resolveWalletId(walletIdOrAddress);
  if (!resolvedId) {
    return {
      error: `Wallet "${walletIdOrAddress}" not found in investigation dataset.`,
    };
  }

  const wallet = DEMO_WALLETS[resolvedId];
  const txs = DEMO_TRANSACTIONS.filter(
    (tx) =>
      tx.from === resolvedId ||
      tx.to === resolvedId ||
      tx.from === wallet.address ||
      tx.to === wallet.address
  );

  return {
    walletId: resolvedId,
    walletAddress: wallet.address,
    transactionCount: txs.length,
    transactions: txs.map((tx) => ({
      id: tx.id,
      from: tx.from,
      to: tx.to,
      amount: tx.amount,
      amountFormatted: tx.amountFormatted,
      chain: tx.chain,
      timestamp: tx.timestamp,
      hash: tx.hash,
      patternTag: tx.patternTag,
      notes: tx.notes || '',
    })),
  };
}

export function get_incoming_transactions(walletIdOrAddress: string) {
  const resolvedId = resolveWalletId(walletIdOrAddress);
  if (!resolvedId) {
    return { error: `Wallet "${walletIdOrAddress}" not found.` };
  }
  const wallet = DEMO_WALLETS[resolvedId];
  const txs = DEMO_TRANSACTIONS.filter(
    (tx) => tx.to === resolvedId || tx.to === wallet.address
  );
  return {
    walletId: resolvedId,
    incomingCount: txs.length,
    transactions: txs,
  };
}

export function get_outgoing_transactions(walletIdOrAddress: string) {
  const resolvedId = resolveWalletId(walletIdOrAddress);
  if (!resolvedId) {
    return { error: `Wallet "${walletIdOrAddress}" not found.` };
  }
  const wallet = DEMO_WALLETS[resolvedId];
  const txs = DEMO_TRANSACTIONS.filter(
    (tx) => tx.from === resolvedId || tx.from === wallet.address
  );
  return {
    walletId: resolvedId,
    outgoingCount: txs.length,
    transactions: txs,
  };
}

export function get_wallet_connections(walletIdOrAddress: string) {
  const resolvedId = resolveWalletId(walletIdOrAddress);
  if (!resolvedId) {
    return { error: `Wallet "${walletIdOrAddress}" not found.` };
  }

  const wallet = DEMO_WALLETS[resolvedId];
  const connections: Array<{
    connectedWalletId: string;
    connectedAddress: string;
    role: string;
    direction: 'inflow' | 'outflow' | 'bidirectional';
    txCount: number;
    transferredUSDT: number;
  }> = [];

  for (const otherId of Object.keys(DEMO_WALLETS)) {
    if (otherId === resolvedId) continue;
    const otherWallet = DEMO_WALLETS[otherId];

    const outgoing = DEMO_TRANSACTIONS.filter(
      (tx) =>
        (tx.from === resolvedId || tx.from === wallet.address) &&
        (tx.to === otherId || tx.to === otherWallet.address)
    );
    const incoming = DEMO_TRANSACTIONS.filter(
      (tx) =>
        (tx.from === otherId || tx.from === otherWallet.address) &&
        (tx.to === resolvedId || tx.to === wallet.address)
    );

    if (outgoing.length > 0 || incoming.length > 0) {
      const allTx = [...outgoing, ...incoming];
      const sum = allTx.reduce((acc, t) => acc + (t.amount || 0), 0);
      const dir =
        outgoing.length > 0 && incoming.length > 0
          ? 'bidirectional'
          : outgoing.length > 0
          ? 'outflow'
          : 'inflow';

      connections.push({
        connectedWalletId: otherId,
        connectedAddress: otherWallet.address,
        role: otherWallet.role || otherWallet.entityType,
        direction: dir,
        txCount: allTx.length,
        transferredUSDT: sum,
      });
    }
  }

  return {
    walletId: resolvedId,
    connectionsCount: connections.length,
    connections,
  };
}

// -----------------------------------------------------------------------------
// 2. Transaction and Timeline Tools
// -----------------------------------------------------------------------------

export function get_transaction(transactionId: string) {
  const input = transactionId.trim().toLowerCase();
  const tx = DEMO_TRANSACTIONS.find(
    (t) => t.id.toLowerCase() === input || t.hash.toLowerCase() === input
  );

  if (!tx) {
    return {
      error: `Transaction "${transactionId}" was not found in MONOMER dataset.`,
      availableTransactions: DEMO_TRANSACTIONS.map((t) => t.id),
    };
  }

  return {
    id: tx.id,
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    fromLabel: DEMO_WALLETS[tx.from]?.label || tx.from,
    toLabel: DEMO_WALLETS[tx.to]?.label || tx.to,
    amount: tx.amount,
    amountFormatted: tx.amountFormatted,
    chain: tx.chain,
    timestamp: tx.timestamp,
    patternTag: tx.patternTag,
    notes: tx.notes || '',
  };
}

export function get_timeline() {
  return {
    totalEvents: DEMO_TRANSACTIONS.length,
    timeframe: '10:31:04 UTC – 10:41:52 UTC',
    events: DEMO_TRANSACTIONS.map((tx, idx) => ({
      sequence: idx + 1,
      id: tx.id,
      timestamp: tx.timestamp,
      from: tx.from,
      fromLabel: DEMO_WALLETS[tx.from]?.label || tx.from,
      to: tx.to,
      toLabel: DEMO_WALLETS[tx.to]?.label || tx.to,
      amount: tx.amount,
      amountFormatted: tx.amountFormatted,
      chain: tx.chain,
      hash: tx.hash,
      patternTag: tx.patternTag,
      notes: tx.notes || '',
    })),
  };
}

// -----------------------------------------------------------------------------
// 3. Calculation Tools
// -----------------------------------------------------------------------------

export function calculate_amount_percentage(amount: number, total: number) {
  if (!total || total === 0) {
    return { error: 'Total must be greater than zero.' };
  }
  const pct = (amount / total) * 100;
  return {
    amount,
    total,
    percentage: Number(pct.toFixed(2)),
    formatted: `${pct.toFixed(1)}%`,
  };
}

export function calculate_elapsed_time(timestamp1: string, timestamp2: string) {
  try {
    const t1 = new Date(timestamp1).getTime();
    const t2 = new Date(timestamp2).getTime();
    if (isNaN(t1) || isNaN(t2)) {
      return { error: 'Invalid ISO timestamp provided.' };
    }
    const deltaMs = Math.abs(t2 - t1);
    const deltaSeconds = Math.round(deltaMs / 1000);
    const minutes = Math.floor(deltaSeconds / 60);
    const seconds = deltaSeconds % 60;
    return {
      timestamp1,
      timestamp2,
      deltaSeconds,
      formatted: `${minutes}m ${seconds}s`,
    };
  } catch {
    return { error: 'Could not calculate elapsed time.' };
  }
}

// -----------------------------------------------------------------------------
// 4. Detection Tools
// -----------------------------------------------------------------------------

export function get_detection_patterns() {
  return {
    count: DEMO_DETECTIONS.length,
    patterns: DEMO_DETECTIONS.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      confidence: d.confidence,
      severity: d.severity,
      affectedNodes: d.affectedNodes,
      affectedEdges: d.affectedEdges,
      indicators: d.indicators,
      evidenceIds: d.evidenceIds,
    })),
  };
}

export function get_detection(patternId: string) {
  const input = patternId.trim().toLowerCase();
  const pattern = DEMO_DETECTIONS.find(
    (d) =>
      d.id.toLowerCase() === input ||
      d.title.toLowerCase().replace(/[\s-_]/g, '') === input.replace(/[\s-_]/g, '')
  );

  if (!pattern) {
    return {
      error: `Detection pattern "${patternId}" not found in MONOMER dataset.`,
      availablePatterns: DEMO_DETECTIONS.map((d) => ({ id: d.id, title: d.title })),
    };
  }

  return {
    id: pattern.id,
    title: pattern.title,
    description: pattern.description,
    confidence: pattern.confidence,
    severity: pattern.severity,
    affectedNodes: pattern.affectedNodes,
    affectedEdges: pattern.affectedEdges,
    indicators: pattern.indicators,
    evidenceIds: pattern.evidenceIds,
  };
}

// -----------------------------------------------------------------------------
// 5. Risk Tools
// -----------------------------------------------------------------------------

export function get_risk_assessment() {
  const suspectRisk = getWalletRiskAssessment('suspect');
  return {
    overallRiskScore: DEMO_CASE.riskScore,
    riskLevel: suspectRisk.level,
    targetWallet: DEMO_CASE.targetAddress,
    explanation: suspectRisk.explanation,
    signalsCount: suspectRisk.signals.length,
    disclaimer: DEMO_RISK_ASSESSMENT.disclaimer,
  };
}

export function get_risk_signals() {
  const suspectRisk = getWalletRiskAssessment('suspect');
  return {
    score: suspectRisk.score,
    maxScore: DEMO_RISK_ASSESSMENT.maxScore,
    level: suspectRisk.level,
    signals: suspectRisk.signals.map((s) => ({
      category: s.category,
      scoreContribution: s.scoreContribution,
      maxScore: s.maxScore,
      severity: s.severity,
      rationale: s.rationale,
    })),
  };
}

// -----------------------------------------------------------------------------
// 6. Cross-Chain Tool
// -----------------------------------------------------------------------------

export function get_cross_chain_events() {
  return {
    sourceChain: DEMO_CROSS_CHAIN_HOP.sourceChain,
    targetChain: DEMO_CROSS_CHAIN_HOP.targetChain,
    bridgeEntity: DEMO_CROSS_CHAIN_HOP.bridgeEntity,
    bridgeTxHash: DEMO_CROSS_CHAIN_HOP.bridgeTxHash,
    claimTxHash: DEMO_CROSS_CHAIN_HOP.claimTxHash,
    depositTxId: 'TX-DEMO-005',
    claimTxId: 'TX-DEMO-006',
    sourceAmount: '$700.00 USDT',
    targetAmount: '$698.00 USDT',
    protocolFee: '$2.00 USDT',
    transitTimeSeconds: DEMO_CROSS_CHAIN_HOP.latencySeconds,
    transitTimeFormatted: `${DEMO_CROSS_CHAIN_HOP.latencySeconds} seconds`,
    confidenceScore: DEMO_CROSS_CHAIN_HOP.confidence,
    confidencePercentage: `${DEMO_CROSS_CHAIN_HOP.confidence}%`,
    senderWallet: DEMO_WALLETS.walletC.address,
    bridgeDepositContract: DEMO_WALLETS.bridge.address,
    polygonRecipientWallet: DEMO_WALLETS.polygonWallet.address,
  };
}

// -----------------------------------------------------------------------------
// 7. Evidence Tools
// -----------------------------------------------------------------------------

export function get_evidence(evidenceId?: string) {
  if (!evidenceId || evidenceId.trim().toLowerCase() === 'all') {
    return {
      totalEvidence: DEMO_EVIDENCE.length,
      evidence: DEMO_EVIDENCE,
    };
  }
  const input = evidenceId.trim().toUpperCase();
  const evd = DEMO_EVIDENCE.find((e) => e.id === input);
  if (!evd) {
    return {
      error: `Evidence record "${evidenceId}" not found.`,
      availableEvidence: DEMO_EVIDENCE.map((e) => e.id),
    };
  }
  return evd;
}

export function get_evidence_for_wallet(walletIdOrAddress: string) {
  const resolvedId = resolveWalletId(walletIdOrAddress);
  if (!resolvedId) {
    return { error: `Wallet "${walletIdOrAddress}" not found.` };
  }
  const wallet = DEMO_WALLETS[resolvedId];
  const items = DEMO_EVIDENCE.filter(
    (e) =>
      e.relatedEntities.includes(resolvedId) ||
      e.relatedEntities.some(
        (ent) => ent.toLowerCase() === wallet.address.toLowerCase()
      )
  );
  return {
    walletId: resolvedId,
    evidenceCount: items.length,
    evidence: items,
  };
}

export function get_evidence_for_transaction(transactionId: string) {
  const input = transactionId.trim().toUpperCase();
  const items = DEMO_EVIDENCE.filter(
    (e) => e.sourceTxId === input || e.sourceHash.toLowerCase() === input.toLowerCase()
  );
  return {
    transactionId: input,
    evidenceCount: items.length,
    evidence: items,
  };
}

export function get_evidence_for_pattern(patternId: string) {
  const pattern = DEMO_DETECTIONS.find(
    (d) => d.id.toLowerCase() === patternId.trim().toLowerCase()
  );
  if (!pattern) {
    return { error: `Pattern "${patternId}" not found.` };
  }
  const items = DEMO_EVIDENCE.filter((e) => pattern.evidenceIds.includes(e.id));
  return {
    patternId: pattern.id,
    patternTitle: pattern.title,
    evidenceCount: items.length,
    evidence: items,
  };
}

// -----------------------------------------------------------------------------
// 8. Controlled UI Action Tools
// -----------------------------------------------------------------------------

export function focus_wallet(walletId: string): { action: FocusAction; message: string } {
  const resolvedId = resolveWalletId(walletId) || walletId;
  return {
    action: {
      type: 'focus_wallet',
      target: resolvedId,
    },
    message: `UI action recorded: Focusing graph node on wallet "${resolvedId}".`,
  };
}

export function focus_transaction(transactionId: string): { action: FocusAction; message: string } {
  return {
    action: {
      type: 'focus_transaction',
      target: transactionId.trim().toUpperCase(),
    },
    message: `UI action recorded: Focusing graph edge on transaction "${transactionId}".`,
  };
}

export function focus_detection(patternId: string): { action: FocusAction; message: string } {
  return {
    action: {
      type: 'focus_detection',
      target: patternId.trim().toLowerCase(),
    },
    message: `UI action recorded: Isolating detection pattern "${patternId}" on graph.`,
  };
}

// -----------------------------------------------------------------------------
// Central Tool Dispatcher
// -----------------------------------------------------------------------------

export function executeInvestigationTool(toolName: string, args: Record<string, any> = {}): any {
  switch (toolName) {
    case 'get_investigation_summary':
      return get_investigation_summary();

    case 'get_wallet':
      return get_wallet(args.walletId || args.walletIdOrAddress || args.address || 'suspect');

    case 'get_wallet_transactions':
      return get_wallet_transactions(args.walletId || args.walletIdOrAddress || 'suspect');

    case 'get_incoming_transactions':
      return get_incoming_transactions(args.walletId || args.walletIdOrAddress || 'suspect');

    case 'get_outgoing_transactions':
      return get_outgoing_transactions(args.walletId || args.walletIdOrAddress || 'suspect');

    case 'get_wallet_connections':
      return get_wallet_connections(args.walletId || args.walletIdOrAddress || 'suspect');

    case 'get_transaction':
      return get_transaction(args.transactionId || args.txId || 'TX-DEMO-001');

    case 'get_timeline':
      return get_timeline();

    case 'calculate_amount_percentage':
      return calculate_amount_percentage(Number(args.amount) || 0, Number(args.total) || 1);

    case 'calculate_elapsed_time':
      return calculate_elapsed_time(args.timestamp1, args.timestamp2);

    case 'get_detection_patterns':
      return get_detection_patterns();

    case 'get_detection':
      return get_detection(args.patternId || 'det-001');

    case 'get_risk_assessment':
      return get_risk_assessment();

    case 'get_risk_signals':
      return get_risk_signals();

    case 'get_cross_chain_events':
      return get_cross_chain_events();

    case 'get_evidence':
      return get_evidence(args.evidenceId);

    case 'get_evidence_for_wallet':
      return get_evidence_for_wallet(args.walletId || args.walletIdOrAddress || 'suspect');

    case 'get_evidence_for_transaction':
      return get_evidence_for_transaction(args.transactionId || 'TX-DEMO-001');

    case 'get_evidence_for_pattern':
      return get_evidence_for_pattern(args.patternId || 'det-001');

    case 'focus_wallet':
      return focus_wallet(args.walletId || 'suspect');

    case 'focus_transaction':
      return focus_transaction(args.transactionId || 'TX-DEMO-001');

    case 'focus_detection':
      return focus_detection(args.patternId || 'det-001');

    default:
      return { error: `Tool "${toolName}" is not a recognized MONOMER investigation tool.` };
  }
}

// -----------------------------------------------------------------------------
// OpenAI-Compatible Tool Specifications
// -----------------------------------------------------------------------------

export const INVESTIGATION_TOOL_DEFINITIONS = [
  {
    type: 'function' as const,
    function: {
      name: 'get_investigation_summary',
      description: 'Get case overview for Case INV-DEMO-2026-001 (suspect wallet, risk level, traced volume).',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_wallet',
      description: 'Get profile, balance, risk score, tags, and role for a wallet (e.g. suspect, walletB, walletC, walletD, bridge, polygonWallet, exchange).',
      parameters: {
        type: 'object',
        properties: {
          walletId: { type: 'string', description: 'Wallet identifier or address.' },
        },
        required: ['walletId'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_wallet_transactions',
      description: 'Get all incoming and outgoing transactions for a wallet from the MONOMER dataset.',
      parameters: {
        type: 'object',
        properties: {
          walletId: { type: 'string', description: 'Wallet ID or address to inspect.' },
        },
        required: ['walletId'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_transaction',
      description: 'Get verified details for a transaction by ID (TX-DEMO-001 to TX-DEMO-008).',
      parameters: {
        type: 'object',
        properties: {
          transactionId: { type: 'string', description: 'Transaction ID (e.g. TX-DEMO-001).' },
        },
        required: ['transactionId'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_cross_chain_events',
      description: 'Get Ethereum to Polygon bridge hop telemetry (deposit, release, transit time, fees).',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_risk_assessment',
      description: 'Get official calculated risk assessment (Score 78/100, HIGH RISK) and weighted signals.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_detection_patterns',
      description: 'Get all behavioral patterns (Rapid Movement, Fan-Out, Layering, Cross-Chain, CEX Deposit).',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_evidence',
      description: 'Get forensic evidence records (EVD-001 through EVD-006).',
      parameters: {
        type: 'object',
        properties: {
          evidenceId: { type: 'string', description: 'Evidence ID or leave blank for all evidence.' },
        },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'focus_wallet',
      description: 'UI action: Focus the graph camera and panels on the specified wallet (e.g. suspect, walletB, walletC).',
      parameters: {
        type: 'object',
        properties: {
          walletId: { type: 'string', description: 'Target wallet ID.' },
        },
        required: ['walletId'],
      },
    },
  },
];
