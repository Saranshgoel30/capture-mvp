
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
    // Create a Supabase client with the service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Also create a regular client to check if the user is authenticated
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Check if the user is authenticated (optional for bucket creation but good for security)
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    // Log any auth errors but continue (we'll use admin client anyway)
    if (authError) {
      console.warn("Authentication check failed, but proceeding with admin rights:", authError.message);
    }

    console.log("Starting storage bucket initialization...");

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
    const { data: existingBuckets, error: listError } = await supabaseAdmin
      .storage
      .listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }

    console.log("Existing buckets:", existingBuckets);
    const results = [];

    // Create each bucket if it doesn't exist
    for (const bucket of buckets) {
      try {
        // Check if bucket already exists
        const bucketExists = existingBuckets?.some(existing => existing.name === bucket.id);
        
        if (!bucketExists) {
          console.log(`Creating bucket ${bucket.id}...`);
          const { data, error } = await supabaseAdmin
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
            console.log(`Created bucket ${bucket.id} successfully`);
            results.push({ id: bucket.id, status: 'created' });
            
            // Set up RLS policies for the bucket to allow public access
            if (bucket.public) {
              try {
                // First, try to add a policy to allow public downloads
                const { error: policyError } = await supabaseAdmin.rpc('create_storage_policy', {
                  bucket_name: bucket.id,
                  policy_name: `${bucket.id}_public_select`,
                  definition: 'true', // Anyone can download
                  operation: 'SELECT',
                });
                
                if (policyError) {
                  console.warn(`Warning setting SELECT policy for ${bucket.id}:`, policyError);
                }
                
                // Add policy for authenticated users to upload
                const { error: insertPolicyError } = await supabaseAdmin.rpc('create_storage_policy', {
                  bucket_name: bucket.id,
                  policy_name: `${bucket.id}_auth_insert`,
                  definition: '(auth.role() = \'authenticated\')', // Only authenticated users can upload
                  operation: 'INSERT',
                });
                
                if (insertPolicyError) {
                  console.warn(`Warning setting INSERT policy for ${bucket.id}:`, insertPolicyError);
                }
                
                // Add policy for users to update/delete their own files
                const { error: updatePolicyError } = await supabaseAdmin.rpc('create_storage_policy', {
                  bucket_name: bucket.id,
                  policy_name: `${bucket.id}_auth_update`,
                  definition: '(auth.uid() = owner)', // Only the owner can update
                  operation: 'UPDATE',
                });
                
                if (updatePolicyError) {
                  console.warn(`Warning setting UPDATE policy for ${bucket.id}:`, updatePolicyError);
                }
                
                // Add policy for users to delete their own files
                const { error: deletePolicyError } = await supabaseAdmin.rpc('create_storage_policy', {
                  bucket_name: bucket.id,
                  policy_name: `${bucket.id}_auth_delete`,
                  definition: '(auth.uid() = owner)', // Only the owner can delete
                  operation: 'DELETE',
                });
                
                if (deletePolicyError) {
                  console.warn(`Warning setting DELETE policy for ${bucket.id}:`, deletePolicyError);
                }
                
              } catch (policyErr) {
                console.warn(`Exception setting policy for ${bucket.id}:`, policyErr);
              }
            }
          }
        } else {
          console.log(`Bucket ${bucket.id} already exists`);
          results.push({ id: bucket.id, status: 'exists' });
        }
      } catch (err) {
        console.error(`Exception processing bucket ${bucket.id}:`, err);
        results.push({ id: bucket.id, status: 'error', message: err.message });
      }
    }

    console.log("Bucket initialization completed with results:", results);
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
    console.error("Fatal error in init_storage_buckets function:", error);
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
