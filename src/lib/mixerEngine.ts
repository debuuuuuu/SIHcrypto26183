import { MixerInteraction, PrivacyProtocolType } from '@/types/investigation';

export const KNOWN_PRIVACY_POOLS = [
  {
    protocol: 'TORNADO_CASH' as PrivacyProtocolType,
    name: 'Tornado Cash: 100 USDT Pool',
    chain: 'Ethereum',
    address: '0x169AD27A470D064DEDE56A2D3FF727986B15D52B',
    denomination: '100 USDT',
  },
  {
    protocol: 'TORNADO_CASH' as PrivacyProtocolType,
    name: 'Tornado Cash: 1,000 USDT Pool',
    chain: 'Ethereum',
    address: '0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f',
    denomination: '1,000 USDT',
  },
  {
    protocol: 'RAILGUN' as PrivacyProtocolType,
    name: 'Railgun Privacy Contract',
    chain: 'Polygon',
    address: '0xFA7093CDD9EF603294163E824322B9CCE1D02080',
    denomination: 'Variable zk-SNARK',
  },
  {
    protocol: 'INSTANT_EXCHANGE' as PrivacyProtocolType,
    name: 'ChangeNOW Non-Custodial Bridge',
    chain: 'Cross-Chain',
    address: '0x077D360f11D220E4d5D831430c81C26c773E7379',
    denomination: 'Dynamic Swapper',
  },
];

export const DEMO_MIXER_RECORDS: MixerInteraction[] = [
  {
    id: 'MIX-TC-2026-001',
    protocol: 'TORNADO_CASH',
    poolName: 'Tornado Cash: 1,000 USDT Pool',
    chain: 'Ethereum',
    contractAddress: '0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f',
    depositTxHash: '0xd7a881920042bc19a8420194812401824a71920419240182410a8c41829104fa',
    withdrawalTxHash: '0x992410a810940182410a8c41829104fad7a881920042bc19a842019481240182',
    denomination: '1,000 USDT',
    anonymitySetSize: 6,
    deanonymizationConfidence: 87,
    relayerAddress: '0xRelayer99120481290381023a81',
    matchedHeuristics: [
      'Denomination match (1,000 USDT minus 0.3% protocol fee)',
      'Tight temporal correlation (Withdrawal executed 14 blocks after deposit)',
      'Relayer gas sponsorship linked to common operator wallet',
      'Low anonymity set size (n=6 active commitments in 1-hour window)',
    ],
    timeDeltaMinutes: 3.2,
    status: 'CORRELATED',
  },
  {
    id: 'MIX-RAIL-2026-002',
    protocol: 'RAILGUN',
    poolName: 'Railgun Shield Contract',
    chain: 'Polygon',
    contractAddress: '0xFA7093CDD9EF603294163E824322B9CCE1D02080',
    depositTxHash: '0x3301928401928401928401928401928401928401928401928401928401928401',
    denomination: '680 USDT (Shielded Transfer Attempt)',
    anonymitySetSize: 12,
    deanonymizationConfidence: 74,
    relayerAddress: '0xRailgunBroadcasterPolygon04',
    matchedHeuristics: [
      'Pre-deposit liquidity match ($680 USDT unshielding cadence)',
      'Destination polygon hotwallet interaction immediately following unshield',
    ],
    timeDeltaMinutes: 8.5,
    status: 'IDENTIFIED',
  },
];

/**
 * Returns de-anonymization analysis for privacy-enhancing protocols
 */
export function getMixerAnalysis() {
  return {
    totalProtocolsMonitored: KNOWN_PRIVACY_POOLS.length,
    activeInteractions: DEMO_MIXER_RECORDS.length,
    deanonymizedRate: '81% High Confidence',
    records: DEMO_MIXER_RECORDS,
    supportedMitigations: [
      'Denomination fingerprinting algorithm',
      'Relayer address cluster de-obfuscation',
      'Cross-block latency distribution analysis',
      'OFAC / FATF sanction compliance tagging',
    ],
  };
}
