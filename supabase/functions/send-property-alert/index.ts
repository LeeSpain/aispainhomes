import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PropertyAlertEmail {
  userEmail: string;
  userName: string;
  properties: Array<{
    title: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    sourceUrl: string;
    matchScore: number;
  }>;
  searchName: string;
  alertType: 'new_matches' | 'price_change' | 'digest';
}

const generatePropertyEmailHTML = (data: PropertyAlertEmail): string => {
  const propertiesHTML = data.properties.map(property => `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: white;">
      <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1f2937;">${property.title}</h3>
      <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">📍 ${property.location}</p>
      <div style="display: flex; gap: 16px; margin: 12px 0;">
        <span style="color: #059669; font-weight: bold; font-size: 18px;">€${property.price.toLocaleString()}</span>
        <span style="color: #6b7280;">🛏️ ${property.bedrooms} beds</span>
        <span style="color: #6b7280;">🚿 ${property.bathrooms} baths</span>
        <span style="color: #6b7280;">📐 ${property.area}m²</span>
      </div>
      <div style="margin: 8px 0;">
        <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
          ${property.matchScore}% Match
        </span>
      </div>
      <a href="${property.sourceUrl}" 
         style="display: inline-block; margin-top: 12px; padding: 8px 16px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">
        View Property →
      </a>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Property Matches</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="margin: 0; color: #1f2937; font-size: 28px;">🏡 AI Homes Spain</h1>
        <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">Your Property Matching Assistant</p>
      </div>
      
      <h2 style="color: #1f2937; font-size: 22px; margin: 0 0 16px 0;">
        Hi ${data.userName}! 👋
      </h2>
      
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px 0;">
        We found <strong>${data.properties.length} new ${data.properties.length === 1 ? 'property' : 'properties'}</strong> 
        matching your saved search <strong>"${data.searchName}"</strong>.
      </p>
      
      ${propertiesHTML}
      
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
        <a href="${Deno.env.get('VITE_SUPABASE_URL')}/dashboard" 
           style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">
          View All Properties in Dashboard
        </a>
      </div>
      
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0 0 8px 0;">You're receiving this because you have property alerts enabled.</p>
        <p style="margin: 0;">
          <a href="${Deno.env.get('VITE_SUPABASE_URL')}/email-preferences" style="color: #6b7280;">Manage email preferences</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) throw new Error('Unauthorized');

    const emailData: PropertyAlertEmail = await req.json();

    // Check email preferences
    const { data: emailPrefs } = await supabase
      .from('email_preferences')
      .select('property_alerts, new_match_alerts')
      .eq('user_id', user.id)
      .single();

    if (!emailPrefs?.property_alerts || !emailPrefs?.new_match_alerts) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Email alerts are disabled' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const emailHTML = generatePropertyEmailHTML(emailData);

    const emailResponse = await resend.emails.send({
      from: "AI Homes Spain <alerts@aihomesspain.com>",
      to: [emailData.userEmail],
      subject: `🏡 ${emailData.properties.length} New ${emailData.properties.length === 1 ? 'Property' : 'Properties'} Match Your Search "${emailData.searchName}"`,
      html: emailHTML,
    });

    console.log("Email sent successfully:", emailResponse);

    // Create alert record
    await supabase.from('user_alerts').insert({
      user_id: user.id,
      alert_type: 'new_properties',
      title: `${emailData.properties.length} new ${emailData.properties.length === 1 ? 'property' : 'properties'} match "${emailData.searchName}"`,
      description: `Found ${emailData.properties.length} new ${emailData.properties.length === 1 ? 'property' : 'properties'} matching your saved search.`,
      metadata: { 
        search_name: emailData.searchName,
        property_count: emailData.properties.length,
        properties: emailData.properties.map(p => ({
          title: p.title,
          url: p.sourceUrl
        }))
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Error in send-property-alert:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});