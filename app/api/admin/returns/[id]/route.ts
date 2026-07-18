import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const { depositStatus } = await req.json();

    if (!depositStatus) {
      return NextResponse.json({ error: "depositStatus is required" }, { status: 400 });
    }

    const validStatuses = ["HELD", "REFUNDED", "WITHHELD"];
    if (!validStatuses.includes(depositStatus)) {
      return NextResponse.json({ error: "Invalid depositStatus" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { depositStatus }
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Admin Deposit Update Error:", error);
    return NextResponse.json({ error: "Failed to update deposit status" }, { status: 500 });
  }
}
