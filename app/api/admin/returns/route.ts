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
      where: {
        // Only show orders that have a status implying the deposit should be processed
        status: { in: ["IN_USE", "RETURNED", "COMPLETED", "CANCELLED"] }
      },
      include: {
        customer: {
          select: { name: true, email: true, phone: true }
        },
        product: {
          include: {
            images: true,
            vendor: {
              select: { boutiqueName: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Admin Returns GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch returns data" }, { status: 500 });
  }
}
