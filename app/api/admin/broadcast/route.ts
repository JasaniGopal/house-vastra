import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

export async function POST(req: Request) {
  try {
    const { subject, message, passcode, imageUrl } = await req.json();

    // Simple security check to prevent unauthorized blasts
    if (passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    // Fetch all active subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true }
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No active subscribers found" }, { status: 200 });
    }

    // Map to array of emails
    const emails = subscribers.map((s: { email: string }) => s.email);

    // Blast the emails using Resend (Bcc to hide other recipients)
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'LOR Inner Circle <newsletter@lookonrent.com>',
      to: ['newsletter@lookonrent.com'], // Sent to self
      bcc: emails, // BCC everyone else
      subject: subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #001410; max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">${subject}</h1>
          ${imageUrl ? `<img src="${imageUrl}" alt="Newsletter Poster" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 20px; display: block;" />` : ''}
          <div style="font-size: 16px; line-height: 1.5; color: #414846;">
            ${message.replace(/\n/g, '<br />')}
          </div>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 40px 0;" />
          <p style="font-size: 12px; color: #999;">
            You are receiving this because you subscribed to the LOR Inner Circle.
          </p>
        </div>
      `
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      message: `Successfully sent to ${emails.length} subscribers!`, 
      data 
    }, { status: 200 });

  } catch (error) {
    console.error("Broadcast error:", error);
    return NextResponse.json({ error: "Failed to send broadcast" }, { status: 500 });
  }
}
