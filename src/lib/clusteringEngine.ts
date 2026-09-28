import { VaspEntity, VaspCluster } from '@/types/investigation';

export const KNOWN_VASPS: Record<string, VaspEntity> = {
  coindcx: {
    id: 'coindcx',
    name: 'CoinDCX (Neblio Technologies Pvt Ltd)',
    shortName: 'CoinDCX',
    logoText: 'DCX',
    jurisdiction: 'India (Mumbai, Maharashtra)',
    fiuIndRegistered: true,
    complianceRating: 'A',
    nodalEmail: 'law-enforcement@coindcx.com',
    emergencyPortalUrl: 'https://coindcx.com/legal/law-enforcement',
    clusterCount: 4280,
    totalVolumeTrackedUSDT: '$48,200,000',
    knownDepositPatterns: ['Consolidated batch sweep', 'Predictable forwarder contracts'],
  },
  wazirx: {
    id: 'wazirx',
    name: 'WazirX (Zanmai Labs Pvt Ltd)',
    shortName: 'WazirX',
    logoText: 'WRX',
    jurisdiction: 'India (Mumbai, Maharashtra)',
    fiuIndRegistered: true,
    complianceRating: 'B',
    nodalEmail: 'nodalofficer@wazirx.com',
    emergencyPortalUrl: 'https://wazirx.com/law-enforcement-request',
    clusterCount: 3120,
    totalVolumeTrackedUSDT: '$21,400,000',
    knownDepositPatterns: ['Shared gas dispatching hotwallets', 'Multi-sig treasury sweeps'],
  },
  binance: {
    id: 'binance',
    name: 'Binance Holdings Ltd',
    shortName: 'Binance',
    logoText: 'BNB',
    jurisdiction: 'Global / FIU-IND Registered Entity',
    fiuIndRegistered: true,
    complianceRating: 'A',
    nodalEmail: 'in-law-enforcement@binance.com',
    emergencyPortalUrl: 'https://kodexglobal.com/binance',
    clusterCount: 148500,
    totalVolumeTrackedUSDT: '$890,000,000',
    knownDepositPatterns: ['Omnibus hotwallet sweep', 'Binance 14, 15, 16 pool aggregation'],
  },
  coinswitch: {
    id: 'coinswitch',
    name: 'CoinSwitch Kuber (Bitcipher Labs LLP)',
    shortName: 'CoinSwitch',
    logoText: 'CSW',
    jurisdiction: 'India (Bengaluru, Karnataka)',
    fiuIndRegistered: true,
    complianceRating: 'A',
    nodalEmail: 'compliance@coinswitch.co',
    emergencyPortalUrl: 'https://coinswitch.co/compliance',
    clusterCount: 1950,
    totalVolumeTrackedUSDT: '$16,800,000',
    knownDepositPatterns: ['Deterministic create2 deposit addresses'],
  },
  demo_exchange: {
    id: 'demo_exchange',
    name: 'Demo Centralized Exchange (CEX Hotwallet Pool)',
    shortName: 'Demo Exchange',
    logoText: 'CEX',
    jurisdiction: 'Simulated Regulated Entity / FIU-IND Compliant',
    fiuIndRegistered: true,
    complianceRating: 'A',
    nodalEmail: 'nodal-subpoena@demo-vasp-compliance.in',
    emergencyPortalUrl: 'https://sahyog.gov.in/vasp/demo-exchange/freeze',
    clusterCount: 1240,
    totalVolumeTrackedUSDT: '$3,400,000',
    knownDepositPatterns: ['Direct customer deposit hotwallet', 'Automated omnibus liquidity pool'],
  },
};

export const INVESTIGATION_CLUSTERS: VaspCluster[] = [
  {
    clusterId: 'CLS-VASP-POLYGON-001',
    vaspId: 'demo_exchange',
    vaspName: 'Demo Exchange',
    rootAddress: '0xEXCH9912048201a401',
    associatedAddresses: [
      '0xEXCH9912048201a401',
      '0x98EF7712a04812fB8',
      '0xEXCH_SWEEP_POOL_02',
    ],
    confidence: 96,
    heuristicUsed: 'SWEEP_CONSOLIDATION',
    totalVolumeUSD: 680,
    lastActive: '2026-09-21 10:41:52 UTC',
  },
  {
    clusterId: 'CLS-DISPERSAL-ETH-002',
    vaspId: 'suspect_cluster',
    vaspName: 'Suspect Burner Dispersal Cluster',
    rootAddress: '0x7A92d044e1837bF2D',
    associatedAddresses: [
      '0x7A92d044e1837bF2D',
      '0x82BC9910a3746c41A',
      '0x19DEf4028b489a7C2',
      '0x44AF7039274c3991B',
    ],
    confidence: 91,
    heuristicUsed: 'GAS_SPONSOR',
    totalVolumeUSD: 2000,
    lastActive: '2026-09-21 10:33:41 UTC',
  },
];

/**
 * Evaluates whether an address belongs to a known VASP or cluster
 */
export function identifyVaspEntity(addressOrLabel: string): VaspEntity | null {
  const norm = addressOrLabel.toLowerCase();

  if (norm.includes('exch') || norm.includes('exchange') || norm === 'exchange') {
    return KNOWN_VASPS.demo_exchange;
  }
  if (norm.includes('binance') || norm.includes('bnb')) {
    return KNOWN_VASPS.binance;
  }
  if (norm.includes('coindcx') || norm.includes('dcx')) {
    return KNOWN_VASPS.coindcx;
  }
  if (norm.includes('wazirx')) {
    return KNOWN_VASPS.wazirx;
  }
  if (norm.includes('coinswitch')) {
    return KNOWN_VASPS.coinswitch;
  }

  return null;
}

/**
 * Returns cluster attribution details for a specific wallet node
 */
export function getWalletClusteringDetails(walletId: string) {
  if (walletId === 'exchange' || walletId === 'polygonWallet') {
    return {
      clusterId: 'CLS-VASP-POLYGON-001',
      entityName: 'Demo Exchange CEX Hotwallet Pool',
      isVasp: true,
      vaspDetails: KNOWN_VASPS.demo_exchange,
      heuristic: 'Consolidated Deposit Sweep (100% funds swept to exchange hotwallet)',
      confidence: 96,
      actionRequired: 'Issue Section 91 CrPC / BNSS Notice for KYC & UID freezing',
    };
  }

  if (['suspect', 'walletB', 'walletC', 'walletD'].includes(walletId)) {
    return {
      clusterId: 'CLS-DISPERSAL-ETH-002',
      entityName: 'Syndicate Layering Cluster',
      isVasp: false,
      heuristic: 'Common Gas Funding Origin & Temporal Nonce Burst (<24s delta)',
      confidence: 91,
      actionRequired: 'Correlate with central cybercrime intelligence syndicates',
    };
  }

  return {
    clusterId: 'CLS-UNASSIGNED',
    entityName: 'Isolated Entity',
    isVasp: false,
    heuristic: 'No co-spending or sweep pattern detected',
    confidence: 20,
    actionRequired: 'Continuous mempool monitoring',
  };
}
