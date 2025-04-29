import { NextRequest, NextResponse } from 'next/server';
import { addPredictionLog } from '@/utils/predictionLog';

// Use Gemini 2.0 Flash model with v1beta endpoint as per user request
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const HISTORY_RANGES = ['1y', '6mo', '3mo', '1mo'];

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set.');
    }
    const { symbol, current } = await req.json();

    // Use absolute URL for local API route when running in server context
    // On Vercel/production, use the deployed URL from Vercel env vars
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
    }

    // Enhanced runtime check for base URL
    if (!baseUrl || baseUrl === 'http://localhost:3000') {
      throw new Error('NEXT_PUBLIC_BASE_URL is not set. Please set this environment variable to the deployed URL (e.g., https://your-app.vercel.app) for production.');
    }

    let historical = [];
    let usedRange = '1y';
    let latestTimestamp = null;
    for (const range of HISTORY_RANGES) {
      const historyRes = await fetch(`${baseUrl}/api/market/history?symbol=${encodeURIComponent(symbol)}&range=${range}`);
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        if (historyData.s === 'ok' && Array.isArray(historyData.t) && historyData.t.length > 0) {
          historical = historyData.t.map((t: number, i: number) => ({
            date: new Date(t * 1000).toISOString().slice(0, 10),
            close: historyData.c[i],
            open: historyData.o[i],
            high: historyData.h[i],
            low: historyData.l[i],
            volume: historyData.v[i],
          }));
          usedRange = range;
          latestTimestamp = historyData.t[historyData.t.length - 1];
          break;
        }
      }
    }

    // Compose prompt for Gemini, instructing it to:
    // 1. Analyze the available historical data (up to 1 year)
    // 2. Weigh current market sentiment and upcoming expected results
    // 3. Consider possible policy changes
    // 4. Give a cumulative rating with the important information block at the top
    // 5. Output the summary block in JSON format with the following keys:
    //    Market Sentiment, Predicted Close, Confidence %, Up/Down, Magnitude, Short Reasoning, Upside Target, Timing, Data Timestamp
    const prompt = `You are an advanced financial analyst AI. Given the following historical daily OHLCV data (up to ${usedRange}) and current market conditions for ${symbol}, do the following:\n\n1. Analyze historical trends, volatility, patterns\n2. Assess current sentiment, upcoming events\n3. Consider policy impacts (monetary, fiscal, regulatory)\n4. Rate and summarize prediction\n\nReturn this JSON first:\n{\n  \"Market Sentiment\": \"...\",\n  \"Predicted Close\": \"...\",\n  \"Confidence %\": \"...\",\n  \"Up/Down\": \"...\",\n  \"Magnitude\": \"...\",\n  \"Short Reasoning\": \"...\",\n  \"Upside Target\": \"...\",\n  \"Timing\": \"...\",\n  \"Data Timestamp\": \"${new Date(latestTimestamp * 1000).toISOString().slice(0, 10)}\"\n}\n\nThen analyze:\n- Technical factors (key levels, indicators, patterns)\n- Fundamental context (earnings, sector trends)\n- Market environment (sentiment, macro factors)\n- Risk assessment (potential downside scenarios)\n- Strategy suggestion (entry, exit, risk management)\n\nData:\nHistorical: ${JSON.stringify(historical)}\nCurrent: ${JSON.stringify(current)}\n\nBe specific about how each factor impacts your prediction.`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };
    const geminiRes = await fetch(GEMINI_URL + `?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!geminiRes.ok) {
      const text = await geminiRes.text();
      throw new Error(`Gemini API error: ${geminiRes.status} ${text}`);
    }
    const geminiData = await geminiRes.json();
    const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract JSON block from model response
    let predictionJson = null;
    const match = responseText.match(/\{[\s\S]*?\}/);
    if (match) {
      try {
        predictionJson = JSON.parse(match[0]);
      } catch {}
    }
    // Log prediction
    addPredictionLog({
      timestamp: new Date().toISOString(),
      symbol,
      prediction: predictionJson || responseText,
    });

    return NextResponse.json({ result: responseText });
  } catch (error) {
    console.error('Prediction API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
