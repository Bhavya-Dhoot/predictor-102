import { NextRequest, NextResponse } from 'next/server';

// Simulated notification endpoint (replace with real logic as needed)
export async function POST(req: NextRequest) {
  try {
    const { symbol, confidence } = await req.json();
    // Simulate sending a notification (in production, integrate with email/push/SMS)
    if (confidence > 90) {
      return NextResponse.json({ status: 'Notification sent', symbol, confidence });
    }
    return NextResponse.json({ status: 'No notification (confidence too low)', symbol, confidence });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
