import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { identifier, otp, password } = await req.json();

    if (!identifier || !otp || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    if (password.length < 6) {
      return new NextResponse("Password must be at least 6 characters", { status: 400 });
    }

    // Verify the OTP in the database
    const otpRecord = await prisma.otpToken.findUnique({
      where: {
        identifier_code: {
          identifier,
          code: otp,
        },
      },
    });

    if (!otpRecord) {
      return new NextResponse("Invalid or expired OTP", { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      await prisma.otpToken.delete({ where: { id: otpRecord.id } });
      return new NextResponse("OTP has expired", { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the OTP since it has been successfully used
    await prisma.otpToken.delete({ where: { id: otpRecord.id } });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
