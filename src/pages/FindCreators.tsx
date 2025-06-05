
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
import { Search, MapPin, UserCheck, Loader2, Users, Filter, Grid3X3, List } from 'lucide-react';
import { fetchAllUserProfiles } from '@/lib/supabase/creators';
import { UserProfile } from '@/lib/types';
import FadeIn from '@/components/ui-custom/FadeIn';

const FindCreators: React.FC = () => {
  const [creators, setCreators] = useState<UserProfile[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const navigate = useNavigate();

  // Get unique roles from creators
  const uniqueRoles = React.useMemo(() => {
    const roles = creators.flatMap(creator => creator.roles);
    return ['all', ...Array.from(new Set(roles))];
  }, [creators]);

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
    let filtered = creators;

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(creator => 
        creator.roles.some(role => role.toLowerCase() === selectedRole.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(creator => 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.roles.some(role => role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        creator.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (creator.location && creator.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredCreators(filtered);
  }, [searchQuery, creators, selectedRole]);

  const CreatorCard = ({ creator }: { creator: UserProfile }) => (
    <Card className="group hover:shadow-warm transition-all duration-500 hover:-translate-y-2 glass border-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-amber-200/50 group-hover:ring-amber-300/70 transition-all duration-300">
              <AvatarImage src={creator.avatar || undefined} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800">
                {getAnimalEmojiForUser(creator.userId)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md" />
          </div>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bebas tracking-wide group-hover:text-amber-700 transition-colors duration-300">
              {creator.name}
            </CardTitle>
            {creator.location && (
              <CardDescription className="flex items-center mt-1 text-amber-600/70">
                <MapPin size={12} className="mr-1.5 flex-shrink-0" />
                <span className="truncate">{creator.location}</span>
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {creator.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{creator.bio}</p>
        )}
        
        <div className="space-y-3">
          {creator.roles.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wider">Specialties</h4>
              <div className="flex flex-wrap gap-1.5">
                {creator.roles.slice(0, 3).map((role, idx) => (
                  <Badge key={idx} variant="default" className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs font-medium">
                    {role}
                  </Badge>
                ))}
                {creator.roles.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{creator.roles.length - 3} more</Badge>
                )}
              </div>
            </div>
          )}
          
          {creator.skills.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wider">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {creator.skills.slice(0, 4).map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100">
                    {skill}
                  </Badge>
                ))}
                {creator.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">+{creator.skills.length - 4} more</Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="relative border-t border-amber-100/50 bg-gradient-to-r from-amber-50/30 to-orange-50/30 backdrop-blur-sm">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3 text-sm text-amber-600">
            <div className="flex items-center gap-1">
              <UserCheck size={14} />
              <span className="font-medium">{creator.stats.projects}</span>
              <span className="text-xs opacity-75">projects</span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6"
            onClick={() => navigate(`/profile/${creator.userId}`)}
          >
            View Profile
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        <div className="max-w-7xl mx-auto relative">
          <FadeIn>
            <div className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-200/50">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Discover Talent</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bebas tracking-wider mb-4">
                <span className="block text-foreground">FIND</span>
                <span className="block text-warm-gradient">CREATORS</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Connect with talented filmmakers and creative professionals ready to bring your vision to life
              </p>
            </div>
          </FadeIn>
          
          {/* Search and Filters */}
          <FadeIn delay={0.2}>
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                <Input 
                  placeholder="Search by name, role, skill, or location..." 
                  className="pl-12 pr-4 py-4 text-lg glass border-amber-200/50 focus:border-amber-400 rounded-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Filters and View Toggle */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-amber-600" />
                    <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="bg-white/80 border border-amber-200/50 rounded-lg px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    >
                      {uniqueRoles.map(role => (
                        <option key={role} value={role}>
                          {role === 'all' ? 'All Roles' : role}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="text-sm text-amber-600 font-medium">
                    {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} found
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-1 glass rounded-lg border border-amber-200/50">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-amber-600'}
                  >
                    <Grid3X3 size={16} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-amber-600'}
                  >
                    <List size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <FadeIn>
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full animate-pulse"></div>
                  <Loader2 className="h-8 w-8 text-amber-600 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-amber-600 font-medium">Discovering talented creators...</p>
              </div>
            </FadeIn>
          )}
          
          {/* Creators Grid */}
          {!isLoading && filteredCreators.length > 0 && (
            <FadeIn delay={0.3}>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}>
                {filteredCreators.map((creator, index) => (
                  <FadeIn key={creator.id} delay={0.1 * (index % 9)}>
                    <CreatorCard creator={creator} />
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          )}
          
          {/* Empty State */}
          {!isLoading && filteredCreators.length === 0 && (
            <FadeIn>
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-amber-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bebas tracking-wide text-amber-700">No Creators Found</h3>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't find any creators matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRole('all');
                  }}
                  className="border-amber-300 text-amber-600 hover:bg-amber-50"
                >
                  Clear Filters
                </Button>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FindCreators;
