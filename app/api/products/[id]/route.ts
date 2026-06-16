import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        vendor: {
          select: {
            boutiqueName: true,
            description: true,
            logoUrl: true,
            id: true,
          },
        },
      },
    });

    if (!product || product.approvalStatus !== "APPROVED" || !product.isAvailable) {
      return NextResponse.json({ error: "Product not found or not available." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Product detail fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product." },
      { status: 500 }
    );
  }
}
