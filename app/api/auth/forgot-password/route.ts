import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security, don't reveal if the user exists or not.
      // Just return success even if we didn't send an email.
      return NextResponse.json({ message: "If an account exists, a reset link was sent." });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    
    // Token expires in 1 hour
    const expires = new Date(Date.now() + 3600000);

    // Save token to database
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // Create the reset link
    // Assuming the app is hosted at process.env.NEXTAUTH_URL or localhost for dev
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Send the email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "LOR Account Security <onboarding@resend.dev>",
      to: email,
      subject: "Reset your LookOnRent Password",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #001410; max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Password Reset Request</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #414846; mb-4">
            Hello ${user.name || "Customer"},<br/><br/>
            We received a request to reset your password. Click the button below to choose a new password. This link will expire in 1 hour.
          </p>
          <a href="${resetUrl}" style="display: inline-block; padding: 14px 24px; background-color: #001410; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
            Reset Password
          </a>
          <p style="font-size: 14px; color: #414846; margin-top: 20px;">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${resetUrl}" style="color: #775a19;">${resetUrl}</a>
          </p>
          <p style="font-size: 14px; color: #999; margin-top: 40px;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "If an account exists, a reset link was sent." });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
