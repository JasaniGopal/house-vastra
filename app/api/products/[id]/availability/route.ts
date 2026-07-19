import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const startStr = searchParams.get("start");
    const endStr = searchParams.get("end");

    if (!startStr || !endStr) {
      return NextResponse.json(
        { error: "Start and end dates are required" },
        { status: 400 }
      );
    }

    const requestedStart = new Date(startStr);
    const requestedEnd = new Date(endStr);
    requestedStart.setHours(0, 0, 0, 0);
    requestedEnd.setHours(23, 59, 59, 999);

    if (isNaN(requestedStart.getTime()) || isNaN(requestedEnd.getTime())) {
      return NextResponse.json(
        { error: "Invalid dates provided" },
        { status: 400 }
      );
    }

    // Check for offline blocked dates
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        productId: id,
        OR: [
          {
            startDate: { lte: requestedEnd },
            endDate: { gte: requestedStart }
          }
        ]
      }
    });

    if (blockedDates.length > 0) {
      return NextResponse.json({ 
        available: false, 
        reason: "blocked_by_vendor",
        conflicts: blockedDates 
      });
    }

    // Check for existing online orders
    // Assuming status "CANCELLED" or "RETURNED" means the item might be available again,
    // but for safety let's block if there's any active order overlapping
    const activeOrders = await prisma.order.findMany({
      where: {
        productId: id,
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
      return NextResponse.json({ 
        available: false, 
        reason: "already_booked",
        conflicts: activeOrders.map(o => ({ startDate: o.startDate, endDate: o.endDate }))
      });
    }

    return NextResponse.json({ available: true });
  } catch (error: any) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Failed to check availability." },
      { status: 500 }
    );
  }
}
