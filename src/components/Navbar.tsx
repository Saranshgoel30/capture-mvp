
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import { Menu, X, User, LogOut, Settings, Briefcase, Users, MessageCircle, ArrowRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    profile,
    signOut
  } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Following Gestalt's Law - group related navigation items
  const publicNavItems = [{
    to: '/projects',
    label: 'Projects',
    icon: Briefcase
  }, {
    to: '/find-creators',
    label: 'Creators',
    icon: Users
  }];
  const authenticatedNavItems = [{
    to: '/projects',
    label: 'Projects',
    icon: Briefcase
  }, {
    to: '/find-creators',
    label: 'Creators',
    icon: Users
  }, {
    to: '/messages',
    label: 'Messages',
    icon: MessageCircle
  }];
  const navItems = user ? authenticatedNavItems : publicNavItems;
  
  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo - Optimized for mobile */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <span className="font-bebas text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              Capture
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(item => (
              <Link key={item.to} to={item.to}>
                <Button 
                  variant={isActive(item.to) ? "default" : "ghost"} 
                  className="flex items-center space-x-2 px-3 lg:px-4 py-2 transition-all duration-200 hover:scale-105"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Actions - Optimized for mobile */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <NotificationsDropdown />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'User'} />
                        <AvatarFallback className="bg-primary/20 text-xs sm:text-sm">
                          {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 sm:w-56 bg-background border shadow-lg z-50" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="group transition-all duration-200 hover:scale-105">
                    <span className="hidden lg:inline">Sign Up</span>
                    <span className="lg:hidden">Join</span>
                    <ArrowRight className="ml-1 lg:ml-2 h-3 w-3 lg:h-4 lg:w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button - Using Sheet for better mobile UX */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 sm:w-80 bg-background">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map(item => (
                    <Link 
                      key={item.to} 
                      to={item.to} 
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full"
                    >
                      <Button 
                        variant={isActive(item.to) ? "default" : "ghost"} 
                        className="w-full justify-start text-left h-12"
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  
                  {!user && (
                    <>
                      <div className="border-t pt-4 mt-4 space-y-2">
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                          <Button variant="ghost" className="w-full justify-start h-12">
                            Sign In
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full">
                          <Button className="w-full justify-start h-12">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
