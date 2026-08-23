import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please provide all required fields (name, email, subject, message)." },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Look On Rent <contact@lookonrent.com>',
        to: 'contact@lookonrent.com',
        replyTo: email,
        subject: `New Contact Inquiry: ${subject}`,
        html: `
          <h3>New Contact Inquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <br/>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email via Resend:", emailError);
      // We still return success since it's saved in the DB
    }

    return NextResponse.json(
      { success: true, message: "Your inquiry has been submitted successfully.", data: contactMessage },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting your message. Please try again later." },
      { status: 500 }
    );
  }
}
