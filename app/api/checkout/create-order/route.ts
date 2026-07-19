import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { amount, currency } = await req.json();

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_key";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mock_secret";

    if (key_id === "rzp_test_mock_key") {
      return NextResponse.json({
        id: `order_mock_${Math.random().toString(36).substring(2, 10)}`,
        amount: amount * 100,
        currency: currency || "INR"
      });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: currency || "INR",
      receipt: `rcpt_${Math.random().toString(36).substring(2, 10)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
