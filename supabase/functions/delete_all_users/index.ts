
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
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Using service role for admin operations
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );

  try {
    // Get the current user's ID to keep
    const { data: authData, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !authData.user) {
      throw new Error('Authentication required');
    }
    
    const currentUserId = authData.user.id;
    
    console.log("Starting deletion process, preserving user:", currentUserId);
    
    // Delete all profiles except the current user
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .delete()
      .neq('id', currentUserId);
    
    if (profileError) {
      console.error("Error deleting profiles:", profileError);
      throw new Error(`Error deleting profiles: ${profileError.message}`);
    }
    
    console.log("Successfully deleted profiles");
    
    // Call the RPC function to delete users
    const { error: rpcError } = await supabaseClient
      .rpc('delete_users_except_current', { current_user_id: currentUserId });
    
    if (rpcError) {
      console.error("Error in RPC call:", rpcError);
      throw new Error(`Error deleting users: ${rpcError.message}`);
    }

    console.log("Successfully deleted users via RPC");

    return new Response(
      JSON.stringify({ success: true, message: 'All users except your account have been deleted' }),
      {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Function error:", error);
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
