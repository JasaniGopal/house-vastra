import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blockedDates = await prisma.blockedDate.findMany({
      where: { productId: id },
      orderBy: { startDate: "asc" }
    });
    return NextResponse.json(blockedDates);
  } catch (error: any) {
    console.error("Failed to fetch blocked dates:", error);
    return NextResponse.json({ error: "Failed to fetch blocked dates" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify product exists and belongs to the vendor (unless Admin)
    if (session.user.role === "VENDOR") {
      const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
      if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

      const product = await prisma.product.findUnique({ where: { id, vendorId: vendor.id } });
      if (!product) return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 403 });
    }

    const { startDate, endDate, reason } = await req.json();

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 });
    }

    const newBlockedDate = await prisma.blockedDate.create({
      data: {
        productId: id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: reason || null
      }
    });

    return NextResponse.json(newBlockedDate, { status: 201 });
  } catch (error: any) {
    console.error("Failed to add blocked date:", error);
    return NextResponse.json({ error: "Failed to add blocked date", details: error.message }, { status: 500 });
  }
}

