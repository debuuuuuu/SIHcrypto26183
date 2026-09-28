import { NextResponse } from 'next/server';
import { AIStatus } from '@/types/ai';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';

  const status: AIStatus = {
    mode: apiKey && apiKey.trim().length > 0 ? 'live' : 'demo',
    model,
    provider: apiKey ? 'openai' : 'local-deterministic',
  };

  return NextResponse.json(status);
}
