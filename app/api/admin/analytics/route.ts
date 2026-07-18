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

    // --- Revenue Over Time (last 6 months) ---
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueOrders = await prisma.order.findMany({
      where: { createdAt: { gte: sixMonthsAgo }, status: { not: "CANCELLED" } },
      select: { createdAt: true, totalAmount: true, platformFee: true, discountAmount: true },
    });

    const revenueByMonth: Record<string, { gross: number; profit: number }> = {};
    revenueOrders.forEach((o) => {
      const key = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth() + 1).padStart(2, "0")}`;
      if (!revenueByMonth[key]) revenueByMonth[key] = { gross: 0, profit: 0 };
      revenueByMonth[key].gross += o.totalAmount;
      revenueByMonth[key].profit += o.platformFee;
    });

    const revenueChart = Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    // --- Top Performing Products ---
    const topProducts = await prisma.order.groupBy({
      by: ["productId"],
      where: { status: { in: ["COMPLETED", "RETURNED", "IN_USE"] } },
      _count: { productId: true },
      _sum: { totalAmount: true },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    });

    const topProductsWithNames = await Promise.all(
      topProducts.map(async (p) => {
        const product = await prisma.product.findUnique({
          where: { id: p.productId },
          select: { name: true, images: { where: { isPrimary: true }, take: 1 } },
        });
        return {
          productId: p.productId,
          name: product?.name || "Unknown",
          image: product?.images?.[0]?.url || null,
          rentals: p._count.productId,
          revenue: p._sum.totalAmount || 0,
        };
      })
    );

    // --- KPIs ---
    const [totalRevenue, totalPlatformProfit, totalActiveOrders, totalCustomers, depositLiability] =
      await Promise.all([
        prisma.order.aggregate({
          where: { status: { not: "CANCELLED" } },
          _sum: { totalAmount: true },
        }),
        prisma.order.aggregate({
          where: { status: { not: "CANCELLED" } },
          _sum: { platformFee: true },
        }),
        prisma.order.count({ where: { status: { in: ["PREPARING", "DISPATCHED", "IN_USE"] } } }),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.order.aggregate({
          where: { depositStatus: "HELD" },
          _sum: { totalAmount: true },
        }),
      ]);

    return NextResponse.json({
      kpis: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalPlatformProfit: totalPlatformProfit._sum.platformFee || 0,
        totalActiveOrders,
        totalCustomers,
        depositLiability: depositLiability._sum.totalAmount || 0,
      },
      revenueChart,
      topProducts: topProductsWithNames,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
