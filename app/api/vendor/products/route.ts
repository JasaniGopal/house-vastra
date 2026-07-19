import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden. Vendor access required." }, { status: 403 });
    }

    // Get the vendor profile
    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found. Please complete your boutique setup." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, description, retailValue, vendorExpectedRent, vendorExpectedDeposit, sizes, categoryId, occasionIds, images } = body;

    // Basic validation
    if (!name || !description || !retailValue || !vendorExpectedRent || !sizes || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prepare images payload if provided
    const imagePayload = images && Array.isArray(images) && images.length > 0
      ? {
          create: images.map((url: string, index: number) => ({
            url,
            isPrimary: index === 0, // First image is primary
          })),
        }
      : undefined;

    // Prepare occasions payload if provided
    const occasionPayload = occasionIds && Array.isArray(occasionIds) && occasionIds.length > 0
      ? {
          connect: occasionIds.map((id: string) => ({ id }))
        }
      : undefined;

    // Create the product
    const product = await prisma.product.create({
      data: {
        vendorId: vendor.id,
        categoryId,
        name,
        description,
        retailValue: parseFloat(retailValue),
        vendorExpectedRent: parseFloat(vendorExpectedRent),
        vendorExpectedDeposit: parseFloat(vendorExpectedDeposit),
        sizes,
        approvalStatus: "PENDING",
        isAvailable: false,
        images: imagePayload,
        occasions: occasionPayload,
      },
      include: {
        images: true,
        category: true,
        occasions: true,
      },
    });

    return NextResponse.json({ message: "Product created successfully", product }, { status: 201 });

  } catch (error: any) {
    console.error("Product upload error:", error);
    return NextResponse.json(
      { error: "An error occurred while uploading the product." },
      { status: 500 }
    );
  }
}
