import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found." }, { status: 404 });
    }

    return NextResponse.json(vendor);
  } catch (error: any) {
    console.error("Vendor profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch vendor profile." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { boutiqueName, description, logoUrl, gstin, bankAccount, ifscCode } = body;

    const vendor = await prisma.vendor.update({
      where: { userId: session.user.id },
      data: {
        boutiqueName,
        description,
        logoUrl,
        gstin,
        bankAccount,
        ifscCode,
        status: "ACTIVE"
      },
    });

    return NextResponse.json({ message: "Profile updated successfully", vendor });
  } catch (error: any) {
    console.error("Vendor profile update error:", error);
    return NextResponse.json({ error: "Failed to update vendor profile." }, { status: 500 });
  }
}
