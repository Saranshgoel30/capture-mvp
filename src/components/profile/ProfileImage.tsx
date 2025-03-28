
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, User } from 'lucide-react';
import { uploadProfileImage } from '@/lib/supabase/storage';
import { useToast } from '@/hooks/use-toast';

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
  
  const handleAvatarClick = () => {
    if (readOnly) return;
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const imageUrl = await uploadProfileImage(userId, file);
      
      if (onAvatarUpdate) {
        onAvatarUpdate(imageUrl);
      }
      
      toast({
        title: "Image uploaded",
        description: "Your profile image has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload your profile image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={avatar || ''} alt={name} />
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
          />
        </>
      )}
    </div>
  );
};

export default ProfileImage;
