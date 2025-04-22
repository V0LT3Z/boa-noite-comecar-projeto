
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@1.1.0";
import React from "npm:react@18.2.0";
import { renderToString } from "npm:react-dom/server@18.2.0";

// Templates
import WelcomeEmail from "./templates/welcome-email.tsx";
import PurchaseConfirmationEmail from "./templates/purchase-confirmation-email.tsx";
import PasswordResetEmail from "./templates/password-reset-email.tsx";
import EventNotificationEmail from "./templates/event-notification-email.tsx";
import RefundConfirmationEmail from "./templates/refund-confirmation-email.tsx";
import TicketSaleEmail from "./templates/ticket-sale-email.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    
    let emailHtml = "";
    let subject = "";
    const from = "Lovue Tickets <noreply@seudominio.com>";
    
    switch(type) {
      case "welcome":
        subject = "Bem-vindo(a) ao Lovue Tickets!";
        emailHtml = renderToString(React.createElement(WelcomeEmail, { 
          name: data.name 
        }));
        break;
      
      case "purchase-confirmation":
        subject = "Confirmação de compra - Lovue Tickets";
        emailHtml = renderToString(React.createElement(PurchaseConfirmationEmail, { 
          name: data.name,
          eventName: data.eventName,
          eventDate: data.eventDate,
          ticketInfo: data.ticketInfo,
          orderNumber: data.orderNumber,
          total: data.total
        }));
        break;
      
      case "password-reset":
        subject = "Recuperação de senha - Lovue Tickets";
        emailHtml = renderToString(React.createElement(PasswordResetEmail, { 
          name: data.name,
          resetLink: data.resetLink
        }));
        break;
      
      case "event-notification":
        subject = data.notificationType === "reminder" 
          ? `Lembrete: ${data.eventName} acontecerá em breve!` 
          : data.notificationType === "change" 
            ? `Alteração no evento: ${data.eventName}`
            : `Cancelamento do evento: ${data.eventName}`;
        
        emailHtml = renderToString(React.createElement(EventNotificationEmail, { 
          name: data.name,
          eventName: data.eventName,
          eventDate: data.eventDate,
          notificationType: data.notificationType,
          message: data.message
        }));
        break;
      
      case "refund-confirmation":
        subject = "Confirmação de reembolso - Lovue Tickets";
        emailHtml = renderToString(React.createElement(RefundConfirmationEmail, { 
          name: data.name,
          eventName: data.eventName,
          refundAmount: data.refundAmount,
          refundDate: data.refundDate
        }));
        break;
      
      case "ticket-sale":
        subject = "Seu ingresso foi vendido - Lovue Tickets";
        emailHtml = renderToString(React.createElement(TicketSaleEmail, { 
          name: data.name,
          eventName: data.eventName,
          buyerName: data.buyerName,
          saleAmount: data.saleAmount,
          ticketType: data.ticketType
        }));
        break;
      
      default:
        throw new Error(`Email type not supported: ${type}`);
    }

    console.log(`Sending ${type} email to ${data.email}`);
    
    const emailResult = await resend.emails.send({
      from,
      to: data.email,
      subject,
      html: emailHtml
    });

    console.log("Email sent successfully:", emailResult);
    
    return new Response(JSON.stringify({ 
      success: true,
      id: emailResult.id
    }), { 
      status: 200, 
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      } 
    });
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), { 
      status: 500, 
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      } 
    });
  }
});
