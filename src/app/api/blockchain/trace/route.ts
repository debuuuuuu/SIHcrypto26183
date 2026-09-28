import { NextRequest, NextResponse } from 'next/server';
import { traceAddressLive, SUPPORTED_CHAINS } from '@/lib/blockchainIndexer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, chain = 'Ethereum', maxTransactions = 8 } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required.' },
        { status: 400 }
      );
    }

    const result = await traceAddressLive(address, chain, maxTransactions);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error while tracing address.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    supportedChains: Object.keys(SUPPORTED_CHAINS),
    timestamp: new Date().toISOString(),
  });
}
