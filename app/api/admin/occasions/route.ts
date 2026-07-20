import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const occasions = await prisma.occasion.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { productOccasions: true }
        }
      }
    });

    return NextResponse.json(occasions);
  } catch (error: any) {
    console.error("Admin Occasions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch occasions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, slug, description } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const occasion = await prisma.occasion.create({
      data: {
        name,
        slug,
        description
      },
      include: {
        _count: {
          select: { productOccasions: true }
        }
      }
    });

    return NextResponse.json(occasion, { status: 201 });
  } catch (error: any) {
    console.error("Admin Occasions POST error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "An occasion with this name or slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create occasion" }, { status: 500 });
  }
}
