import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
      return NextResponse.json({ orders: [] });
    }
    const orders = await prisma.order.findMany({
      where: { customerId: firstUser.id },
      include: { 
        product: { 
          include: { 
            images: true, 
            vendor: true 
          } 
        } 
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
