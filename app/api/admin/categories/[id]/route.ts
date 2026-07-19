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

    // Verify it has no products
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return NextResponse.json({ error: "Cannot delete category with active products." }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Category DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
