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

    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: { name: true, email: true }
        },
        product: {
          include: {
            images: true,
            vendor: {
              select: { id: true, boutiqueName: true }
            }
          }
        },
        dispute: {
          select: { status: true, reason: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Admin Orders GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
