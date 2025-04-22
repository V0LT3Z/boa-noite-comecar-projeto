
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Creating checkout session...");
    const { eventId, selectedTickets } = await req.json()
    console.log(`Request data: eventId=${eventId}, tickets=${JSON.stringify(selectedTickets)}`);

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY is not set or not accessible");
      throw new Error("Stripe key not configured");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    })
    console.log("Stripe client initialized with key length:", stripeKey.length);

    // Create a Supabase client to access the database
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    )
    console.log("Supabase client initialized");

    // Fetch information about the selected tickets
    const { data: ticketTypes, error: ticketError } = await supabaseClient
      .from("ticket_types")
      .select("*")
      .in(
        "id",
        selectedTickets.map((t: any) => t.ticketId)
      )

    if (ticketError) {
      console.error("Error fetching ticket types:", ticketError);
      throw ticketError;
    }
    if (!ticketTypes) {
      console.error("No ticket types found");
      throw new Error("Nenhum tipo de ingresso encontrado");
    }
    console.log(`Found ${ticketTypes.length} ticket types`);

    // Create line items for Stripe
    const lineItems = selectedTickets.map((selected: any) => {
      const ticketType = ticketTypes.find((t) => t.id === selected.ticketId)
      if (!ticketType) throw new Error(`Tipo de ingresso não encontrado: ${selected.ticketId}`)

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
      }
    })
    console.log("Line items created:", JSON.stringify(lineItems));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pagamento-cancelado`,
      metadata: {
        eventId,
        tickets: JSON.stringify(selectedTickets),
      },
    })
    console.log("Checkout session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})
