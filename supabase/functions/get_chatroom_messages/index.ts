
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client with the Auth context of the logged in user
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );

  try {
    // Get messages with profile details
    const { data, error } = await supabaseClient
      .from('chatroom_messages')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles:user_id (id, full_name)
      `)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Format the response for the client
    const formattedData = data.map(msg => ({
      id: msg.id,
      content: msg.content,
      created_at: msg.created_at,
      user_id: msg.user_id,
      full_name: msg.profiles?.full_name
    }));

    return new Response(
      JSON.stringify(formattedData),
      {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
        status: 400,
      }
    );
  }
});
