import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("Failed to fetch wishlist:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // Check if it exists
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId
        }
      }
    });

    if (existing) {
      // Remove it (toggle off)
      await prisma.wishlistItem.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ success: true, action: "removed" });
    } else {
      // Add it (toggle on)
      const newItem = await prisma.wishlistItem.create({
        data: {
          userId: session.user.id,
          productId: productId
        }
      });
      return NextResponse.json({ success: true, action: "added", item: newItem });
    }

  } catch (error: any) {
    console.error("Failed to modify wishlist:", error);
    return NextResponse.json({ error: "Failed to modify wishlist" }, { status: 500 });
  }
}
