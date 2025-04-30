
import { getAnimalEmojiForUser } from '@/lib/animalAvatars';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, UserCheck, Loader2 } from 'lucide-react';
import { fetchAllUserProfiles } from '@/lib/supabase/creators';
import { UserProfile } from '@/lib/types';

const FindCreators: React.FC = () => {
  const [creators, setCreators] = useState<UserProfile[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCreators = async () => {
      setIsLoading(true);
      try {
        const profiles = await fetchAllUserProfiles();
        setCreators(profiles);
        setFilteredCreators(profiles);
      } catch (error) {
        console.error('Error loading creators:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCreators();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCreators(creators);
      return;
    }

    const filtered = creators.filter(creator => 
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.roles.some(role => role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      creator.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (creator.location && creator.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredCreators(filtered);
  }, [searchQuery, creators]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bebas tracking-wider mb-2">FIND CREATORS</h1>
              <p className="text-muted-foreground">Connect with talented filmmakers and creative professionals</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative flex-1 mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by name, role, skill, or location..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Discovering talented creators...</p>
            </div>
          )}
          
          {/* Creators Grid */}
          {!isLoading && filteredCreators.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators.map(creator => (
                <Card key={creator.id} className="hover:shadow-md transition-all duration-200">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={creator.avatar || undefined} />
                      <AvatarFallback>{getAnimalEmojiForUser(creator.userId)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{creator.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        {creator.location && (
                          <>
                            <MapPin size={14} className="mr-1" />
                            {creator.location}
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {creator.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{creator.bio}</p>
                    )}
                    
                    {creator.roles.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs uppercase font-medium text-muted-foreground mb-1">Roles</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {creator.roles.map((role, idx) => (
                            <Badge key={idx} variant="outline">{role}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {creator.skills.length > 0 && (
                      <div>
                        <h4 className="text-xs uppercase font-medium text-muted-foreground mb-1">Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {creator.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <UserCheck size={14} className="mr-1" />
                      <span>{creator.stats.projects} projects</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/profile/${creator.userId}`)}
                    >
                      View Profile
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          {/* Empty state */}
          {!isLoading && filteredCreators.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-secondary/40 p-6 rounded-full mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No creators found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                We couldn't find any creators matching your search criteria. Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindCreators;
