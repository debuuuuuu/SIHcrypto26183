import { NextResponse } from 'next/server';
import { sql, isNeonConfigured } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isNeonConfigured || !sql) {
    return NextResponse.json({
      connected: false,
      message: 'Neon Postgres DATABASE_URL is not configured yet.',
      suggestion:
        'Create a Neon database in Vercel Storage or set DATABASE_URL in .env.local',
    });
  }

  try {
    const [{ count: caseCount }] = await sql`SELECT count(*) FROM cases;`;
    const [{ count: walletCount }] = await sql`SELECT count(*) FROM wallets;`;
    const [{ count: txCount }] = await sql`SELECT count(*) FROM transactions;`;
    const [{ count: evidenceCount }] =
      await sql`SELECT count(*) FROM evidence_records;`;

    return NextResponse.json({
      connected: true,
      provider: 'Neon Serverless Postgres',
      tables: {
        cases: Number(caseCount),
        wallets: Number(walletCount),
        transactions: Number(txCount),
        evidenceRecords: Number(evidenceCount),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        connected: false,
        error: error.message || 'Failed to query Neon Postgres',
      },
      { status: 500 }
    );
  }
}
