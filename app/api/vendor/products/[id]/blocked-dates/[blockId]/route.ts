import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string, blockId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, blockId } = await params;

    // Verify product exists and belongs to the vendor (unless Admin)
    if (session.user.role === "VENDOR") {
      const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
      if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

      const product = await prisma.product.findUnique({ where: { id, vendorId: vendor.id } });
      if (!product) return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 403 });
    }
    
    // Verify blocked date belongs to this product
    const blockedDate = await prisma.blockedDate.findUnique({
      where: { id: blockId }
    });

    if (!blockedDate || blockedDate.productId !== id) {
      return NextResponse.json({ error: "Blocked date not found" }, { status: 404 });
    }

    await prisma.blockedDate.delete({
      where: { id: blockId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete blocked date:", error);
    return NextResponse.json({ error: "Failed to delete blocked date" }, { status: 500 });
  }
}

