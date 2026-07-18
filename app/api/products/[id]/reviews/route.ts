import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const reviews = await prisma.review.findMany({
      where: { productId: id, isApproved: true },
      include: { customer: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to leave a review" }, { status: 401 });
    }

    const { id: productId } = await context.params;
    const { rating, comment, orderId } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Ensure the customer actually rented this product
    const completedOrder = await prisma.order.findFirst({
      where: {
        customerId: session.user.id,
        productId,
        status: { in: ["COMPLETED", "RETURNED"] },
      },
    });

    if (!completedOrder) {
      return NextResponse.json({ error: "You can only review items you have rented" }, { status: 403 });
    }

    const review = await prisma.review.create({
      data: {
        customerId: session.user.id,
        productId,
        orderId: orderId || completedOrder.id,
        rating,
        comment,
        isApproved: false, // Goes to moderation queue
      },
    });

    return NextResponse.json({ ...review, message: "Review submitted! It will appear after approval." });
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
