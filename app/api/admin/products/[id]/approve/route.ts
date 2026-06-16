import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { rentalPricePerDay, rentalPrice2Day, rentalPrice4Day, rentalPrice8Day, status } = body;

    // Optional: allow admin to simply reject the product
    if (status === "REJECTED") {
      const rejectedProduct = await prisma.product.update({
        where: { id },
        data: {
          approvalStatus: "REJECTED",
          isAvailable: false,
        },
      });
      return NextResponse.json({ message: "Product rejected", product: rejectedProduct });
    }

    // Otherwise, assume approval and require prices
    if (!rentalPricePerDay || !rentalPrice2Day || !rentalPrice4Day || !rentalPrice8Day) {
      return NextResponse.json({ error: "Missing final pricing tiers for approval" }, { status: 400 });
    }

    const approvedProduct = await prisma.product.update({
      where: { id },
      data: {
        rentalPricePerDay: parseFloat(rentalPricePerDay),
        rentalPrice2Day: parseFloat(rentalPrice2Day),
        rentalPrice4Day: parseFloat(rentalPrice4Day),
        rentalPrice8Day: parseFloat(rentalPrice8Day),
        approvalStatus: "APPROVED",
        isAvailable: true, // Make it live on the site
      },
    });

    return NextResponse.json({ message: "Product approved successfully", product: approvedProduct });

  } catch (error: any) {
    console.error("Admin product approval error:", error);
    return NextResponse.json(
      { error: "An error occurred while approving the product." },
      { status: 500 }
    );
  }
}
