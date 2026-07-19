import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await context.params;
    const { adminNotes, status } = await req.json();

    const validStatuses = ["OPEN", "RESOLVED_REFUND", "RESOLVED_WITHHOLD"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const dispute = await prisma.dispute.update({
      where: { id },
      data: { adminNotes, status },
    });

    // When resolving, update the parent order's depositStatus
    if (status === "RESOLVED_REFUND") {
      await prisma.order.update({
        where: { id: dispute.orderId },
        data: { depositStatus: "REFUNDED" },
      });
    } else if (status === "RESOLVED_WITHHOLD") {
      await prisma.order.update({
        where: { id: dispute.orderId },
        data: { depositStatus: "WITHHELD" },
      });
    }

    return NextResponse.json(dispute);
  } catch (error) {
    console.error("Dispute PUT error:", error);
    return NextResponse.json({ error: "Failed to update dispute" }, { status: 500 });
  }
}
