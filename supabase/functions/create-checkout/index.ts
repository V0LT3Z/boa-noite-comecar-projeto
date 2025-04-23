
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Creating checkout session...");
    const { eventId, selectedTickets } = await req.json()
    console.log(`Request data: eventId=${eventId}, tickets=${JSON.stringify(selectedTickets)}`);

    if (!eventId || !selectedTickets || selectedTickets.length === 0) {
      console.error("Invalid request data:", { eventId, selectedTickets });
      return new Response(
        JSON.stringify({ error: "Dados inválidos. Evento ou ingressos não especificados." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Use the hardcoded Stripe key for now to fix the immediate issue
    const stripeKey = "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";
    
    console.log("Using provided Stripe key, length:", stripeKey.length);
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    })
    console.log("Stripe client initialized successfully");

    // Create a Supabase client to access the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials not found");
      console.error("Environment variables:", Object.keys(Deno.env.toObject()));
      return new Response(
        JSON.stringify({ error: "Configuração do Supabase não encontrada." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client initialized");

    // Fetch information about the selected tickets
    console.log("Fetching ticket types...");
    const { data: ticketTypes, error: ticketError } = await supabaseClient
      .from("ticket_types")
      .select("*")
      .in(
        "id",
        selectedTickets.map((t: any) => t.ticketId)
      );

    if (ticketError) {
      console.error("Error fetching ticket types:", ticketError);
      return new Response(
        JSON.stringify({ error: `Erro ao buscar ingressos: ${ticketError.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    if (!ticketTypes || ticketTypes.length === 0) {
      console.error("No ticket types found for IDs:", selectedTickets.map((t: any) => t.ticketId));
      return new Response(
        JSON.stringify({ error: "Nenhum tipo de ingresso encontrado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    console.log(`Found ${ticketTypes.length} ticket types`);

    // Create line items for Stripe
    try {
      console.log("Creating line items...");
      const lineItems = selectedTickets.map((selected: any) => {
        const ticketType = ticketTypes.find((t) => t.id === selected.ticketId);
        if (!ticketType) {
          throw new Error(`Tipo de ingresso não encontrado: ${selected.ticketId}`);
        }

        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: ticketType.name,
              description: ticketType.description || undefined,
            },
            unit_amount: Math.round(ticketType.price * 100), // Convert to cents
          },
          quantity: selected.quantity,
        };
      });
      console.log("Line items created successfully");

      // Create checkout session
      console.log("Creating Stripe checkout session...");
      const origin = req.headers.get("origin") || "http://localhost:3000";
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${origin}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pagamento-cancelado`,
        metadata: {
          eventId,
          tickets: JSON.stringify(selectedTickets),
        },
      });
      console.log("Checkout session created:", session.id);

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Error in checkout session creation:", error.message, error.stack);
      return new Response(
        JSON.stringify({ error: `Erro ao criar sessão de pagamento: ${error.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in create-checkout:", error.message, error.stack);
    return new Response(JSON.stringify({ error: `Erro inesperado: ${error.message}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
})
