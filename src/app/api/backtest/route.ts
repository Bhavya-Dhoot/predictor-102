import { NextRequest, NextResponse } from 'next/server';

// Proper backtesting endpoint using historical data
export async function POST(req: NextRequest) {
  try {
    const { symbol, days } = await req.json();
    if (!symbol || !days || days < 2) {
      return NextResponse.json({ error: 'Missing or invalid symbol/days' }, { status: 400 });
    }
    // Fetch historical data for the symbol (up to 1 year)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const historyRes = await fetch(`${baseUrl}/api/market/history?symbol=${encodeURIComponent(symbol)}&range=1y`);
    if (!historyRes.ok) {
      const err = await historyRes.text();
      return NextResponse.json({ error: `Failed to fetch historical data: ${err}` }, { status: 500 });
    }
    const history = await historyRes.json();
    if (!history || !history.t || history.t.length < days) {
      return NextResponse.json({ error: 'Not enough data for backtest' }, { status: 400 });
    }
    // Run backtest: for each day in the last N days, pretend we "predict" the next day's close using a naive strategy (e.g., previous day's close)
    const results = [];
    for (let i = history.c.length - days; i < history.c.length - 1; i++) {
      const date = new Date(history.t[i + 1] * 1000).toISOString().slice(0, 10);
      const predicted = history.c[i]; // naive prediction: yesterday's close
      const actual = history.c[i + 1]; // actual next day's close
      const error = actual - predicted;
      const percentError = (error / predicted) * 100;
      results.push({ date, predicted, actual, error, percentError });
    }
    // Compute summary stats
    const mae = results.reduce((acc, r) => acc + Math.abs(r.error), 0) / results.length;
    const mape = results.reduce((acc, r) => acc + Math.abs(r.percentError), 0) / results.length;
    return NextResponse.json({
      results,
      summary: {
        mae: Number(mae.toFixed(4)),
        mape: Number(mape.toFixed(4)),
        total: results.length,
        symbol,
        days
      }
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
