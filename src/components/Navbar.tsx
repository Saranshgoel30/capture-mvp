
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85 safe-area-inset-top shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-2 group touch-auto">
            <span className="font-bebas text-3xl sm:text-4xl font-bold text-foreground group-hover:text-primary transition-all duration-300 drop-shadow-sm">
              Capture
            </span>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map(item => (
              <Link key={item.to} to={item.to}>
                <Button 
                  variant={isActive(item.to) ? "default" : "ghost"} 
                  className={`flex items-center space-x-2 px-5 py-3 min-h-[48px] transition-all duration-300 hover:scale-105 rounded-lg font-medium ${
                    isActive(item.to) 
                      ? "bg-warm-gradient text-white shadow-warm" 
                      : "hover:bg-amber-50 hover:text-amber-700"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Enhanced User Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block">
                  <NotificationsDropdown />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-full min-h-[48px] min-w-[48px] touch-auto hover:shadow-warm transition-all duration-300">
                      <Avatar className="h-10 w-10 border-2 border-amber-200">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'User'} />
                        <AvatarFallback className="bg-warm-gradient text-white font-bold text-sm">
                          {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-md border shadow-2xl z-50 rounded-xl" align="end">
                    <div className="flex items-center justify-start gap-3 p-4">
                      <Avatar className="h-12 w-12 border-2 border-amber-200">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'User'} />
                        <AvatarFallback className="bg-warm-gradient text-white font-bold">
                          {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-semibold text-base truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer min-h-[48px] px-4 py-3 hover:bg-amber-50 transition-colors">
                        <User className="mr-3 h-5 w-5" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center cursor-pointer min-h-[48px] px-4 py-3 hover:bg-amber-50 transition-colors">
                        <Settings className="mr-3 h-5 w-5" />
                        <span className="font-medium">Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer min-h-[48px] px-4 py-3 hover:bg-red-50 transition-colors">
                      <LogOut className="mr-3 h-5 w-5" />
                      <span className="font-medium">Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 min-h-[48px] px-5 py-3 font-medium hover:bg-amber-50 hover:text-amber-700 rounded-lg">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="group transition-all duration-300 hover:scale-105 min-h-[48px] px-5 py-3 bg-warm-gradient hover:shadow-warm text-white font-semibold rounded-lg">
                    <span className="hidden lg:inline">Sign Up</span>
                    <span className="lg:hidden">Join</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Enhanced Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden h-12 w-12 p-0 min-h-[48px] min-w-[48px] touch-auto rounded-lg hover:bg-amber-50 transition-all duration-300">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-md safe-area-inset-right border-l shadow-2xl">
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile User Info */}
                  {user && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200/50">
                      <Avatar className="h-12 w-12 border-2 border-amber-200">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'User'} />
                        <AvatarFallback className="bg-warm-gradient text-white font-bold">
                          {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-base">{profile?.full_name || 'User'}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Mobile Notifications */}
                  {user && (
                    <div className="sm:hidden pb-4 border-b border-amber-200/50">
                      <NotificationsDropdown />
                    </div>
                  )}
                  
                  {/* Navigation Items */}
                  <div className="space-y-2">
                    {navItems.map(item => (
                      <Link 
                        key={item.to} 
                        to={item.to} 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full"
                      >
                        <Button 
                          variant={isActive(item.to) ? "default" : "ghost"} 
                          className={`w-full justify-start text-left h-16 text-lg rounded-xl transition-all duration-300 ${
                            isActive(item.to) 
                              ? "bg-warm-gradient text-white shadow-warm" 
                              : "hover:bg-amber-50 hover:text-amber-700"
                          }`}
                        >
                          <item.icon className="mr-4 h-6 w-6" />
                          <span className="font-medium">{item.label}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Auth Buttons for Non-Users */}
                  {!user && (
                    <div className="border-t border-amber-200/50 pt-6 space-y-3">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                        <Button variant="ghost" className="w-full justify-start h-16 text-lg rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-all duration-300">
                          <span className="font-medium">Sign In</span>
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full">
                        <Button className="w-full justify-start h-16 text-lg bg-warm-gradient hover:shadow-warm text-white font-semibold rounded-xl transition-all duration-300">
                          <span className="font-medium">Sign Up</span>
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {/* Profile Actions for Users */}
                  {user && (
                    <div className="border-t border-amber-200/50 pt-6 space-y-2">
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="w-full">
                        <Button variant="ghost" className="w-full justify-start h-16 text-lg rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-all duration-300">
                          <User className="mr-4 h-6 w-6" />
                          <span className="font-medium">Profile</span>
                        </Button>
                      </Link>
                      <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="w-full">
                        <Button variant="ghost" className="w-full justify-start h-16 text-lg rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-all duration-300">
                          <Settings className="mr-4 h-6 w-6" />
                          <span className="font-medium">Settings</span>
                        </Button>
                      </Link>
                      <Button 
                        onClick={handleSignOut} 
                        variant="ghost" 
                        className="w-full justify-start h-16 text-lg text-destructive rounded-xl hover:bg-red-50 transition-all duration-300"
                      >
                        <LogOut className="mr-4 h-6 w-6" />
                        <span className="font-medium">Sign out</span>
                      </Button>
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
