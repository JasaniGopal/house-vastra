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

    const payouts = await prisma.payout.findMany({
      include: {
        vendor: {
          select: { boutiqueName: true }
        },
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(payouts);
  } catch (error: any) {
    console.error("Admin Payouts History GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch payout history" }, { status: 500 });
  }
}
