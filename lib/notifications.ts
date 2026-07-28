/**
 * Notifications Utility
 * Handles sending both Emails and WhatsApp messages to vendors and customers.
 * 
 * TODO: Replace the console.log stubs below with actual API calls to your providers 
 * (e.g., Resend for emails, Twilio/Wati/Meta for WhatsApp).
 */

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey || apiKey === 'your_resend_api_key') {
    console.log(`[STUB] 📧 EMAIL to ${to} | Subject: ${subject}`);
    console.log(`[STUB] HTML Content: ${html}`);
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

export async function sendWhatsApp({ phone, message }: { phone: string; message: string }) {
  const apiKey = process.env.WHATSAPP_API_KEY;

  if (!apiKey || apiKey === 'your_whatsapp_api_key') {
    console.log(`[STUB] 💬 WHATSAPP to ${phone}`);
    console.log(`[STUB] Message Content: ${message}`);
    return { success: true, stub: true };
  }

  try {
    // Example using a generic WhatsApp API provider (e.g., Meta Cloud API or Twilio)
    // Replace this URL and payload structure with your actual provider's requirements
    const res = await fetch("https://your-whatsapp-provider.com/api/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phone,
        type: "text",
        text: {
          body: message
        }
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to send WhatsApp message");
    }

    return { success: true };
  } catch (error) {
    console.error("WhatsApp sending failed:", error);
    return { success: false, error };
  }
}
