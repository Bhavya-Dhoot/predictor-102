import { NextRequest, NextResponse } from 'next/server';
import { getPredictionLog } from '@/utils/predictionLog';

// Export all logged predictions as CSV
export async function GET() {
  try {
    const log = getPredictionLog();
    if (!log.length) {
      return NextResponse.json({ error: 'No predictions to export' }, { status: 404 });
    }
    // Build CSV
    const header = 'timestamp,symbol,Market Sentiment,Predicted Close,Confidence %,Up/Down,Magnitude,Short Reasoning,Upside Target,Timing,Data Timestamp\n';
    const csv =
      header +
      log
        .map(entry => {
          const p = entry.prediction || {};
          return [
            entry.timestamp,
            entry.symbol,
            p["Market Sentiment"] || '',
            p["Predicted Close"] || '',
            p["Confidence %"] || '',
            p["Up/Down"] || '',
            p["Magnitude"] || '',
            p["Short Reasoning"] ? `"${String(p["Short Reasoning"]).replace(/"/g, '""')}"` : '',
            p["Upside Target"] || '',
            p["Timing"] || '',
            p["Data Timestamp"] || ''
          ].join(',');
        })
        .join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="predictions_export.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// (Legacy POST export left for compatibility, but not used)
export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Use GET to export predictions.' }, { status: 405 });
}
