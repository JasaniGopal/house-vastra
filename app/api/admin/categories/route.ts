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

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Admin Categories GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, slug, description } = await req.json();

    const category = await prisma.category.create({
      data: { name, slug, description }
    });
    
    // Attach the count property so the UI doesn't crash on newly created ones
    return NextResponse.json({ ...category, _count: { products: 0 } });
  } catch (error: any) {
    console.error("Admin Categories POST Error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
