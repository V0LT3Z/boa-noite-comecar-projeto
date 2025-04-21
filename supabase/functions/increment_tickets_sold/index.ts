
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    const { event_id, amount } = await req.json();
    
    if (!event_id || !amount) {
      return new Response(
        JSON.stringify({ error: "event_id e amount são obrigatórios" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Atualizar o contador de ingressos vendidos diretamente na tabela
    const { data, error } = await supabaseClient
      .from('events')
      .select('tickets_sold')
      .eq('id', event_id)
      .single();
    
    if (error) {
      throw error;
    }
    
    const currentSold = data.tickets_sold || 0;
    const newSold = currentSold + amount;
    
    const { error: updateError } = await supabaseClient
      .from('events')
      .update({ tickets_sold: newSold })
      .eq('id', event_id);
    
    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, tickets_sold: newSold }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
})
