import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    // Check if any products use this occasion
    const occasion = await prisma.occasion.findUnique({
      where: { id },
      include: {
        _count: {
          select: { productOccasions: true }
        }
      }
    });

    if (!occasion) {
      return NextResponse.json({ error: "Occasion not found" }, { status: 404 });
    }

    if (occasion._count.productOccasions > 0) {
      return NextResponse.json(
        { error: "Cannot delete an occasion that has products associated with it." },
        { status: 400 }
      );
    }

    await prisma.occasion.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Occasion deleted successfully" });
  } catch (error: any) {
    console.error("Admin Occasion DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete occasion" }, { status: 500 });
  }
}
