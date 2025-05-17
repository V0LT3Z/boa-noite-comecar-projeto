
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(
      'ok',
      { headers: corsHeaders }
    );
  }
  
  try {
    // Create a Supabase client with the service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRole
    );
    
    // Parse request body
    const { email } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email is required' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Find user by email
    const { data: users, error: findError } = await supabaseAdmin
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .limit(1)
      .single();
      
    if (findError) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    const userId = users.id;
    
    // Delete the user from auth.users (this will cascade to profiles due to the reference)
    const { error: deleteError } = await supabaseAdmin
      .auth.admin.deleteUser(userId);
      
    if (deleteError) {
      return new Response(
        JSON.stringify({ success: false, error: deleteError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
