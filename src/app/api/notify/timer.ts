import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Set up nodemailer transporter (for demo: use Gmail SMTP, but recommend using env vars and OAuth2 in prod)
const EMAIL_USER = process.env.SMTP_USER || 'dhoot.bhavya1@gmail.com';
const EMAIL_PASS = process.env.SMTP_PASS || '';
const EMAIL_TO = 'dhoot.bhavya1@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const { timerMinutes } = await req.json();
    if (!timerMinutes || isNaN(timerMinutes) || timerMinutes <= 0) {
      return NextResponse.json({ error: 'Invalid timer value' }, { status: 400 });
    }
    // Wait for the specified time, then send email (simulate with setTimeout)
    setTimeout(async () => {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: EMAIL_USER, pass: EMAIL_PASS },
        });
        await transporter.sendMail({
          from: EMAIL_USER,
          to: EMAIL_TO,
          subject: 'Predictor 101 Activity Timer Hit',
          text: `The activity timer you set (${timerMinutes} minutes) has been reached.`,
        });
      } catch (e) {
        // Log error but don't respond (timer is async)
        console.error('Failed to send email:', e);
      }
    }, timerMinutes * 60 * 1000);
    return NextResponse.json({ status: `Timer set for ${timerMinutes} minute(s). Email will be sent to ${EMAIL_TO}.` });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
