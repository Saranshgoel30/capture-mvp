
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, MessageSquare, Search, Filter, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCreators } from '@/lib/supabase/creators';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAnimalEmojiForUser } from '@/lib/animalAvatars';

interface Creator {
  id: string;
  full_name: string;
  roles: string[];
  skills: string[];
  city: string;
  bio: string;
  avatar_url?: string;
  portfolio_count?: number;
}

const FindCreators: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  useEffect(() => {
    loadCreators();
  }, []);

  useEffect(() => {
    filterCreators();
  }, [creators, searchTerm, selectedRole, selectedCity]);

  const loadCreators = async () => {
    try {
      setIsLoading(true);
      const creatorsData = await fetchCreators();
      setCreators(creatorsData);
    } catch (error) {
      console.error('Error loading creators:', error);
      toast({
        title: 'Error',
        description: 'Failed to load creators. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterCreators = () => {
    let filtered = creators;

    if (searchTerm) {
      filtered = filtered.filter(creator =>
        creator.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        creator.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(creator => 
        creator.roles.some(role => role.toLowerCase().includes(selectedRole.toLowerCase()))
      );
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter(creator => creator.city === selectedCity);
    }

    setFilteredCreators(filtered);
  };

  const uniqueRoles = Array.from(new Set(creators.flatMap(c => c.roles)));
  const uniqueCities = Array.from(new Set(creators.map(c => c.city).filter(Boolean)));

  return (
    <div className="min-h-screen-mobile bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-6 safe-area-inset-top safe-area-inset-bottom">
        <div className="max-w-7xl mx-auto">
          {/* Header - Mobile Optimized */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bebas font-bold text-foreground mb-4">
              Find Creators
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with talented creators from around the world and bring your projects to life
            </p>
          </div>

          {/* Filters - Mobile First Design */}
          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search creators, skills, or roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {uniqueRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueCities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                Showing {filteredCreators.length} of {creators.length} creators
              </span>
            </div>
          </div>

          {/* Creators Grid - Mobile Optimized */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-muted rounded-full w-16"></div>
                        <div className="h-6 bg-muted rounded-full w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCreators.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4">No creators found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria to find creators that match your needs.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredCreators.map((creator) => (
                <Card key={creator.id} className="group border-0 glass-warm hover:shadow-warm transition-all duration-500 hover:-translate-y-2 card-hover touch-auto">
                  <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto mb-4">
                      <Avatar className="w-20 h-20 mx-auto ring-2 ring-amber-200/50 group-hover:ring-amber-400/70 transition-all duration-300">
                        <AvatarImage src={creator.avatar_url} className="object-cover" />
                        <AvatarFallback className="text-lg bg-warm-gradient text-white">
                          {getAnimalEmojiForUser(creator.id)}
                        </AvatarFallback>
                      </Avatar>
                      
                      {creator.portfolio_count && creator.portfolio_count > 0 && (
                        <div className="absolute -top-1 -right-1 bg-warm-gradient text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                          <Star className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-bebas group-hover:text-warm-gradient transition-all duration-300">
                        {creator.full_name}
                      </h3>
                      
                      {creator.city && (
                        <div className="flex items-center justify-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {creator.city}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    {/* Roles */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                        Roles
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {creator.roles.slice(0, 2).map((role, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-amber-100/50 text-amber-800 border-amber-200/50">
                            {role}
                          </Badge>
                        ))}
                        {creator.roles.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-amber-100/50 text-amber-800 border-amber-200/50">
                            +{creator.roles.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Skills */}
                    {creator.skills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                          Skills
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {creator.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {creator.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{creator.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {creator.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {creator.bio}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-border/50">
                      <Link to={`/profile/${creator.id}`} className="flex-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full transition-all duration-300 hover:border-amber-500 hover:bg-amber-50 min-h-[40px] touch-auto"
                        >
                          <span className="text-xs font-medium">View Profile</span>
                        </Button>
                      </Link>
                      
                      {user && user.id !== creator.id && (
                        <Link to={`/messages/${creator.id}`}>
                          <Button 
                            size="sm" 
                            className="bg-warm-gradient hover:shadow-warm text-white transition-all duration-300 min-h-[40px] min-w-[40px] touch-auto"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindCreators;
