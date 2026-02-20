import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "kashifdayal4@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Input validation helpers
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function validateInput(data: ContactRequest): { valid: boolean; error?: string } {
  const { name, email, subject, message } = data;

  if (!name || !email || !subject || !message) {
    return { valid: false, error: "All fields are required" };
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    return { valid: false, error: "Name is required" };
  }
  if (name.length > 100) {
    return { valid: false, error: "Name must be less than 100 characters" };
  }

  if (typeof email !== "string" || !isValidEmail(email)) {
    return { valid: false, error: "Invalid email address" };
  }
  if (email.length > 255) {
    return { valid: false, error: "Email must be less than 255 characters" };
  }

  if (typeof subject !== "string" || subject.trim().length === 0) {
    return { valid: false, error: "Subject is required" };
  }
  if (subject.length > 200) {
    return { valid: false, error: "Subject must be less than 200 characters" };
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    return { valid: false, error: "Message is required" };
  }
  if (message.length > 5000) {
    return { valid: false, error: "Message must be less than 5000 characters" };
  }

  return { valid: true };
}

async function sendEmail(to: string[], subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });
  
  if (!res.ok) {
    const error = await res.text();
    console.error("Resend error:", error);
    throw new Error("Failed to send email");
  }
  
  return res.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactRequest = await req.json();

    // Validate and sanitize inputs
    const validation = validateInput(data);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs for HTML email
    const name = sanitizeHtml(data.name.trim());
    const email = data.email.trim().toLowerCase();
    const subject = sanitizeHtml(data.subject.trim());
    const message = sanitizeHtml(data.message.trim());

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store message in database (using original unsanitized data for storage)
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name: data.name.trim(),
        email: email,
        subject: data.subject.trim(),
        message: data.message.trim(),
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store message");
    }

    console.log("Message stored in database successfully");

    // Send notification email to site owner
    try {
      await sendEmail(
        [OWNER_EMAIL],
        `New Contact Form Submission: ${subject}`,
        `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
            <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">New Contact Form Message</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong style="color: #334155;">Name:</strong> <span style="color: #64748b;">${name}</span></p>
              <p style="margin: 10px 0;"><strong style="color: #334155;">Email:</strong> <span style="color: #64748b;"><a href="mailto:${email}" style="color: #0d9488; text-decoration: none;">${email}</a></span></p>
              <p style="margin: 10px 0;"><strong style="color: #334155;">Subject:</strong> <span style="color: #64748b;">${subject}</span></p>
            </div>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #334155; margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap; color: #475569; line-height: 1.6;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 5px 0;">You can reply directly to: <a href="mailto:${email}" style="color: #0d9488; text-decoration: none;">${email}</a></p>
            </div>
          </div>
        `
      );
      console.log("Notification email sent to owner:", OWNER_EMAIL);
    } catch (emailError) {
      console.error("Failed to send notification email to owner:", emailError);
    }

    // Send confirmation email to the user
    try {
      await sendEmail(
        [email],
        "Thank you for your message!",
        `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0d9488;">Thank You, ${name}!</h2>
            <p>I've received your message and will get back to you as soon as possible.</p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #64748b; font-size: 14px;">Best regards,<br>Kashif Hussain</p>
          </div>
        `
      );
      console.log("Confirmation email sent to:", email);
    } catch (emailError) {
      console.error("Email sending failed (message still saved):", emailError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Message sent successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in send-contact function:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Failed to send message" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
