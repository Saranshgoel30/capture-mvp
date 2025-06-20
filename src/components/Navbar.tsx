
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import { Menu, X, User, LogOut, Settings, Briefcase, Users, MessageCircle, ArrowRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const publicNavItems = [
    { to: '/projects', label: 'Projects', icon: Briefcase },
    { to: '/find-creators', label: 'Creators', icon: Users }
  ];
  
  const authenticatedNavItems = [
    { to: '/projects', label: 'Projects', icon: Briefcase },
    { to: '/find-creators', label: 'Creators', icon: Users },
    { to: '/messages', label: 'Messages', icon: MessageCircle }
  ];
  
  const navItems = user ? authenticatedNavItems : publicNavItems;
  
  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset-top">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Logo - Mobile Optimized */}
          <Link to="/" className="flex items-center space-x-2 group touch-auto">
            <span className="font-bebas text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
              Capture
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => (
              <Link key={item.to} to={item.to}>
                <Button 
                  variant={isActive(item.to) ? "default" : "ghost"} 
                  className="flex items-center space-x-2 px-4 py-2 min-h-[44px] transition-all duration-200 hover:scale-105"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Actions - Mobile Optimized */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block">
                  <NotificationsDropdown />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full min-h-[44px] min-w-[44px] touch-auto">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'User'} />
                        <AvatarFallback className="bg-primary/20 text-sm">
                          {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-background border shadow-lg z-50" align="end">
                    <div className="flex items-center justify-start gap-2 p-3">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer min-h-[44px]">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center cursor-pointer min-h-[44px]">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer min-h-[44px]">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105 min-h-[44px]">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="group transition-all duration-200 hover:scale-105 min-h-[44px]">
                    <span className="hidden lg:inline">Sign Up</span>
                    <span className="lg:hidden">Join</span>
                    <ArrowRight className="ml-1 lg:ml-2 h-3 w-3 lg:h-4 lg:w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden h-10 w-10 p-0 min-h-[44px] min-w-[44px] touch-auto">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background safe-area-inset-right">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Notifications */}
                  {user && (
                    <div className="sm:hidden pb-4 border-b">
                      <NotificationsDropdown />
                    </div>
                  )}
                  
                  {navItems.map(item => (
                    <Link 
                      key={item.to} 
                      to={item.to} 
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full"
                    >
                      <Button 
                        variant={isActive(item.to) ? "default" : "ghost"} 
                        className="w-full justify-start text-left h-14 text-base"
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  
                  {!user && (
                    <div className="border-t pt-4 mt-4 space-y-3">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                        <Button variant="ghost" className="w-full justify-start h-14 text-base">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full">
                        <Button className="w-full justify-start h-14 text-base">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
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
