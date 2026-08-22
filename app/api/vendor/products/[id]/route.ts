import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id, vendorId: vendor.id },
      include: { 
        images: {
          orderBy: { sequence: 'asc' }
        }
      }
    });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET Product Error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id, vendorId: vendor.id } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const body = await req.json();
    const { name, description, retailValue, vendorExpectedRent, vendorExpectedDeposit, sizes, categoryId, gender, orderedImageUrls } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        retailValue: parseFloat(retailValue),
        vendorExpectedRent: parseFloat(vendorExpectedRent),
        vendorExpectedDeposit: parseFloat(vendorExpectedDeposit),
        sizes,
        category: { connect: { id: categoryId } },
        gender: gender || "WOMEN",
        approvalStatus: "PENDING",
        rejectionReason: null
      }
    });

    if (orderedImageUrls && Array.isArray(orderedImageUrls)) {
      // 1. Delete all existing images
      await prisma.productImage.deleteMany({
        where: { productId: id }
      });

      // 2. Recreate with exact requested sequence
      if (orderedImageUrls.length > 0) {
        const newImagesData = orderedImageUrls.map((url: string, index: number) => ({
          productId: id,
          url,
          isPrimary: index === 0,
          sequence: index
        }));

        await prisma.productImage.createMany({
          data: newImagesData
        });
      }
    }

    return NextResponse.json({ message: "Product updated", product: updated });
  } catch (error) {
    console.error("PUT Product Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id, vendorId: vendor.id } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
