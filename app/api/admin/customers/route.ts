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

    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        _count: {
          select: { orders: true }
        },
        orders: {
          select: { totalAmount: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const enrichedCustomers = customers.map(c => ({
      ...c,
      totalSpent: c.orders.reduce((sum, o) => sum + o.totalAmount, 0)
    }));

    // Remove raw orders array to save payload size
    enrichedCustomers.forEach((c: any) => delete c.orders);

    return NextResponse.json(enrichedCustomers);
  } catch (error: any) {
    console.error("Admin Customers GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
