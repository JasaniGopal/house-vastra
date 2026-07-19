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

    const reviews = await prisma.review.findMany({
      orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
      include: {
        customer: { select: { name: true, email: true } },
        product: { select: { name: true } },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
