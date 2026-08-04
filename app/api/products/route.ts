import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Fuse from "fuse.js";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // Can be comma separated
    const occasion = searchParams.get("occasion"); // Can be comma separated
    const trending = searchParams.get("trending") === "true";
    let search = searchParams.get("q")?.toLowerCase();
    const sort = searchParams.get("sort"); // "newest", "price_asc", "price_desc"
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");

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
      
      // Use case-insensitive matching for each occasion, and support partial match for "Weddings" -> "wedding"
      // or "wedding" -> "Weddings"
      const occasionOrConditions = occasions.flatMap(o => {
        // Strip trailing 's' if present to handle singular/plural mismatch simply
        const base = o.toLowerCase().endsWith('s') ? o.slice(0, -1) : o;
        return [
          { name: { equals: o } },
          { name: { contains: base } }
        ];
      });

      whereClause.productOccasions = {
        some: {
          occasion: {
            OR: occasionOrConditions
          }
        }
      };
    }

    if (trending) {
      whereClause.isTrending = true;
    }

    // Synonym dictionary for common Indian wear typos and misspellings
    if (search) {
      const synonymMap: Record<string, string> = {
        "sari": "saree",
        "sare": "saree",
        "sareee": "saree",
        "sareeee": "saree",
        "sareeeee": "saree",
        "sarie": "saree",
        "serwani": "sherwani",
        "shervani": "sherwani",
        "sherwanii": "sherwani",
        "shrewani": "sherwani",
        "shervanis": "sherwani",
        "sherwanis": "sherwani",
        "serwanis": "sherwani",
        "sirwani": "sherwani",
        "lengha": "lehenga",
        "lahanga": "lehenga",
        "lehanga": "lehenga",
        "lehengas": "lehenga",
        "lahangas": "lehenga",
        "lenghas": "lehenga",
        "langa": "lehenga",
        "kurti": "kurta",
        "kurtis": "kurta",
        "kurtaa": "kurta",
        "kurtas": "kurta",
        "kurtha": "kurta",
        "gowm": "gown",
        "gowns": "gown",
        "dres": "dress",
        "dresses": "dress",
        "trowser": "trouser",
        "trousers": "trouser",
        "shrits": "shirt",
        "shirts": "shirt",
        "jwellry": "jewelry",
        "jewelery": "jewelry",
        "jewellry": "jewelry",
        "jewellery": "jewelry",
      };
      
      // Replace known typos in the search string using word boundaries to avoid partial matches
      Object.keys(synonymMap).forEach(typo => {
        if (search) {
          // Check for the typo, optionally with a plural 's' at the end
          const regex = new RegExp(`\\b${typo}s?\\b`, 'gi');
          search = search.replace(regex, synonymMap[typo]);
        }
      });
      
      // Basic cleanup for excessive repeated letters (e.g. sareeeeee -> saree)
      search = search.replace(/([a-z])\1{2,}/gi, '$1$1');
    }

    if (maxPrice) {
      whereClause.rentalPrice4Day = { lte: parseFloat(maxPrice) };
    }

    if (size) {
      const sizeList = size.split(',').map(s => s.trim());
      const sizeOrConditions = sizeList.flatMap(s => [
        { sizes: { equals: s } },
        { sizes: { startsWith: `${s},` } },
        { sizes: { endsWith: `,${s}` } },
        { sizes: { contains: `,${s},` } }
      ]);
      
      if (!whereClause.AND) whereClause.AND = [];
      whereClause.AND.push({ OR: sizeOrConditions });
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
        productOccasions: { include: { occasion: true } },
        vendor: {
          select: {
            boutiqueName: true,
            logoUrl: true,
          },
        },
      },
      orderBy: orderByClause,
    });

    let finalProducts = products;

    // Apply Fuse.js fuzzy search in memory if search query exists
    if (search) {
      const fuse = new Fuse(products, {
        keys: [
          "name",
          "description",
          "vendor.boutiqueName",
          "category.name",
          "productOccasions.occasion.name"
        ],
        threshold: 0.4, // 0.0 is perfect match, 1.0 is anything. 0.4 allows some typos.
        distance: 100,
        ignoreLocation: true,
      });

      const results = fuse.search(search);
      finalProducts = results.map(result => result.item);
    }

    // Strip internal financial metrics from public response
    const sanitizedProducts = finalProducts.map((p: any) => {
      const { vendorExpectedRent, vendorExpectedDeposit, ...rest } = p;
      return rest;
    });

    return NextResponse.json(sanitizedProducts);
  } catch (error: any) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products." },
      { status: 500 }
    );
  }
}
