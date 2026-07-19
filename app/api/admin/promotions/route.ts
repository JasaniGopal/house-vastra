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

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(coupons);
  } catch (error: any) {
    console.error("Admin Promotions GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { code, discountType, discountValue, usageLimit, oncePerUser } = await req.json();

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validTypes = ["PERCENTAGE", "FLAT"];
    if (!validTypes.includes(discountType)) {
      return NextResponse.json({ error: "Invalid discount type" }, { status: 400 });
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        oncePerUser: !!oncePerUser,
      }
    });

    return NextResponse.json(newCoupon);
  } catch (error: any) {
    console.error("Admin Promotions POST Error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create promotion" }, { status: 500 });
  }
}
