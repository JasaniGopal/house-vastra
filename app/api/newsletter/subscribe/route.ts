import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true }
        });
      }
      return NextResponse.json({ message: "Already subscribed!" }, { status: 200 });
    }

    await prisma.newsletterSubscriber.create({
      data: { email }
    });

    return NextResponse.json({ message: "Successfully subscribed" }, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
