import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { isAvailable, isTrending } = await req.json();

    const dataToUpdate: any = {};
    if (isAvailable !== undefined) dataToUpdate.isAvailable = isAvailable;
    if (isTrending !== undefined) dataToUpdate.isTrending = isTrending;

    const updated = await prisma.product.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Admin Inventory PUT Error:", error);
    return NextResponse.json({ error: "Failed to update product status" }, { status: 500 });
  }
}
