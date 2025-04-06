
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
    const { bucketName } = await req.json();
    
    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: 'Bucket name is required' }),
        {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
          status: 400,
        }
      );
    }

    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    console.log(`Attempting to create bucket: ${bucketName}`);

    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabaseClient
      .storage
      .listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists`);
      return new Response(
        JSON.stringify({ 
          message: `Bucket ${bucketName} already exists`,
          exists: true
        }),
        {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
          status: 200,
        }
      );
    }

    // Create the bucket
    const { data, error } = await supabaseClient
      .storage
      .createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });

    if (error) {
      console.error(`Error creating bucket ${bucketName}:`, error);
      throw error;
    }

    console.log(`Successfully created bucket: ${bucketName}`);
    
    return new Response(
      JSON.stringify({ 
        message: `Bucket ${bucketName} created successfully`,
        created: true
      }),
      {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in create_storage_bucket function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
        status: 500,
      }
    );
  }
});
