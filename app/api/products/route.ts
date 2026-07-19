import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // Can be comma separated
    const occasion = searchParams.get("occasion"); // Can be comma separated
    const trending = searchParams.get("trending") === "true";
    const search = searchParams.get("q");
    const sort = searchParams.get("sort"); // "newest", "price_asc", "price_desc"

    let whereClause: any = {
      isAvailable: true,
      approvalStatus: "APPROVED",
    };

    if (category) {
      const categories = category.split(',').map(c => c.trim());
      // Match by name or slug
      whereClause.category = {
        name: { in: categories }
      };
    }

    if (occasion) {
      const occasions = occasion.split(',').map(o => o.trim());
      whereClause.occasions = {
        some: {
          name: { in: occasions }
        }
      };
    }

    if (trending) {
      whereClause.isTrending = true;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } }
      ];
    }

    let orderByClause: any = { createdAt: "desc" };
    if (sort === "price_asc") {
      orderByClause = { rentalPrice4Day: "asc" };
    } else if (sort === "price_desc") {
      orderByClause = { rentalPrice4Day: "desc" };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: true,
        category: true,
        occasions: true,
        vendor: {
          select: {
            boutiqueName: true,
            logoUrl: true,
          },
        },
      },
      orderBy: orderByClause,
    });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products." },
      { status: 500 }
    );
  }
}
