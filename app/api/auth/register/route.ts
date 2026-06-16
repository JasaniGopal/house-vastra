import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Parse role safely, default to CUSTOMER
    let userRole: Role = Role.CUSTOMER;
    if (role === "VENDOR") userRole = Role.VENDOR;
    if (role === "ADMIN") userRole = Role.ADMIN;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error("REGISTER_ERROR:", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
