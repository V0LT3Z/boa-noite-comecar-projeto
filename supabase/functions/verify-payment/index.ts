
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID não fornecido");

    // Inicializar Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Buscar detalhes da sessão
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) throw new Error("Sessão não encontrada");

    // Verificar se o pagamento foi bem-sucedido
    if (session.payment_status !== "paid") {
      throw new Error("Pagamento não confirmado");
    }

    // Criar cliente Supabase para buscar detalhes do evento e ingressos
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Extrair IDs do metadata
    const eventId = session.metadata?.eventId;
    const ticketsData = JSON.parse(session.metadata?.tickets || "[]");

    // Buscar detalhes do evento
    const { data: event, error: eventError } = await supabaseClient
      .from("events")
      .select("title, date, location")
      .eq("id", eventId)
      .single();

    if (eventError) throw eventError;

    // Buscar detalhes dos tickets
    const { data: ticketTypes, error: ticketError } = await supabaseClient
      .from("ticket_types")
      .select("*")
      .in("id", ticketsData.map((t: any) => t.ticketId));

    if (ticketError) throw ticketError;

    // Calcular total e formatar resposta
    const tickets = ticketsData.map((selected: any) => {
      const ticketType = ticketTypes.find((t) => t.id === selected.ticketId);
      return {
        name: ticketType?.name,
        quantity: selected.quantity,
        price: ticketType?.price
      };
    });

    const total = tickets.reduce((sum: number, ticket: any) => 
      sum + (ticket.price * ticket.quantity), 0
    );

    return new Response(JSON.stringify({
      event,
      tickets,
      total,
      paymentMethod: session.payment_method_types[0]
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
