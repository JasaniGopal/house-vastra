import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items format" }, { status: 400 });
    }

    const conflicts = [];

    for (const item of items) {
      const requestedStart = new Date(item.startDate);
      const requestedEnd = new Date(item.endDate);
      requestedStart.setHours(0, 0, 0, 0);
      requestedEnd.setHours(23, 59, 59, 999);

      // Check blocked dates
      const blockedDates = await prisma.blockedDate.findMany({
        where: {
          productId: item.id,
          OR: [
            {
              startDate: { lte: requestedEnd },
              endDate: { gte: requestedStart }
            }
          ]
        }
      });

      if (blockedDates.length > 0) {
        conflicts.push({ id: item.id, title: item.title, reason: "Blocked by vendor" });
        continue;
      }

      // Check existing orders
      const activeOrders = await prisma.order.findMany({
        where: {
          productId: item.id,
          status: {
            notIn: ["CANCELLED", "RETURNED"]
          },
          OR: [
            {
              startDate: { lte: requestedEnd },
              endDate: { gte: requestedStart }
            }
          ]
        }
      });

      if (activeOrders.length > 0) {
        conflicts.push({ id: item.id, title: item.title, reason: "Already booked by another customer" });
      }
    }

    if (conflicts.length > 0) {
      return NextResponse.json({ 
        available: false, 
        conflicts 
      });
    }

    return NextResponse.json({ available: true });
  } catch (error: any) {
    console.error("Checkout validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate cart availability." },
      { status: 500 }
    );
  }
}
