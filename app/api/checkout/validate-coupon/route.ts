import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || subtotal === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    if (coupon.oncePerUser) {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        const previousOrder = await prisma.order.findFirst({
          where: {
            customerId: session.user.id,
            couponCode: coupon.code
          }
        });
        if (previousOrder) {
          return NextResponse.json({ error: "You have already used this promo code on a previous order." }, { status: 400 });
        }
      }
      // If no session, we allow it to pass temporarily, 
      // but it will be rigorously checked again during verify when we enforce customerId.
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round(subtotal * (coupon.discountValue / 100));
    } else if (coupon.discountType === "FLAT") {
      discountAmount = coupon.discountValue;
    }

    // Don't discount more than the subtotal itself
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discountAmount,
      message: "Coupon applied successfully"
    });

  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
