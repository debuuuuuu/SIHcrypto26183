import { NextRequest, NextResponse } from 'next/server';
import { NCRP_PRESET_COMPLAINTS } from '@/lib/ncrpRegistry';

export async function POST(req: NextRequest) {
  try {
    const complaint = await req.json();

    if (!complaint.targetAddress || !complaint.ackNumber) {
      return NextResponse.json(
        { error: 'Missing mandatory fields: ackNumber and targetAddress are required.' },
        { status: 400 }
      );
    }

    const caseRecord = {
      caseId: `INV-${complaint.ackNumber.replace(/[^A-Za-z0-9]/g, '-')}`,
      caseName: `Operation ${complaint.complainantName ? complaint.complainantName.split(' ')[0] : 'Swift'} Shield`,
      targetAddress: complaint.targetAddress,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      status: 'AUTO-INGESTED FROM NCRP',
      chains: [complaint.targetChain || 'Ethereum'],
      totalValue: complaint.lossAmountUSD || 2000,
      transactionCount: 8,
      walletCount: 9,
      riskScore: 82,
      classification: complaint.crimeSubCategory || 'Cyber Financial Fraud',
      reportingVictim: complaint.complainantName || 'NCRP Anonymous Complainant',
      jurisdiction: complaint.policeStationJurisdiction || 'Central Cyber Crime Police Station',
      ncrpAckNumber: complaint.ackNumber,
      sahyogTicketId: complaint.sahyogTicketId || `I4C-SYG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      complainantName: complaint.complainantName,
      policeStationJurisdiction: complaint.policeStationJurisdiction,
      firOrGdNumber: complaint.firOrGdNumber,
      reportingPortal: 'NCRP' as const,
      sahyogStatus: 'FREEZE_REQUESTED' as const,
      crimeSubCategory: complaint.crimeSubCategory,
    };

    return NextResponse.json({
      success: true,
      message: 'Complaint successfully ingested from NCRP portal.',
      caseRecord,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to ingest NCRP complaint.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    portal: 'National Cybercrime Reporting Portal (NCRP) API Gateway',
    version: '2.4.0',
    sahyogSync: 'CONNECTED',
    pendingComplaintsCount: NCRP_PRESET_COMPLAINTS.length,
    complaints: NCRP_PRESET_COMPLAINTS,
  });
}
