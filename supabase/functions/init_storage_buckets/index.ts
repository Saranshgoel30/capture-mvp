
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Create a list of all buckets we need to create
    const buckets = [
      {
        id: 'avatars',
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      },
      {
        id: 'portfolio_images',
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      },
      {
        id: 'portfolio_videos',
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB
        allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime']
      },
      {
        id: 'portfolio_files',
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      }
    ];

    // First get existing buckets
    const { data: existingBuckets, error: listError } = await supabaseClient
      .storage
      .listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }

    const results = [];

    // Create each bucket if it doesn't exist
    for (const bucket of buckets) {
      // Check if bucket already exists
      const bucketExists = existingBuckets?.some(existing => existing.name === bucket.id);
      
      if (!bucketExists) {
        try {
          const { data, error } = await supabaseClient
            .storage
            .createBucket(bucket.id, {
              public: bucket.public,
              fileSizeLimit: bucket.fileSizeLimit,
              allowedMimeTypes: bucket.allowedMimeTypes
            });

          if (error) {
            console.error(`Error creating bucket ${bucket.id}:`, error);
            results.push({ id: bucket.id, status: 'error', message: error.message });
          } else {
            console.log(`Created bucket ${bucket.id}`);
            results.push({ id: bucket.id, status: 'created' });
            
            // Add public policy for the bucket to allow anonymous users to read files
            if (bucket.public) {
              const { error: policyError } = await supabaseClient
                .storage
                .from(bucket.id)
                .createSignedUrl('dummy-file.txt', 60);
                
              if (policyError && !policyError.message.includes('not found')) {
                console.error(`Error testing policy for ${bucket.id}:`, policyError);
              }
            }
          }
        } catch (err) {
          console.error(`Exception creating bucket ${bucket.id}:`, err);
          results.push({ id: bucket.id, status: 'error', message: err.message });
        }
      } else {
        console.log(`Bucket ${bucket.id} already exists`);
        results.push({ id: bucket.id, status: 'exists' });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Storage bucket initialization complete',
        results 
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
