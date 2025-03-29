
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, MapPin, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileImage from './ProfileImage';

interface ProfileHeaderProps {
  profile: any;
  isCurrentUser: boolean;
  onMessageClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isCurrentUser, onMessageClick }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex flex-col items-center">
            <ProfileImage 
              avatar={profile.avatar_url} 
              name={profile.full_name} 
              userId={profile.id}
              size="lg"
              readOnly={!isCurrentUser}
            />
            
            <div className="mt-4 flex flex-col gap-2">
              {!isCurrentUser && (
                <Button variant="default" onClick={onMessageClick} className="gap-2">
                  <MessageSquare size={14} />
                  Message
                </Button>
              )}
              
              {isCurrentUser && (
                <Link to="/settings">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil size={14} />
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{profile.full_name || 'Anonymous Creator'}</h2>
            
            {profile.city && (
              <div className="flex justify-center md:justify-start items-center text-muted-foreground mt-1 mb-4">
                <MapPin size={14} className="mr-1" />
                <span>{profile.city}</span>
              </div>
            )}
            
            {profile.bio && (
              <div className="mb-6">
                <p className="text-muted-foreground whitespace-pre-line">{profile.bio}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.roles && profile.roles.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Roles</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.roles.map((role: string, idx: number) => (
                      <Badge key={idx} variant="outline">{role}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
