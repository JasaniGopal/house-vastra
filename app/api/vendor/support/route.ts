import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { sendEmail, sendWhatsApp } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
      include: { user: true }
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    // 1. Save ticket to DB
    const ticket = await prisma.supportTicket.create({
      data: {
        vendorId: vendor.id,
        subject,
        message,
      }
    });

    // 2. Send Email to Admin
    await sendEmail({
      to: "admin@houseofvastra.com",
      subject: `New Vendor Support Ticket: ${subject}`,
      html: `
        <h3>New Support Request from ${vendor.boutiqueName}</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px;">${message}</blockquote>
        <br/>
        <p>Vendor Email: ${vendor.user.email}</p>
        <p>Ticket ID: ${ticket.id}</p>
      `
    });

    // 3. Send WhatsApp Alert to Admin (Assuming admin phone number is configured in env or hardcoded here)
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "+919876543210";
    await sendWhatsApp({
      phone: adminPhone,
      message: `🚨 New Support Ticket from ${vendor.boutiqueName}\n\n*Subject:* ${subject}\n\nLogin to the admin portal to view and resolve.`
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error("Vendor Support API Error:", error);
    return NextResponse.json({ error: "Failed to submit support ticket" }, { status: 500 });
  }
}
