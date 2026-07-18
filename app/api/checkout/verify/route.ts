import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      items, 
      address, 
      userId 
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mock_secret";

    if (secret !== "rzp_test_mock_secret") {
      // Create signature to verify
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }
    }

    // Process orders
    const addressString = `${address.name}, ${address.flat}, ${address.street}, ${address.city}. Phone: ${address.phone}`;
    
    const createdOrders = [];
    
    // We assume userId is valid, but fallback to a test user if null for MVP if needed.
    // Ensure you have a valid user in the DB.
    let customerId = userId;
    
    if (!customerId) {
        // Just for demo fallback, find first user
        const firstUser = await prisma.user.findFirst();
        if (firstUser) customerId = firstUser.id;
    }

    if (!customerId) {
      return NextResponse.json({ error: "No customer found to attach order" }, { status: 400 });
    }

    for (const item of items) {
      // Fetch the product from the DB to get the original vendor expectations
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.id }
      });

      let vendorEarnings = 0;
      let platformFee = 0;

      if (dbProduct && dbProduct.vendorExpectedRent) {
        // Option A: Vendor gets exactly what they asked for, Platform keeps the markup
        vendorEarnings = dbProduct.vendorExpectedRent;
        platformFee = item.price - vendorEarnings;

        // Safety check: if Admin listed it for LESS than the vendor asked for (shouldn't happen, but just in case)
        if (platformFee < 0) {
          platformFee = 0;
          vendorEarnings = item.price;
        }
      } else {
        // Fallback if product not found or no expected rent set
        platformFee = Math.round(item.price * 0.15); // 15% platform fee
        vendorEarnings = item.price - platformFee;
      }

      const newOrder = await prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          customerId: customerId,
          productId: item.id,
          startDate: item.startDate ? new Date(item.startDate) : new Date(),
          endDate: item.endDate ? new Date(item.endDate) : new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          totalAmount: item.price + item.deposit,
          shippingAddress: addressString,
          status: "PREPARING",
          platformFee: platformFee,
          vendorEarnings: vendorEarnings,
        }
      });
      createdOrders.push(newOrder);
    }

    // Clear the cart in the DB since checkout succeeded
    await prisma.cartItem.deleteMany({
      where: { userId: customerId }
    });

    return NextResponse.json({ success: true, orders: createdOrders });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
