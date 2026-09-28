import { AiMessage } from '@/types/investigation';
import {
  DEMO_CASE,
  DEMO_WALLETS,
  DEMO_TRANSACTIONS,
  DEMO_DETECTIONS,
  DEMO_RISK_ASSESSMENT,
  DEMO_CROSS_CHAIN_HOP,
} from '@/data/demoInvestigation';

export interface GroundedQueryResponse {
  content: string;
  evidenceRefs: string[];
  suggestedAction?: string;
  highlightNodes?: string[];
  highlightEdges?: string[];
}

export const SUGGESTED_QUERIES = [
  'Where did the money go?',
  'Why is this wallet suspicious?',
  'Show the cross-chain movement.',
  'Which wallet received the most?',
  'What patterns were detected?',
  'Summarize this investigation.',
];

export function answerInvestigationQuery(query: string): GroundedQueryResponse {
  const normalized = query.toLowerCase().trim();

  // 1. Where did the money go?
  if (
    normalized.includes('where') ||
    normalized.includes('money go') ||
    normalized.includes('destination') ||
    normalized.includes('flow')
  ) {
    return {
      content:
        `The initial $2,000 transfer from the victim was ingested by Suspect Wallet (${DEMO_WALLETS.suspect.address}) and distributed across three intermediary wallets: Wallet B received $800, Wallet C received $700, and Wallet D received $500. ` +
        `Approximately $700 subsequently crossed from Ethereum to Polygon through the simulated bridge event via Demo Bridge. Approximately $680 was then transferred toward the exchange-linked destination on Polygon (${DEMO_WALLETS.exchange.address}), while Wallet B forwarded $760 onward on Ethereum.`,
      evidenceRefs: ['TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-005', 'TX-DEMO-006', 'TX-DEMO-008', 'EVD-004', 'EVD-005'],
      suggestedAction: 'Focus on Cross-Chain and Exchange nodes in Graph',
      highlightNodes: ['suspect', 'walletB', 'walletC', 'bridge', 'polygonWallet', 'exchange'],
      highlightEdges: ['TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-005', 'TX-DEMO-006', 'TX-DEMO-008'],
    };
  }

  // 2. Why is this wallet suspicious?
  if (
    normalized.includes('why') ||
    normalized.includes('suspicious') ||
    normalized.includes('risk') ||
    normalized.includes('score')
  ) {
    return {
      content:
        `The suspect wallet (${DEMO_WALLETS.suspect.address}) carries a calculated Risk Score of 78/100 (HIGH). ` +
        `The primary risk drivers are: Rapid Movement (+22) due to emptying funds within 3 minutes; Fan-Out (+18) via automated 3-way dispersal to Wallets B, C, and D; ` +
        `Cross-Chain traversal (+15) via Demo Bridge; and direct interaction (+13) with a centralized exchange deposit hotwallet. Cluster association accounts for an additional +10 points.`,
      evidenceRefs: ['EVD-002', 'EVD-003', 'EVD-004', 'EVD-005', 'TX-DEMO-001', 'TX-DEMO-002'],
      suggestedAction: 'View Suspect Wallet Risk Breakdown in Intelligence Drawer',
      highlightNodes: ['suspect'],
      highlightEdges: ['TX-DEMO-001', 'TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-004'],
    };
  }

  // 3. Show the cross-chain movement
  if (
    normalized.includes('cross-chain') ||
    normalized.includes('cross chain') ||
    normalized.includes('bridge') ||
    normalized.includes('polygon')
  ) {
    return {
      content:
        `At 10:35:02 UTC, Wallet C deposited $700 USDT into Demo Bridge (${DEMO_CROSS_CHAIN_HOP.bridgeEntity}) on Ethereum. ` +
        `Following a 69-second validation interval, $698 net USDT was released at 10:36:11 UTC on Polygon POS to recipient ${DEMO_WALLETS.polygonWallet.address}. ` +
        `The cross-chain association confidence is 89%, based on cryptographic oracle and deposit/claim telemetry correlation.`,
      evidenceRefs: ['TX-DEMO-005', 'TX-DEMO-006', 'EVD-004'],
      suggestedAction: 'Switch to Cross-Chain View Tab',
      highlightNodes: ['walletC', 'bridge', 'polygonWallet'],
      highlightEdges: ['TX-DEMO-005', 'TX-DEMO-006'],
    };
  }

  // 4. Which wallet received the most?
  if (
    normalized.includes('most') ||
    normalized.includes('largest') ||
    normalized.includes('highest') ||
    normalized.includes('which wallet')
  ) {
    return {
      content:
        `Among the three immediate intermediary wallets, Wallet B (${DEMO_WALLETS.walletB.address}) received the highest allocation of $800 USDT (40.0% of the stolen funds), ` +
        `followed by Wallet C with $700 USDT (35.0%), and Wallet D with $500 USDT (25.0%). ` +
        `Wallet B subsequently transferred $760 onward within 4 minutes.`,
      evidenceRefs: ['TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-004', 'TX-DEMO-007', 'EVD-002'],
      suggestedAction: 'Inspect Wallet B in Transaction Graph',
      highlightNodes: ['suspect', 'walletB'],
      highlightEdges: ['TX-DEMO-002', 'TX-DEMO-007'],
    };
  }

  // 5. What patterns were detected?
  if (
    normalized.includes('pattern') ||
    normalized.includes('detection') ||
    normalized.includes('laundering') ||
    normalized.includes('detected')
  ) {
    const list = DEMO_DETECTIONS.map((d) => `• ${d.title} (${d.confidence}% confidence): ${d.description}`).join('\n');
    return {
      content:
        `MONOMER detected 5 distinct behavioral indicators in this investigation:\n\n${list}\n\nAll patterns indicate structured, non-retail obfuscation behavior.`,
      evidenceRefs: ['EVD-002', 'EVD-003', 'EVD-004', 'EVD-005', 'EVD-006'],
      suggestedAction: 'Review Detections tab to isolate individual patterns',
      highlightNodes: ['suspect', 'walletB', 'walletC', 'polygonWallet', 'exchange'],
      highlightEdges: ['TX-DEMO-002', 'TX-DEMO-005', 'TX-DEMO-007', 'TX-DEMO-008'],
    };
  }

  // 6. Summarize this investigation
  if (
    normalized.includes('summarize') ||
    normalized.includes('summary') ||
    normalized.includes('overview') ||
    normalized.includes('case')
  ) {
    return {
      content:
        `Case ${DEMO_CASE.caseId} ("${DEMO_CASE.caseName}") involves an initial theft of $2,000 USDT reported by victim ${DEMO_WALLETS.victim.address} at 10:31:04 UTC. ` +
        `Within 3 minutes, suspect wallet ${DEMO_WALLETS.suspect.address} executed a 3-way fan-out to Wallets B ($800), C ($700), and D ($500). ` +
        `Wallet C channeled $700 through Demo Bridge to Polygon, where $680 was routed into Demo Exchange hotwallet at 10:41:52 UTC. ` +
        `Overall case risk is rated HIGH (78/100), with urgent preservation recommended for the exchange deposit address.`,
      evidenceRefs: ['EVD-001', 'EVD-002', 'EVD-004', 'EVD-005', 'TX-DEMO-001', 'TX-DEMO-008'],
      suggestedAction: 'Generate Formal Investigation Report for Subpoena Preparation',
      highlightNodes: ['victim', 'suspect', 'walletB', 'walletC', 'bridge', 'polygonWallet', 'exchange'],
      highlightEdges: ['TX-DEMO-001', 'TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-005', 'TX-DEMO-006', 'TX-DEMO-008'],
    };
  }

  // Fallback for ungrounded or out-of-scope query
  return {
    content: "I don't have sufficient evidence in the current investigation dataset to answer that question.",
    evidenceRefs: [],
  };
}
