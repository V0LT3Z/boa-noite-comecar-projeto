
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Lidar com requisições OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, email, eventDetails, ticketsInfo } = await req.json();

    if (!orderId || !email || !eventDetails || !ticketsInfo) {
      throw new Error("Dados insuficientes para enviar email");
    }

    console.log(`Preparando para enviar email para ${email}`);

    // Inicializar cliente do Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY não configurada");
    }

    // Construir o conteúdo do email
    const ticketsHtml = ticketsInfo.map((ticket: any) => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${ticket.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${ticket.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">R$ ${ticket.price.toFixed(2)}</td>
      </tr>`
    ).join("");

    const totalValue = ticketsInfo.reduce(
      (sum: number, ticket: any) => sum + (ticket.price * ticket.quantity),
      0
    );

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 10px; background-color: #f3f4f6; }
        .total { font-weight: bold; margin-top: 20px; text-align: right; }
        .button { display: inline-block; background-color: #4f46e5; color: white; padding: 10px 16px; text-decoration: none; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Confirmação de Compra</h2>
          <p>Obrigado pela sua compra!</p>
        </div>
        
        <p>Olá,</p>
        <p>Sua compra para <strong>${eventDetails.title}</strong> foi confirmada.</p>
        
        <h3>Detalhes do Evento:</h3>
        <p>
          <strong>Data:</strong> ${eventDetails.date}<br>
          <strong>Local:</strong> ${eventDetails.location}
        </p>
        
        <h3>Seus Ingressos:</h3>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${ticketsHtml}
          </tbody>
        </table>
        
        <p class="total">Total: R$ ${totalValue.toFixed(2)}</p>
        
        <p>Seus ingressos estão disponíveis na área "Meus Ingressos" do aplicativo.</p>
        
        <p>Para acessar o evento, basta apresentar o QR Code de cada ingresso na entrada.</p>
        
        <p>Atenciosamente,<br>Equipe de Eventos</p>
        
        <div class="footer">
          <p>Este é um email automático, por favor não responda.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Enviar email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "EventHub <no-reply@resend.dev>",
        to: email,
        subject: `Confirmação de Compra - ${eventDetails.title}`,
        html: emailHtml
      })
    });

    const resendResponse = await response.json();
    console.log("Resposta do Resend:", resendResponse);

    if (!response.ok) {
      throw new Error(`Falha ao enviar email: ${response.statusText}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Email de confirmação enviado com sucesso"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro:", error.message);
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
