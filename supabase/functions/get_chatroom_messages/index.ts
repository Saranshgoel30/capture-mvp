
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

    // Fetch messages with user information
    const { data: messages, error: messagesError } = await supabaseClient
      .from('chatroom_messages')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .order('created_at');
    
    if (messagesError) {
      throw messagesError;
    }
    
    // Transform the data to match the expected format
    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      user_id: message.user_id,
      created_at: message.created_at,
      user: message.profiles ? {
        full_name: message.profiles.full_name,
        avatar_url: message.profiles.avatar_url
      } : undefined
    }));

    return new Response(
      JSON.stringify(formattedMessages),
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
