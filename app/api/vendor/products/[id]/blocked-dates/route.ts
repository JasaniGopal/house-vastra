import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blockedDates = await prisma.blockedDate.findMany({
      where: { productId: id },
      orderBy: { startDate: "asc" }
    });
    return NextResponse.json(blockedDates);
  } catch (error: any) {
    console.error("Failed to fetch blocked dates:", error);
    return NextResponse.json({ error: "Failed to fetch blocked dates" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { startDate, endDate, reason } = await req.json();

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 });
    }

    const newBlockedDate = await prisma.blockedDate.create({
      data: {
        productId: id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: reason || null
      }
    });

    return NextResponse.json(newBlockedDate, { status: 201 });
  } catch (error: any) {
    console.error("Failed to add blocked date:", error);
    return NextResponse.json({ error: "Failed to add blocked date" }, { status: 500 });
  }
}
