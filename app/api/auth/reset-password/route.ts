import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    if (password.length < 6) {
      return new NextResponse("Password must be at least 6 characters", { status: 400 });
    }

    // Find the token in the database
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      return new NextResponse("Invalid or expired token", { status: 400 });
    }

    // Check if token has expired
    if (new Date() > resetRecord.expires) {
      // Clean up the expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetRecord.id },
      });
      return new NextResponse("Token has expired", { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword },
    });

    // Delete the token so it cannot be used again
    await prisma.passwordResetToken.delete({
      where: { id: resetRecord.id },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
