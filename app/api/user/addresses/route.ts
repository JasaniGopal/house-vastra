import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, name, phone, line1, line2, city, state, zip, isDefault } = body;

    if (!name || !phone || !line1 || !city || !state || !zip) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user has any existing addresses
    const existingCount = await prisma.address.count({
      where: { userId: session.user.id }
    });

    const shouldBeDefault = existingCount === 0 || isDefault;

    // If making this default, unset others
    if (shouldBeDefault && existingCount > 0) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        type: type || "Home",
        name,
        phone,
        line1,
        line2,
        city,
        state,
        zip,
        isDefault: shouldBeDefault
      }
    });

    return NextResponse.json({ success: true, address }, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
