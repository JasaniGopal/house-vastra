import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // We expect { identifier, phone, type } 
    const body = await req.json();
    const identifier = body.identifier || body.email;
    const phone = body.phone;
    const type = body.type || "login"; // "login" or "register"

    if (!identifier) {
      return NextResponse.json({ error: "Email or phone number is required" }, { status: 400 });
    }

    const isEmail = identifier.includes("@");
    
    if (!isEmail) {
      // Validate phone number (assuming 10 digits)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(identifier)) {
        return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
      }
    }

    // Check if user exists by email OR phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      },
    });

    if (type === "register") {
      if (user) {
        return NextResponse.json({ error: "An account with this email or mobile number already exists." }, { status: 400 });
      }
    } else {
      if (!user) {
        return NextResponse.json({ error: "No account found with this email or mobile number." }, { status: 404 });
      }
    }

    // Generate a 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // Set expiry to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete any existing OTPs for this identifier to prevent spam/confusion
    await prisma.otpToken.deleteMany({
      where: { identifier },
    });

    // Save the new OTP
    await prisma.otpToken.create({
      data: {
        identifier,
        code: otpCode,
        expiresAt,
      },
    });

    if (isEmail) {
      // Send the email using Resend
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Look On Rent <onboarding@resend.dev>",
        to: identifier,
        subject: "Your Login Code - Look On Rent",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; text-align: center;">
            <h2 style="color: #001410;">Look On Rent Security Code</h2>
            <p style="color: #5c6462; font-size: 16px;">Please use the following 6-digit code to securely log in to your account. This code is valid for 10 minutes.</p>
            <div style="background-color: #fcf9f8; border: 1px solid #775a19; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #001410; margin: 30px 0;">
              ${otpCode}
            </div>
            <p style="color: #5c6462; font-size: 14px;">If you did not request this code, please safely ignore this message.</p>
          </div>
        `,
      });
      
      if (phone && type === "register") {
        await sendWhatsAppMessage(phone, otpCode);
      }
    } else {
      // Send via Meta WhatsApp Cloud API
      await sendWhatsAppMessage(identifier, otpCode);
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("OTP Generation Error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

async function sendWhatsAppMessage(phone: string, otpCode: string) {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
  const TEMPLATE_NAME = process.env.WHATSAPP_TEMPLATE_NAME || 'otp_template';
  
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    // For testing when env vars aren't set yet, we just print to console and return success
    console.log(`\n========================================`);
    console.log(`[Mock WhatsApp OTP] To: 91${phone}`);
    console.log(`[Mock WhatsApp OTP] Code: ${otpCode}`);
    console.log(`========================================\n`);
    return;
  }
  
  const response = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: `91${phone}`, // Automatically prepends +91
      type: "template",
      template: {
        name: TEMPLATE_NAME,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: otpCode }
            ]
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              { type: "text", text: otpCode }
            ]
          }
        ]
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("WhatsApp API Error:", errorData);
    throw new Error("Failed to send WhatsApp OTP");
  }
}
