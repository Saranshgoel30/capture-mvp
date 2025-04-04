
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

    // Create storage buckets
    const { data: avatarsData, error: avatarsError } = await supabaseClient
      .storage
      .createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });

    if (avatarsError) {
      // Bucket might already exist, which is fine
      console.log('Error creating avatars bucket:', avatarsError);
    }

    // Create portfolio image bucket
    const { data: portfolioImagesData, error: portfolioImagesError } = await supabaseClient
      .storage
      .createBucket('portfolio_images', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 5, // 5MB limit
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });

    if (portfolioImagesError) {
      console.log('Error creating portfolio_images bucket:', portfolioImagesError);
    }

    // Create portfolio video bucket
    const { data: portfolioVideosData, error: portfolioVideosError } = await supabaseClient
      .storage
      .createBucket('portfolio_videos', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 50, // 50MB limit
        allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime']
      });

    if (portfolioVideosError) {
      console.log('Error creating portfolio_videos bucket:', portfolioVideosError);
    }

    // Create portfolio files bucket
    const { data: portfolioFilesData, error: portfolioFilesError } = await supabaseClient
      .storage
      .createBucket('portfolio_files', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 10, // 10MB limit
        allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      });

    if (portfolioFilesError) {
      console.log('Error creating portfolio_files bucket:', portfolioFilesError);
    }

    return new Response(
      JSON.stringify({ 
        message: 'Storage buckets created or already exist',
        avatars: avatarsError ? 'Error or already exists' : 'Created',
        portfolio_images: portfolioImagesError ? 'Error or already exists' : 'Created',
        portfolio_videos: portfolioVideosError ? 'Error or already exists' : 'Created',
        portfolio_files: portfolioFilesError ? 'Error or already exists' : 'Created'
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
