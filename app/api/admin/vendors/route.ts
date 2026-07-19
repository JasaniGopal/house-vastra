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

    const vendors = await prisma.vendor.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(vendors);
  } catch (error: any) {
    console.error("Admin Vendors GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}
