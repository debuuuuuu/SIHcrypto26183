import { neon } from '@neondatabase/serverless';

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

export const sql = connectionString ? neon(connectionString) : null;

export const isNeonConfigured = Boolean(connectionString);

/**
 * Fetch case data from Neon if configured, otherwise returns null
 */
export async function getCaseFromDb(caseId: string = 'INV-DEMO-2026-001') {
  if (!sql) return null;
  try {
    const rows = await sql`SELECT * FROM cases WHERE case_id = ${caseId} LIMIT 1`;
    return rows[0] || null;
  } catch (error) {
    console.error('Failed to query case from Neon:', error);
    return null;
  }
}

/**
 * Fetch all wallets from Neon
 */
export async function getWalletsFromDb() {
  if (!sql) return null;
  try {
    const rows = await sql`SELECT * FROM wallets`;
    return rows;
  } catch (error) {
    console.error('Failed to query wallets from Neon:', error);
    return null;
  }
}

/**
 * Fetch all transactions from Neon
 */
export async function getTransactionsFromDb() {
  if (!sql) return null;
  try {
    const rows = await sql`SELECT * FROM transactions ORDER BY hop_index ASC`;
    return rows;
  } catch (error) {
    console.error('Failed to query transactions from Neon:', error);
    return null;
  }
}
