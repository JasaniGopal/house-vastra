import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { isDefault } = body;

    // Verify ownership
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (isDefault) {
      // Unset others
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      });
      
      const updated = await prisma.address.update({
        where: { id },
        data: { isDefault: true }
      });
      return NextResponse.json({ success: true, address: updated });
    }

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id }
    });

    // If it was default, make another one default
    if (address.isDefault) {
      const remaining = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
      });
      if (remaining) {
        await prisma.address.update({
          where: { id: remaining.id },
          data: { isDefault: true }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
