
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

  try {
    // Parse request body
    const { content } = await req.json();
    
    if (!content || typeof content !== 'string' || content.trim() === '') {
      throw new Error('Message content is required');
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

    // Get the session to verify the user is authenticated
    const { data: authData, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !authData.user) {
      throw new Error('Authentication required');
    }
    
    const userId = authData.user.id;

    // Insert the new message
    const { data, error } = await supabaseClient
      .from('chatroom_messages')
      .insert({
        content: content.trim(),
        user_id: userId
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify(data),
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
