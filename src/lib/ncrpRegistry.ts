import { InvestigationCase } from '@/types/investigation';

export interface NcrpComplaintRecord {
  ackNumber: string;
  sahyogTicketId: string;
  complainantName: string;
  policeStationJurisdiction: string;
  state: string;
  firOrGdNumber: string;
  incidentDate: string;
  reportedDate: string;
  crimeSubCategory: string;
  lossAmountUSD: number;
  lossAmountINR: string;
  targetAddress: string;
  targetChain: 'Ethereum' | 'Polygon' | 'Arbitrum' | 'Bitcoin' | 'Solana';
  briefModusOperandi: string;
  sahyogStatus: 'SYNCED' | 'NOTICE_SERVED' | 'FREEZE_REQUESTED' | 'COMPLETED';
  priorityLevel: 'P0_CRITICAL' | 'P1_HIGH' | 'P2_MEDIUM';
}

export const NCRP_PRESET_COMPLAINTS: NcrpComplaintRecord[] = [
  {
    ackNumber: '2026/NCRP/MH/09128',
    sahyogTicketId: 'I4C-SYG-2026-98124',
    complainantName: 'Rajesh K. Sharma',
    policeStationJurisdiction: 'Cyber Crime Police Station, BKC, Mumbai',
    state: 'Maharashtra',
    firOrGdNumber: 'FIR No. 142/2026 U/S 66D IT Act & 420 IPC',
    incidentDate: '2026-09-21 15:45 IST',
    reportedDate: '2026-09-21 16:10 IST',
    crimeSubCategory: 'Phishing Contract / Cryptocurrency Investment Fraud',
    lossAmountUSD: 2000,
    lossAmountINR: '₹ 1,74,500',
    targetAddress: '0x7A92d044e1837bF2D',
    targetChain: 'Ethereum',
    briefModusOperandi:
      'Victim deceived via simulated Web3 trading bot phishing portal into transferring $2,000 USDT to suspect burner wallet. Funds were layered through intermediary nodes within minutes.',
    sahyogStatus: 'FREEZE_REQUESTED',
    priorityLevel: 'P0_CRITICAL',
  },
  {
    ackNumber: '2026/NCRP/KA/44812',
    sahyogTicketId: 'I4C-SYG-2026-77319',
    complainantName: 'Ananya Hegde',
    policeStationJurisdiction: 'Cyber Economics & Narcotics (CEN) PS, Bengaluru Urban',
    state: 'Karnataka',
    firOrGdNumber: 'FIR No. 89/2026 U/S 66C/66D IT Act',
    incidentDate: '2026-09-20 11:20 IST',
    reportedDate: '2026-09-20 13:00 IST',
    crimeSubCategory: 'Telegram Task-Based Job Fraud & Fake Crypto Liquidity Pool',
    lossAmountUSD: 4500,
    lossAmountINR: '₹ 3,92,600',
    targetAddress: '0x3F88a1b6329B4d48E981e59273c52aD07aB3C08',
    targetChain: 'Polygon',
    briefModusOperandi:
      'Victim instructed to deposit crypto tokens into a high-yield task portal, subsequently funneled through decentralized liquidity aggregators and automated bridges.',
    sahyogStatus: 'SYNCED',
    priorityLevel: 'P0_CRITICAL',
  },
  {
    ackNumber: '2026/NCRP/DL/77201',
    sahyogTicketId: 'I4C-SYG-2026-61042',
    complainantName: 'Vikrant Malhotra',
    policeStationJurisdiction: 'IFSO Special Cell, Dwarka, New Delhi',
    state: 'Delhi NCR',
    firOrGdNumber: 'GD Entry No. 42A / Special Cell',
    incidentDate: '2026-09-18 19:15 IST',
    reportedDate: '2026-09-18 20:30 IST',
    crimeSubCategory: 'Digital Arrest & Sextortion Extortion via Crypto Demand',
    lossAmountUSD: 3100,
    lossAmountINR: '₹ 2,70,500',
    targetAddress: '0x9180ab5c328901ae47B78a1098802938472910fa',
    targetChain: 'Ethereum',
    briefModusOperandi:
      'Coercive extortion scheme impersonating federal law enforcement. Fraudster demanded instant crypto transfer to non-custodial address followed by mixer hops.',
    sahyogStatus: 'NOTICE_SERVED',
    priorityLevel: 'P1_HIGH',
  },
];

/**
 * Resolves or hydrates an InvestigationCase with NCRP / SAHYOG metadata
 */
export function hydrateCaseWithNcrp(
  baseCase: InvestigationCase,
  complaintAck?: string
): InvestigationCase {
  const complaint =
    NCRP_PRESET_COMPLAINTS.find((c) => c.ackNumber === complaintAck) ||
    NCRP_PRESET_COMPLAINTS[0];

  return {
    ...baseCase,
    ncrpAckNumber: complaint.ackNumber,
    sahyogTicketId: complaint.sahyogTicketId,
    complainantName: complaint.complainantName,
    policeStationJurisdiction: complaint.policeStationJurisdiction,
    firOrGdNumber: complaint.firOrGdNumber,
    reportingPortal: 'NCRP',
    sahyogStatus: complaint.sahyogStatus,
    crimeSubCategory: complaint.crimeSubCategory,
    jurisdiction: `${complaint.policeStationJurisdiction} (${complaint.state})`,
    reportingVictim: complaint.complainantName,
  };
}
