import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const products = await prisma.product.findMany({
      where: { approvalStatus: "APPROVED" },
      include: {
        vendor: true,
        category: true,
        images: true,
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Admin Inventory GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}
