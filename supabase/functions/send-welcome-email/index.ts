
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId }: WelcomeEmailRequest = await req.json();
    
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Get user email and trial information
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("trial_end_date")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw profileError;
    }

    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      throw userError || new Error("User not found");
    }

    const userEmail = user.user.email;
    if (!userEmail) {
      throw new Error("User email not found");
    }

    // Format trial end date
    const trialEndDate = profile.trial_end_date 
      ? new Date(profile.trial_end_date)
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // Default 3 days from now
    
    const formattedDate = trialEndDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send welcome email with trial information
    const emailResponse = await resend.emails.send({
      from: "AEROHABITS <onboarding@resend.dev>",
      to: [userEmail],
      subject: "Welcome to AEROHABITS - Your 3-Day Trial Has Started!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Welcome to AEROHABITS</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(to right, #4F46E5, #818CF8);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #fff;
              padding: 30px 20px;
              border-radius: 0 0 8px 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(to right, #4F46E5, #818CF8);
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 4px;
              font-weight: 500;
              margin: 20px 0;
            }
            .highlight {
              background-color: #f8f9ff;
              border-left: 4px solid #4F46E5;
              padding: 15px;
              margin: 20px 0;
            }
            .important {
              color: #4F46E5;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to AEROHABITS!</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for signing up for AEROHABITS! We're excited to have you on board and help you build better habits.</p>
            
            <h2>Your Premium Trial Information</h2>
            <div class="highlight">
              <p>You've been automatically enrolled in our <span class="important">3-day free trial</span> of AEROHABITS Premium.</p>
              <p>Your trial will end on <span class="important">${formattedDate}</span>, at which point your payment method will be automatically charged $9.99 for your first month of Premium access.</p>
            </div>
            
            <h2>What to Expect:</h2>
            <ul>
              <li>Full access to all premium features during your trial</li>
              <li>Automatic conversion to a paid subscription when your trial ends</li>
              <li>You can cancel anytime before your trial ends to avoid being charged</li>
            </ul>
            
            <p>To manage your subscription or cancel before your trial ends, visit your account settings in the app.</p>
            
            <a href="${Deno.env.get('WEBSITE_URL') || 'https://aerohabits.app'}/settings" class="button">Manage Your Subscription</a>
            
            <p>If you have any questions about your trial or subscription, please don't hesitate to reach out to our support team.</p>
            
            <p>Happy habit building!</p>
            <p>The AEROHABITS Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} AEROHABITS. All rights reserved.</p>
            <p>If you did not sign up for AEROHABITS, please disregard this email.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      message: "Welcome email sent successfully",
      emailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
