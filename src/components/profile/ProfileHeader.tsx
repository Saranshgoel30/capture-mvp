
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, MapPin, Mail } from 'lucide-react';
import ProfileImage from './ProfileImage'; // Import the new component

const ProfileHeader = ({ profile, isCurrentUser }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center mb-6">
          <ProfileImage 
            avatar={profile.avatar_url} 
            name={profile.full_name} 
            userId={profile.id}
            size="lg"
            readOnly
          />
          
          <h2 className="text-2xl font-bold mt-4">{profile.full_name || 'Anonymous Creator'}</h2>
          
          {profile.city && (
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin size={14} className="mr-1" />
              <span>{profile.city}</span>
            </div>
          )}
          
          {!isCurrentUser && (
            <div className="mt-4">
              <Link to={`/messages/${profile.id}`}>
                <Button variant="default" size="sm" className="gap-2">
                  <Mail size={14} />
                  Message
                </Button>
              </Link>
            </div>
          )}
          
          {isCurrentUser && (
            <div className="mt-4">
              <Link to="/settings">
                <Button variant="outline" size="sm" className="gap-2">
                  <Pencil size={14} />
                  Edit Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {profile.bio && (
          <div className="mb-6">
            <p className="text-muted-foreground whitespace-pre-line">{profile.bio}</p>
          </div>
        )}
        
        {profile.roles && profile.roles.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Roles</h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.roles.map((role, idx) => (
                <Badge key={idx} variant="outline">{role}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
