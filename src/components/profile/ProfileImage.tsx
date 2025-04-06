
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, User } from 'lucide-react';
import { uploadProfileImage } from '@/lib/supabase/storage';
import { useToast } from '@/hooks/use-toast';
import { getAnimalAvatarForUser } from '@/lib/animalAvatars';
import { initializeStorage } from '@/lib/supabase';

interface ProfileImageProps {
  avatar?: string | null;
  name?: string;
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  onAvatarUpdate?: (url: string) => void;
  readOnly?: boolean;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ 
  avatar, 
  name, 
  userId,
  size = 'md',
  onAvatarUpdate,
  readOnly = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(avatar);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };
  
  const buttonSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };
  
  const iconSizeClasses = {
    sm: 14,
    md: 18,
    lg: 24
  };

  // Get animal avatar for this user
  const animalAvatar = getAnimalAvatarForUser(userId);
  
  const handleAvatarClick = () => {
    if (readOnly) return;
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear previous error
    setUploadError(null);
    
    // Early validation before uploading
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      console.log("Starting profile image upload for user:", userId);
      
      // Initialize storage if needed
      await initializeStorage();
      
      // Temporary local preview for immediate feedback
      const localPreview = URL.createObjectURL(file);
      setAvatarUrl(localPreview);
      
      // Handle the actual upload
      const imageUrl = await uploadProfileImage(userId, file);
      console.log("Upload completed, image URL:", imageUrl);
      
      // Update the avatar URL once upload is complete
      setAvatarUrl(imageUrl);
      
      if (onAvatarUpdate) {
        onAvatarUpdate(imageUrl);
      }
      
      toast({
        title: "Image uploaded",
        description: "Your profile image has been updated successfully.",
      });
      
      // Release the object URL to avoid memory leaks
      URL.revokeObjectURL(localPreview);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // Set the error message
      setUploadError(error.message || "Failed to upload image");
      
      // Revert to previous avatar on error
      setAvatarUrl(avatar);
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload your profile image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Clear the input so users can select the same image again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Add a cache-busting parameter to the avatar URL
  const displayUrl = avatarUrl ? `${avatarUrl}${avatarUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : animalAvatar;
  
  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        {/* Use the local state for display to avoid flickering during upload */}
        <AvatarImage src={displayUrl} alt={name} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {name ? name.charAt(0).toUpperCase() : <User />}
        </AvatarFallback>
      </Avatar>
      
      {!readOnly && (
        <>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className={`absolute -bottom-2 -right-2 ${buttonSizeClasses[size]} rounded-full ${isUploading ? 'opacity-70' : ''}`}
            onClick={handleAvatarClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 size={iconSizeClasses[size]} className="animate-spin" />
            ) : (
              <Camera size={iconSizeClasses[size]} />
            )}
          </Button>
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            data-testid="avatar-upload"
            // Ensure we accept images from mobile devices
            capture="user"
          />
          
          {uploadError && (
            <div className="text-xs text-red-500 mt-1 max-w-[200px]">
              {uploadError}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileImage;
