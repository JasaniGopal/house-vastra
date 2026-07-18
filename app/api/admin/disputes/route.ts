import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const disputes = await prisma.dispute.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        order: {
          include: {
            customer: { select: { name: true, email: true } },
            product: { select: { name: true, images: { where: { isPrimary: true }, take: 1 } } },
          },
        },
      },
    });

    return NextResponse.json(disputes);
  } catch (error) {
    console.error("Disputes GET error:", error);
    return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { orderId, reason } = await req.json();
    if (!orderId || !reason) {
      return NextResponse.json({ error: "orderId and reason required" }, { status: 400 });
    }

    const dispute = await prisma.dispute.create({
      data: { orderId, reason },
    });

    return NextResponse.json(dispute);
  } catch (error: any) {
    console.error("Disputes POST error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A dispute already exists for this order" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create dispute" }, { status: 500 });
  }
}
