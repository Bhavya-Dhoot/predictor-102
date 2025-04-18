import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

const CACHE_TTL = parseInt(process.env.CACHE_TTL || '60', 10);

// In-memory cache for serverless (per instance)
const cache: Record<string, { data: any; expires: number }> = {};

function buildCacheKey(symbol: string, range: string) {
  return `history_${symbol}_${range}`;
}

// Helper to get date strings for Yahoo Finance
function getDateStr(date: Date) {
  return date.toISOString().slice(0, 10);
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

  try {
    // Yahoo Finance expects '^NSEI' for Nifty 50, '^GSPC' for S&P 500, etc.
    const queryOpts = {
      period1: start,
      period2: end,
      interval: '1d',
    };
    const result = await yahooFinance.historical(symbol, queryOpts);
    if (!result || result.length === 0) {
      throw new Error('No historical data found');
    }
    // Convert to OHLCV arrays
    const t: number[] = [], c: number[] = [], o: number[] = [], h: number[] = [], l: number[] = [], v: number[] = [];
    for (const row of result) {
      if (row.date) {
        t.push(Math.floor(new Date(row.date).getTime() / 1000));
        o.push(row.open ?? null);
        h.push(row.high ?? null);
        l.push(row.low ?? null);
        c.push(row.close ?? null);
        v.push(row.volume ?? null);
      }
    }
    // Sort by ascending time
    const zipped = t.map((tz, i) => ({ t: tz, c: c[i], o: o[i], h: h[i], l: l[i], v: v[i] }));
    zipped.sort((a, b) => a.t - b.t);
    const sorted = { t: zipped.map(z => z.t), c: zipped.map(z => z.c), o: zipped.map(z => z.o), h: zipped.map(z => z.h), l: zipped.map(z => z.l), v: zipped.map(z => z.v) };
    const response = { s: sorted.t.length > 0 ? 'ok' : 'no_data', ...sorted };
    cache[cacheKey] = { data: response, expires: now + CACHE_TTL * 1000 };
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
