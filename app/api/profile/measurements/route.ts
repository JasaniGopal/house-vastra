import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.measurementProfile.findUnique({
      where: { userId: session.user.id }
    });

    return NextResponse.json(profile || {});
  } catch (error: any) {
    console.error("Error fetching measurements:", error);
    return NextResponse.json(
      { error: "Failed to fetch measurement profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { height, bust, waist, hips, customNotes } = body;

    const profile = await prisma.measurementProfile.upsert({
      where: { userId: session.user.id },
      update: { height, bust, waist, hips, customNotes },
      create: {
        userId: session.user.id,
        height,
        bust,
        waist,
        hips,
        customNotes
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("Error saving measurements:", error);
    return NextResponse.json(
      { error: "Failed to save measurement profile", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
