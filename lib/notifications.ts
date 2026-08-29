/**
 * Notifications Utility
 * Handles sending both Emails and WhatsApp messages to vendors and customers.
 */
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

export async function sendEmail({ to, subject, html, attachments }: { to: string; subject: string; html: string; attachments?: any[] }) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey || apiKey === 'your_resend_api_key') {
    console.log(`[STUB] 📧 EMAIL to ${to} | Subject: ${subject}`);
    console.log(`[STUB] HTML Content: ${html}`);
    if (attachments) console.log(`[STUB] Attachments included: ${attachments.length}`);
    return { success: true, stub: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LOR <contact@lookonrent.com>", // Make sure to verify your domain with Resend
        to: [to],
        subject: subject,
        html: html,
        attachments: attachments,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to send email");
    }

    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

// Internal helper to upload invoice to S3
async function uploadInvoiceToS3(pdfBuffer: Buffer, orderId: string): Promise<string> {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
    }
  });

  const bucketName = process.env.AWS_S3_BUCKET_NAME || "look-on-rent-images-934646501835";
  const uniqueFileName = `rent-vastra-invoices/${orderId}-${Date.now()}.pdf`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFileName,
    Body: pdfBuffer,
    ContentType: "application/pdf",
  });

  await s3Client.send(command);

  return `https://${bucketName}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${uniqueFileName}`;
}

export async function sendWhatsApp({ phone, message }: { phone: string; message: string }) {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.log(`[STUB] 💬 WHATSAPP to ${phone}`);
    console.log(`[STUB] Message Content: ${message}`);
    return { success: true, stub: true };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone.replace("+", "").replace("91", "") ? `91${phone.replace("+", "").replace(/^91/, "")}` : phone,
        type: "text",
        text: {
          body: message
        }
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to send generic WhatsApp message");
    }

    return { success: true };
  } catch (error) {
    console.error("Generic WhatsApp sending failed:", error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationWhatsApp(orderId: string, customerPhone: string, pdfBuffer?: Buffer) {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.log(`[STUB] 💬 WHATSAPP to ${customerPhone} | Order: ${orderId}`);
    if (pdfBuffer) console.log(`[STUB] PDF attached via S3 simulated URL.`);
    return { success: true, stub: true };
  }

  try {
    let documentUrl = null;
    
    // Upload PDF to S3 first if provided
    if (pdfBuffer) {
      documentUrl = await uploadInvoiceToS3(pdfBuffer, orderId);
    }

    // Call Meta Graph API
    // Replace "order_confirmation_invoice" with your actual approved template name
    const TEMPLATE_NAME = process.env.WHATSAPP_INVOICE_TEMPLATE || "order_confirmation_invoice"; 
    
    const components: any[] = [];
    
    if (documentUrl) {
      components.push({
        type: "header",
        parameters: [
          {
            type: "document",
            document: {
              link: documentUrl,
              filename: `Invoice-${orderId}.pdf`
            }
          }
        ]
      });
    }

    // You might also need a body parameter if your template expects variables like orderId
    // components.push({ type: "body", parameters: [{ type: "text", text: orderId }] });

    const response = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: `91${customerPhone}`, // Ensure Indian country code
        type: "template",
        template: {
          name: TEMPLATE_NAME,
          language: { code: "en" },
          components: components.length > 0 ? components : undefined
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Meta API Error:", errorData);
      throw new Error(`Meta WhatsApp API failed: ${errorData.error?.message || "Unknown error"}`);
    }

    return { success: true };
  } catch (error) {
    console.error("WhatsApp sending failed:", error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationEmail(orderId: string, customerEmail: string, pdfBuffer: Buffer) {
  // Convert buffer to base64 for Resend API
  const base64Pdf = pdfBuffer.toString('base64');

  return sendEmail({
    to: customerEmail,
    subject: `Order Confirmed - Invoice #${orderId}`,
    html: `
      <h2>Your Order is Confirmed!</h2>
      <p>Thank you for choosing Look On Rent.</p>
      <p>Your luxury garments have been reserved. Please find your invoice attached.</p>
      <br/>
      <p>Regards,</p>
      <p>Look On Rent Team</p>
    `,
    attachments: [
      {
        filename: `Invoice_${orderId}.pdf`,
        content: base64Pdf,
      }
    ]
  });
}
