import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, role, otp } = body;

    if (!name || !email || !phone || !otp) {
      return new NextResponse("Missing fields. OTP is required.", { status: 400 });
    }

    // 1. Verify OTP
    const otpRecord = await prisma.otpToken.findUnique({
      where: {
        identifier_code: {
          identifier: email,
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

    // Validate email format basic
    if (!email.includes("@")) {
      return new NextResponse("Invalid email address.", { status: 400 });
    }

    // Validate mobile number: must be exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return new NextResponse("Invalid mobile number. Please enter a 10-digit number.", { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: phone }
        ]
      },
    });

    if (existingUser) {
      return new NextResponse("Account with this email or phone already exists", { status: 400 });
    }

    // Parse role safely: only CUSTOMER or VENDOR can be registered publicly
    let userRole: Role = Role.CUSTOMER;
    if (role === "VENDOR") {
      userRole = Role.VENDOR;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: userRole,
      },
    });

    // If they registered as a Vendor, create an initial empty Vendor profile
    if (userRole === Role.VENDOR) {
      await prisma.vendor.create({
        data: {
          userId: user.id,
          boutiqueName: `${name}'s Boutique`,
        }
      });
    }

    // 4. Delete the used OTP token
    await prisma.otpToken.delete({ where: { id: otpRecord.id } });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error("REGISTER_ERROR:", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
