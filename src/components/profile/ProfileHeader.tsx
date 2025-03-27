
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, MapPin, Settings, PenSquare, Instagram, Github, Globe, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProfileHeaderProps {
  profile: any;
  isCurrentUser: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isCurrentUser }) => {
  // Helper function to render social media links
  const renderSocialLinks = () => {
    if (!profile.social_links) return null;
    
    const { website, instagram, twitter, github, linkedin, youtube } = profile.social_links || {};
    const links = [];
    
    if (website) links.push({ icon: <Globe size={18} />, url: website.startsWith('http') ? website : `https://${website}` });
    if (instagram) links.push({ icon: <Instagram size={18} />, url: `https://instagram.com/${instagram.replace('@', '')}` });
    if (twitter) links.push({ icon: <Twitter size={18} />, url: `https://twitter.com/${twitter.replace('@', '')}` });
    if (github) links.push({ icon: <Github size={18} />, url: `https://github.com/${github}` });
    if (linkedin) links.push({ icon: <Linkedin size={18} />, url: linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}` });
    if (youtube) links.push({ icon: <Youtube size={18} />, url: youtube.startsWith('http') ? youtube : `https://youtube.com/@${youtube}` });
    
    if (links.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {links.map((link, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {link.icon}
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{link.url}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-secondary/40 backdrop-blur-md p-6 relative">
      {isCurrentUser && (
        <div className="absolute top-4 right-4 flex gap-2">
          <Link to="/settings">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Settings size={16} />
            </Button>
          </Link>
        </div>
      )}
      
      <div className="flex flex-col items-center text-center mb-6">
        <Avatar className="h-32 w-32 mb-4">
          {profile.avatar_url ? (
            <AvatarImage 
              src={profile.avatar_url} 
              alt={profile.full_name} 
              className="object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
            {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : <User size={48} />}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">{profile.full_name || 'Anonymous'}</h1>
        {profile.city && (
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPin size={16} className="mr-1" />
            <span>{profile.city}</span>
          </div>
        )}
        
        {renderSocialLinks()}
      </div>

      {profile.bio ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-muted-foreground">{profile.bio}</p>
        </div>
      ) : isCurrentUser ? (
        <div className="mb-6">
          <Link to="/settings">
            <Button variant="outline" className="w-full">
              <PenSquare className="mr-2 h-4 w-4" />
              Complete Your Profile
            </Button>
          </Link>
        </div>
      ) : null}

      {profile.roles && profile.roles.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Roles</h2>
          <div className="flex flex-wrap gap-2">
            {profile.roles.map((role: string, index: number) => (
              <Badge key={index} variant="secondary">
                {role}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
