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
    if (!id) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
    }

    const { isBanned } = await req.json();

    if (typeof isBanned !== "boolean") {
      return NextResponse.json({ error: "isBanned boolean is required" }, { status: 400 });
    }

    const updatedCustomer = await prisma.user.update({
      where: { id },
      data: { isBanned }
    });

    return NextResponse.json(updatedCustomer);
  } catch (error: any) {
    console.error("Admin Customer Update Error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}
