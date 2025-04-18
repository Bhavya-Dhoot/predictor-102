import { NextRequest, NextResponse } from 'next/server';

// Simulated backtesting endpoint (replace with real logic as needed)
export async function POST(req: NextRequest) {
  try {
    const { symbol, days } = await req.json();
    // Simulate backtest results
    const results = Array.from({ length: days || 10 }, (_, i) => ({
      date: `Day ${i + 1}`,
      predicted: Math.random() * 100 + 20000,
      actual: Math.random() * 100 + 20000,
      accuracy: Math.round(Math.random() * 10 + 85),
    }));
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
