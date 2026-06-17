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
      include: { images: true }
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
    const { name, description, retailValue, vendorExpectedRent, sizes, categoryId, deletedImageIds, newImageUrls } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        retailValue: parseFloat(retailValue),
        vendorExpectedRent: parseFloat(vendorExpectedRent),
        sizes,
        categoryId,
        approvalStatus: "PENDING",
        rejectionReason: null
      }
    });

    if (deletedImageIds && deletedImageIds.length > 0) {
      await prisma.productImage.deleteMany({
        where: {
          id: { in: deletedImageIds },
          productId: id
        }
      });
    }

    if (newImageUrls && newImageUrls.length > 0) {
      // Check if we need to set the first one as primary
      const existingImages = await prisma.productImage.count({ where: { productId: id } });
      
      const newImagesData = newImageUrls.map((url: string, index: number) => ({
        productId: id,
        url,
        isPrimary: existingImages === 0 && index === 0
      }));

      await prisma.productImage.createMany({
        data: newImagesData
      });
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
