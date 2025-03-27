
import React, { useState, useEffect } from 'react';
import { Menu, X, User, Search, Settings, Home, Film, LogIn, LogOut, Bell } from 'lucide-react';
import Button from './ui-custom/Button';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, The
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const { user, profile, signOut } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();

  // Handle scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Show navbar when scrolling up
      if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Simulate notification count - in a real app, this would come from a backend
  useEffect(() => {
    if (user) {
      // Randomly set between 0 and 5 unread notifications for demo
      setUnreadNotifications(Math.floor(Math.random() * 5));
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(part => part[0]).join('').toUpperCase();
    }
    return user?.email ? user.email[0].toUpperCase() : 'U';
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-4",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg shadow-sm" 
          : "bg-transparent",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-bebas text-2xl tracking-wider text-foreground">
            CAPTURE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-foreground transition-all duration-200 hover:text-primary flex items-center gap-2">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/projects" className="text-sm font-medium text-foreground transition-all duration-200 hover:text-primary flex items-center gap-2">
              <Film size={18} />
              <span>Projects</span>
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="text-sm font-medium text-foreground transition-all duration-200 hover:text-primary flex items-center gap-2">
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className="text-sm font-medium text-foreground transition-all duration-200 hover:text-primary flex items-center gap-2">
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-foreground transition-all duration-200 hover:text-primary flex items-center gap-2">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative"
                    >
                      <Bell size={20} />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {unreadNotifications}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[300px]">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[400px] overflow-auto">
                      {[...Array(unreadNotifications)].map((_, i) => (
                        <DropdownMenuItem key={i} className="cursor-pointer py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">New project match</span>
                            <span className="text-xs text-muted-foreground">
                              A new project matches your skills
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      {unreadNotifications === 0 && (
                        <div className="py-3 px-2 text-center text-muted-foreground">
                          No new notifications
                        </div>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center">
                      <Link to="/settings" className="text-sm text-primary">
                        View all notifications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Avatar */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      {profile?.avatar_url ? (
                        <AvatarImage 
                          src={profile.avatar_url} 
                          alt={profile.full_name || "User"}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {profile?.full_name || user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button size="sm" className="rounded-full" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => navigate('/settings')}
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          )}
          
          <button 
            className="text-foreground p-2 rounded-md focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 p-6 mt-2 mx-4 rounded-lg bg-background/90 backdrop-blur-lg shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground hover:text-primary px-2 py-1 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link 
              to="/projects" 
              className="text-sm font-medium text-foreground hover:text-primary px-2 py-1 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Film size={18} />
              <span>Projects</span>
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-sm font-medium text-foreground hover:text-primary px-2 py-1 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/settings" 
                  className="text-sm font-medium text-foreground hover:text-primary px-2 py-1 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                <button 
                  className="text-sm font-medium text-foreground hover:text-primary px-2 py-1 flex items-center gap-2 w-full text-left"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-sm font-medium text-foreground hover:text-primary px-2 py-1 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
            
            <Button size="sm" className="mt-2 rounded-full" onClick={() => {
              navigate(user ? '/projects' : '/signup');
              setIsMenuOpen(false);
            }}>
              {user ? 'Browse Projects' : 'Sign Up'}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
