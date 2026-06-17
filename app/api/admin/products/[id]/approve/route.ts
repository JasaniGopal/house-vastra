import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    
    if (body.approvalStatus === "REJECTED") {
      const updated = await prisma.product.update({
        where: { id },
        data: {
          approvalStatus: "REJECTED",
          rejectionReason: body.rejectionReason,
          isAvailable: false
        }
      });
      return NextResponse.json({ message: "Product rejected", product: updated });
    }

    // Otherwise, it's an approval with a final rental price
    const { rentalPrice } = body;

    if (!rentalPrice || isNaN(rentalPrice) || rentalPrice <= 0) {
      return NextResponse.json({ error: "A valid final rental price is required for approval." }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        rentalPricePerDay: parseFloat(rentalPrice),
        approvalStatus: "APPROVED",
        isAvailable: true // Make it live on the site!
      }
    });

    return NextResponse.json({ message: "Product approved and published successfully", product: updated });

  } catch (error: any) {
    console.error("Admin Approval Error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the product status." },
      { status: 500 }
    );
  }
}
