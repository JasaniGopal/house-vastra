import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const trending = searchParams.get("trending") === "true";

    const products = await prisma.product.findMany({
      where: {
        isAvailable: true,
        approvalStatus: "APPROVED",
        ...(category ? { category: { slug: category } } : {}),
        ...(trending ? { isTrending: true } : {}),
      },
      include: {
        images: true,
        category: true,
        vendor: {
          select: {
            boutiqueName: true,
            logoUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products." },
      { status: 500 }
    );
  }
}
