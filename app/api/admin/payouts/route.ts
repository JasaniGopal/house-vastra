import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { vendorId, amount } = await req.json();

    // 1. Create the Payout record
    const payout = await prisma.payout.create({
      data: {
        vendorId,
        amount,
        status: "PAID",
      }
    });

    // 2. Find all pending orders for this vendor and link them to the payout
    const pendingOrders = await prisma.order.findMany({
      where: {
        product: {
          vendorId: vendorId
        },
        status: { in: ["COMPLETED", "RETURNED"] },
        payoutId: null
      }
    });

    const orderIds = pendingOrders.map(o => o.id);

    // 3. Update orders
    await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { payoutId: payout.id }
    });

    return NextResponse.json({ success: true, payout });
  } catch (error: any) {
    console.error("Admin Payouts POST Error:", error);
    return NextResponse.json({ error: "Failed to process payout" }, { status: 500 });
  }
}
