
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

    if (!eventId || !selectedTickets || selectedTickets.length === 0) {
      console.error("Invalid request data:", { eventId, selectedTickets });
      return new Response(
        JSON.stringify({ error: "Dados inválidos. Evento ou ingressos não especificados." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

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

    // Fetch event details
    const { data: event, error: eventError } = await supabaseClient
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();
    
    if (eventError) {
      console.error("Error fetching event:", eventError);
      return new Response(
        JSON.stringify({ error: `Erro ao buscar o evento: ${eventError.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    try {
      // Format ticket information for the checkout page
      const formattedTickets = selectedTickets.map((selected: any) => {
        const ticketType = ticketTypes.find((t) => t.id === selected.ticketId);
        if (!ticketType) {
          throw new Error(`Tipo de ingresso não encontrado: ${selected.ticketId}`);
        }

        return {
          id: ticketType.id,
          name: ticketType.name,
          price: Number(ticketType.price), // Garante que o preço é um número
          quantity: selected.quantity,
        };
      });

      // Return data for the custom checkout page
      const checkoutData = {
        event: {
          id: event.id,
          title: event.title,
          date: new Date(event.date).toLocaleDateString('pt-BR'),
          time: event.time || "00:00",
          location: event.location,
          image: event.image_url,
        },
        tickets: formattedTickets,
        // Generate a unique order ID
        orderId: `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };

      return new Response(JSON.stringify({ success: true, checkoutData }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Error preparing checkout data:", error.message, error.stack);
      return new Response(
        JSON.stringify({ error: `Erro ao preparar dados para checkout: ${error.message}` }),
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
