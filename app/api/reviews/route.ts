import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, orderId, rating, comment, images } = body;

    if (!productId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        customerId: session.user.id,
        productId,
        orderId,
        rating: Number(rating),
        comment,
        images: images || [], // Store the JSON array of image URLs
        isApproved: false // Requires admin approval for social proof legitimacy
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
