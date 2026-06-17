import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string, blockId: string }> }
) {
  try {
    const { blockId } = await params;
    
    await prisma.blockedDate.delete({
      where: { id: blockId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete blocked date:", error);
    return NextResponse.json({ error: "Failed to delete blocked date" }, { status: 500 });
  }
}
