import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id, vendorId: vendor.id } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const body = await req.json();
    const { isAvailable } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: { isAvailable }
    });

    return NextResponse.json({ message: "Availability updated", product: updated });
  } catch (error) {
    console.error("PATCH Product Availability Error:", error);
    return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
  }
}
