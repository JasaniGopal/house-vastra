import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();

    // If suspending a vendor, we should also take all their products offline
    if (status === "SUSPENDED") {
      await prisma.product.updateMany({
        where: { vendorId: id },
        data: { isAvailable: false }
      });
    }

    const updated = await prisma.vendor.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Admin Vendor Status PUT Error:", error);
    return NextResponse.json({ error: "Failed to update vendor status" }, { status: 500 });
  }
}
