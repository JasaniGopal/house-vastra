import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Fetch the order to ensure it belongs to the user and can be cancelled
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.customerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow cancelling if it's still PREPARING
    if (order.status !== "PREPARING") {
      return NextResponse.json({ error: "Only PREPARING orders can be cancelled" }, { status: 400 });
    }

    // Update status
    const updated = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" }
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Failed to cancel order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
