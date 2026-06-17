import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    
    // Fetch product regardless of its approval status
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        vendor: {
          select: {
            boutiqueName: true,
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(product);

  } catch (error: any) {
    console.error("Admin Fetch Product Error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the product." },
      { status: 500 }
    );
  }
}
