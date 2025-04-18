import { NextRequest, NextResponse } from 'next/server';

const FINNHUB_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.FINANCE_API_KEY;
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '60', 10);

// In-memory cache for serverless (per instance)
const cache: Record<string, { data: any; expires: number }> = {};

function buildCacheKey(symbol: string, range: string) {
  return `history_${symbol}_${range}`;
}

// Helper to get UNIX timestamps for Finnhub
function getUnixTime(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol') || 'SPY';
  const range = searchParams.get('range') || '1mo'; // 1mo, 3mo, 6mo, 1y, etc.
  const cacheKey = buildCacheKey(symbol, range);
  const now = Date.now();

  if (cache[cacheKey] && cache[cacheKey].expires > now) {
    return NextResponse.json(cache[cacheKey].data);
  }

  // Calculate date range
  const end = new Date();
  let start = new Date();
  if (range === '1mo') start.setMonth(end.getMonth() - 1);
  else if (range === '3mo') start.setMonth(end.getMonth() - 3);
  else if (range === '6mo') start.setMonth(end.getMonth() - 6);
  else if (range === '1y') start.setFullYear(end.getFullYear() - 1);
  else start.setMonth(end.getMonth() - 1);

  const from = getUnixTime(start);
  const to = getUnixTime(end);

  try {
    const res = await fetch(`${FINNHUB_URL}/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch historical data');
    const data = await res.json();
    cache[cacheKey] = { data, expires: now + CACHE_TTL * 1000 };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
