import { InvestigationAlert } from '@/types/investigation';

export const INITIAL_ALERTS: InvestigationAlert[] = [
  {
    id: 'ALT-2026-001',
    timestamp: '10:41:52 UTC',
    severity: 'critical',
    category: 'VASP_DEPOSIT',
    title: 'VASP Off-Ramp Ingress Detected',
    message:
      'Bridged funds of $680 USDT reached Demo Exchange CEX Hotwallet (0xEXCH...401) on Polygon. Actionable point for immediate KYC preservation and asset freeze.',
    targetEntityId: 'exchange',
    targetTxId: 'TX-DEMO-008',
    actionLabel: 'Serve Subpoena / Freeze Notice',
    actionType: 'FREEZE_NOTICE',
    dispatchedToLea: true,
    read: false,
  },
  {
    id: 'ALT-2026-002',
    timestamp: '10:35:50 UTC',
    severity: 'high',
    category: 'BRIDGE_EGRESS',
    title: 'Cross-Chain Bridge Traversal',
    message:
      'Wallet C routed $700 USDT through Demo Bridge contract to Polygon recipient 0x98EF... Bridge latency: 48 seconds.',
    targetEntityId: 'bridge',
    targetTxId: 'TX-DEMO-005',
    actionLabel: 'Inspect Bridge Telemetry',
    actionType: 'FOCUS_NODE',
    dispatchedToLea: true,
    read: false,
  },
  {
    id: 'ALT-2026-003',
    timestamp: '10:33:41 UTC',
    severity: 'high',
    category: 'RAPID_LAYERING',
    title: 'High-Velocity Dispersal (< 24s)',
    message:
      'Suspect wallet 0x7A92... distributed $2,000 across 3 intermediary addresses (Wallets B, C, D) in 24 seconds to evade exchange automated screening.',
    targetEntityId: 'suspect',
    targetTxId: 'TX-DEMO-002',
    actionLabel: 'View Dispersal Nodes',
    actionType: 'FOCUS_NODE',
    dispatchedToLea: true,
    read: true,
  },
  {
    id: 'ALT-2026-004',
    timestamp: '10:31:04 UTC',
    severity: 'critical',
    category: 'SAHYOG_AUTO_FREEZE',
    title: 'SAHYOG Auto-Coordination Initiated',
    message:
      'Complaint linked with NCRP Ack 2026/NCRP/MH/09128. I4C SAHYOG ticket I4C-SYG-2026-98124 generated for VASP Nodal Officer dispatch.',
    targetEntityId: 'victim',
    actionLabel: 'Open Formal Legal Report',
    actionType: 'OPEN_REPORT',
    dispatchedToLea: true,
    read: false,
  },
  {
    id: 'ALT-2026-005',
    timestamp: '10:45:00 UTC',
    severity: 'medium',
    category: 'MIXER_TOUCH',
    title: 'Privacy Protocol De-Anonymization Alert',
    message:
      'Equal-denomination fingerprinting correlated secondary relayer interaction with 87% confidence (Anonymity set size n=6).',
    targetEntityId: 'walletC',
    actionLabel: 'Review De-anonymization Proof',
    actionType: 'FOCUS_NODE',
    dispatchedToLea: false,
    read: false,
  },
];

export function getAlerts(): InvestigationAlert[] {
  return INITIAL_ALERTS;
}
