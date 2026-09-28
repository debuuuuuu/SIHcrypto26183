import { RiskAssessment, RiskSignal } from '@/types/investigation';
import { DEMO_RISK_ASSESSMENT } from '@/data/demoInvestigation';

export function getCaseRiskAssessment(): RiskAssessment {
  return DEMO_RISK_ASSESSMENT;
}

export function getWalletRiskAssessment(walletId: string): {
  score: number;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  signals: RiskSignal[];
  explanation: string;
} {
  if (walletId === 'suspect') {
    return {
      score: DEMO_RISK_ASSESSMENT.score,
      level: DEMO_RISK_ASSESSMENT.level,
      signals: DEMO_RISK_ASSESSMENT.signals,
      explanation: DEMO_RISK_ASSESSMENT.explanation,
    };
  }

  if (walletId === 'walletB') {
    return {
      score: 68,
      level: 'HIGH',
      signals: [
        {
          category: 'Rapid Movement',
          scoreContribution: 25,
          maxScore: 25,
          rationale: '95% of incoming funds forwarded within 4 minutes.',
          severity: 'high',
        },
        {
          category: 'Suspect Association',
          scoreContribution: 25,
          maxScore: 25,
          rationale: 'Direct recipient of suspect fan-out tranche ($800 USDT).',
          severity: 'high',
        },
        {
          category: 'Downstream Layering',
          scoreContribution: 18,
          maxScore: 25,
          rationale: 'Transferred funds onward to secondary intermediary account.',
          severity: 'medium',
        },
      ],
      explanation:
        'Wallet B acted as a high-velocity transit address, shedding $760 of $800 received from the suspect wallet almost immediately.',
    };
  }

  if (walletId === 'walletC') {
    return {
      score: 74,
      level: 'HIGH',
      signals: [
        {
          category: 'Bridge Ingestion',
          scoreContribution: 25,
          maxScore: 25,
          rationale: 'Submitted $700 USDT directly into cross-chain bridge contract.',
          severity: 'high',
        },
        {
          category: 'Suspect Association',
          scoreContribution: 25,
          maxScore: 25,
          rationale: 'Funded directly by suspect fan-out ($700 USDT).',
          severity: 'high',
        },
        {
          category: 'Cross-Chain Obfuscation',
          scoreContribution: 24,
          maxScore: 25,
          rationale: 'Exited Ethereum L1 boundary to avoid single-chain surveillance.',
          severity: 'high',
        },
      ],
      explanation:
        'Wallet C served as the bridge staging node, depositing suspect proceeds into a cross-chain gateway.',
    };
  }

  if (walletId === 'polygonWallet') {
    return {
      score: 72,
      level: 'HIGH',
      signals: [
        {
          category: 'Exchange Inflow',
          scoreContribution: 25,
          maxScore: 25,
          rationale: 'Direct transfer of $680 USDT to centralized exchange hotwallet.',
          severity: 'high',
        },
        {
          category: 'Cross-Chain Ingress',
          scoreContribution: 25,
          maxScore: 25,
          rationale: 'Received bridged assets directly from Ethereum liquidity bridge.',
          severity: 'high',
        },
        {
          category: 'Pre-Liquidation Transit',
          scoreContribution: 22,
          maxScore: 25,
          rationale: 'Short holding latency between bridge claim and exchange deposit.',
          severity: 'high',
        },
      ],
      explanation:
        'Polygon wallet received the bridged assets and promptly routed 97% to an exchange deposit hotwallet.',
    };
  }

  if (walletId === 'walletD') {
    return {
      score: 52,
      level: 'MEDIUM',
      signals: [
        {
          category: 'Suspect Association',
          scoreContribution: 30,
          maxScore: 40,
          rationale: 'Direct recipient of suspect fan-out tranche ($500 USDT).',
          severity: 'medium',
        },
        {
          category: 'Dormant Parking',
          scoreContribution: 22,
          maxScore: 30,
          rationale: 'Funds retained with zero immediate onward movement observed.',
          severity: 'medium',
        },
      ],
      explanation:
        'Wallet D received $500 from the suspect wallet and has retained the balance, possibly acting as a dormant reserve.',
    };
  }

  if (walletId === 'exchange') {
    return {
      score: 15,
      level: 'LOW',
      signals: [
        {
          category: 'Verified Entity',
          scoreContribution: 10,
          maxScore: 50,
          rationale: 'Identified regulated centralized exchange deposit pool.',
          severity: 'low',
        },
        {
          category: 'Contaminated Inflow',
          scoreContribution: 5,
          maxScore: 50,
          rationale: 'Received funds tied to investigated fraud flow.',
          severity: 'low',
        },
      ],
      explanation:
        'Identified commercial cryptocurrency exchange. Entity itself is not suspect; represents a critical subpoena/preservation target.',
    };
  }

  if (walletId === 'bridge') {
    return {
      score: 20,
      level: 'LOW',
      signals: [
        {
          category: 'Protocol Contract',
          scoreContribution: 10,
          maxScore: 50,
          rationale: 'Public decentralized liquidity bridge smart contract.',
          severity: 'low',
        },
        {
          category: 'Transit Gateway',
          scoreContribution: 10,
          maxScore: 50,
          rationale: 'Utilized by actor to traverse from Ethereum to Polygon.',
          severity: 'low',
        },
      ],
      explanation:
        'Cross-chain liquidity bridge smart contract. Autonomous infrastructure leveraged by actor for network traversal.',
    };
  }

  // Victim or default
  return {
    score: 5,
    level: 'LOW',
    signals: [
      {
        category: 'Originating Account',
        scoreContribution: 5,
        maxScore: 100,
        rationale: 'Reporting victim account with verified complaint filed.',
        severity: 'low',
      },
    ],
    explanation: 'Reporting victim account that originated the initial $2,000 fraud transfer.',
  };
}
