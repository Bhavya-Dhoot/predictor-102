import { NextRequest, NextResponse } from 'next/server';

const FINNHUB_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.FINANCE_API_KEY;
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '60', 10);

// In-memory cache for serverless (per instance)
const cache: Record<string, { data: any; expires: number }> = {};

function buildCacheKey(symbol: string) {
  return `market_${symbol}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol') || 'SPY';
  const cacheKey = buildCacheKey(symbol);
  const now = Date.now();

  // Serve from cache if available
  if (cache[cacheKey] && cache[cacheKey].expires > now) {
    return NextResponse.json(cache[cacheKey].data);
  }

  // Fetch from Finnhub
  try {
    const res = await fetch(`${FINNHUB_URL}/quote?symbol=${symbol}&token=${API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch market data');
    const data = await res.json();
    cache[cacheKey] = { data, expires: now + CACHE_TTL * 1000 };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
