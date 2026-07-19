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

    // Find all vendors who have orders that are DELIVERED or RETURNED but payoutId is null
    const vendorsWithPendingOrders = await prisma.vendor.findMany({
      where: {
        products: {
          some: {
            orders: {
              some: {
                status: { in: ["COMPLETED", "RETURNED"] },
                payoutId: null
              }
            }
          }
        }
      },
      include: {
        products: {
          include: {
            orders: {
              where: {
                status: { in: ["COMPLETED", "RETURNED"] },
                payoutId: null
              }
            }
          }
        }
      }
    });

    // Aggregate data for UI
    const pendingBalances = vendorsWithPendingOrders.map(vendor => {
      let pendingAmount = 0;
      let pendingOrdersCount = 0;

      vendor.products.forEach(product => {
        product.orders.forEach(order => {
          pendingAmount += order.vendorEarnings;
          pendingOrdersCount++;
        });
      });

      return {
        id: vendor.id,
        boutiqueName: vendor.boutiqueName,
        bankAccount: vendor.bankAccount,
        ifscCode: vendor.ifscCode,
        pendingAmount,
        pendingOrdersCount
      };
    });

    return NextResponse.json(pendingBalances.filter(v => v.pendingAmount > 0));
  } catch (error: any) {
    console.error("Admin Payouts Pending GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch pending payouts" }, { status: 500 });
  }
}
