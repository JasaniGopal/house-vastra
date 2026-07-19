import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const params = await context.params;
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
    }

    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json({ error: "isActive boolean is required" }, { status: 400 });
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: { isActive }
    });

    return NextResponse.json(updatedCoupon);
  } catch (error: any) {
    console.error("Admin Coupon Update Error:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const params = await context.params;
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
    }

    await prisma.coupon.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Coupon Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}

