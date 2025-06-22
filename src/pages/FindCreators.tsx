
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, MessageSquare, Search, Filter, Users, Star, Briefcase, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCreators } from '@/lib/supabase/creators';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAnimalEmojiForUser } from '@/lib/animalAvatars';
import FadeIn from '@/components/ui-custom/FadeIn';

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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 sm:pt-24 pb-20 sm:pb-24">
        {/* Professional header section */}
        <div className="bg-gradient-to-b from-amber-50/30 via-orange-50/20 to-transparent border-b border-amber-200/20">
          <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-6xl">
            <FadeIn>
              <div className="text-center space-y-6">
                {/* Professional badge */}
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full glass-warm shadow-lg border border-amber-200/30">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700 tracking-wide">
                    Creative Network
                  </span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bebas font-bold text-foreground leading-tight">
                    Discover Top Creative Talent
                  </h1>
                  <div className="w-12 h-1 bg-warm-gradient rounded-full mx-auto"></div>
                </div>
                
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Connect with verified creative professionals and build your dream team
                </p>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {/* Professional search and filters */}
          <FadeIn delay={0.2}>
            <div className="py-8 sm:py-10 space-y-6">
              {/* Search bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by name, skills, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-base bg-background/80 backdrop-blur-sm border-amber-200/40 focus:border-amber-400 rounded-xl shadow-sm"
                />
              </div>

              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="flex-1">
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="h-12 text-base bg-background/80 backdrop-blur-sm border-amber-200/40 focus:border-amber-400 rounded-xl">
                      <SelectValue placeholder="All Specializations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      {uniqueRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-12 text-base bg-background/80 backdrop-blur-sm border-amber-200/40 focus:border-amber-400 rounded-xl">
                      <SelectValue placeholder="All Locations" />
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

              {/* Results summary */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-amber-50/50 px-4 py-2 rounded-full border border-amber-200/30">
                  <Filter className="h-4 w-4" />
                  <span className="font-medium">
                    {filteredCreators.length} of {creators.length} creators
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Professional creators grid */}
          <FadeIn delay={0.3}>
            <div className="pb-8 sm:pb-12">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse border-0 shadow-sm">
                      <CardHeader className="text-center pb-4">
                        <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4"></div>
                        <div className="h-5 bg-muted rounded mb-2"></div>
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
                <div className="text-center py-20 sm:py-24">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                      <Users className="h-10 w-10 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bebas font-semibold mb-2">No Creators Found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search criteria to discover more talent.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {filteredCreators.map((creator, index) => (
                    <FadeIn key={creator.id} delay={0.1 * (index % 8)}>
                      <Card className="group border-0 glass-warm hover:shadow-warm transition-all duration-500 hover:-translate-y-3 rounded-2xl overflow-hidden">
                        <CardHeader className="text-center pb-6 pt-8">
                          <div className="relative mx-auto mb-6">
                            <Avatar className="w-24 h-24 mx-auto ring-3 ring-amber-200/50 group-hover:ring-amber-400/70 transition-all duration-300 shadow-lg">
                              <AvatarImage src={creator.avatar_url} className="object-cover" />
                              <AvatarFallback className="text-xl bg-warm-gradient text-white font-bold">
                                {getAnimalEmojiForUser(creator.id)}
                              </AvatarFallback>
                            </Avatar>
                            
                            {creator.portfolio_count && creator.portfolio_count > 0 && (
                              <div className="absolute -top-2 -right-2 bg-warm-gradient text-white text-xs rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                                <Star className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="text-lg sm:text-xl font-bebas group-hover:text-warm-gradient transition-all duration-300 leading-tight">
                              {creator.full_name}
                            </h3>
                            
                            {creator.city && (
                              <div className="flex items-center justify-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span className="font-medium">{creator.city}</span>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0 space-y-6 px-6 pb-8">
                          {/* Roles */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Briefcase className="h-4 w-4 text-amber-600" />
                              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                                Specialization
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {creator.roles.slice(0, 2).map((role, index) => (
                                <Badge key={index} className="text-xs bg-amber-100/80 text-amber-800 border-amber-200/60 font-medium px-3 py-1">
                                  {role}
                                </Badge>
                              ))}
                              {creator.roles.length > 2 && (
                                <Badge className="text-xs bg-amber-100/80 text-amber-800 border-amber-200/60 font-medium px-3 py-1">
                                  +{creator.roles.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Skills */}
                          {creator.skills.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Star className="h-4 w-4 text-orange-600" />
                                <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                                  Skills
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {creator.skills.slice(0, 3).map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-700 font-medium px-3 py-1">
                                    {skill}
                                  </Badge>
                                ))}
                                {creator.skills.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 font-medium px-3 py-1">
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
                          <div className="flex gap-3 pt-4 border-t border-amber-200/30">
                            <Link to={`/profile/${creator.id}`} className="flex-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full transition-all duration-300 hover:border-amber-500 hover:bg-amber-50 min-h-[44px] font-medium border-amber-200/60 rounded-xl"
                              >
                                View Profile
                              </Button>
                            </Link>
                            
                            {user && user.id !== creator.id && (
                              <Link to={`/messages/${creator.id}`}>
                                <Button 
                                  size="sm" 
                                  className="bg-warm-gradient hover:shadow-warm text-white transition-all duration-300 min-h-[44px] min-w-[44px] rounded-xl shadow-md"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FindCreators;
