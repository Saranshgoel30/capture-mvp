import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Bell, MessageSquare } from 'lucide-react';
import { buttonVariants } from './ui/button';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from '@/hooks/use-mobile';
import { getAnimalAvatarForUser } from '@/lib/animalAvatars';
const NavbarOriginal = ({
  NotificationsComponent
}: {
  NotificationsComponent?: React.ComponentType;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    user,
    profile,
    logout
  } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Close menu when changing routes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const userAvatar = user && profile?.avatar_url ? profile.avatar_url : user ? getAnimalAvatarForUser(user.id) : '';
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  return <nav className="fixed top-0 left-0 right-0 bg-background border-b border-border/40 z-50 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl md:text-2xl font-bebas tracking-wide text-primary">
            <span className="block">CAPTURE</span>
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/projects" className={`px-4 py-2 rounded-md transition-colors ${isActive('/projects') ? 'bg-secondary text-foreground' : 'hover:bg-secondary/50'}`}>
              Projects
            </Link>
            <Link to="/find-creators" className={`px-4 py-2 rounded-md transition-colors ${isActive('/find-creators') ? 'bg-secondary text-foreground' : 'hover:bg-secondary/50'}`}>
              Find Creators
            </Link>
            <Link to="/chatroom" className={`px-4 py-2 rounded-md transition-colors ${isActive('/chatroom') ? 'bg-secondary text-foreground' : 'hover:bg-secondary/50'}`}>
              Community
            </Link>
          </div>
          
          {/* Right section - auth, theme, etc. */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {user ? <div className="flex items-center space-x-2">
                {NotificationsComponent && <NotificationsComponent />}
                
                <Link to="/messages" className={`${buttonVariants({
              variant: 'ghost',
              size: 'icon'
            })} relative`}>
                  <MessageSquare className="h-5 w-5" />
                </Link>
                
                <div className="relative group">
                  <div className="flex items-center space-x-1 cursor-pointer p-1 rounded-full hover:bg-secondary" onClick={() => setMenuOpen(!menuOpen)}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAvatar} />
                      <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  
                  {/* Dropdown menu */}
                  {menuOpen && <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-1 z-20">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link to={`/profile/${user.id}`} className="block px-4 py-2 text-sm hover:bg-secondary w-full text-left" onClick={() => setMenuOpen(false)}>
                        Profile
                      </Link>
                      <Link to="/my-projects" className="block px-4 py-2 text-sm hover:bg-secondary w-full text-left" onClick={() => setMenuOpen(false)}>
                        My Projects
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-secondary w-full text-left" onClick={() => setMenuOpen(false)}>
                        Settings
                      </Link>
                      <button className="block px-4 py-2 text-sm hover:bg-secondary w-full text-left text-destructive" onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}>
                        Sign Out
                      </button>
                    </div>}
                </div>
              </div> : <div className="flex items-center space-x-2">
                <Link to="/login" className={buttonVariants({
              variant: "outline",
              size: "sm"
            })}>
                  Sign In
                </Link>
                <Link to="/signup" className={buttonVariants({
              variant: "default",
              size: "sm"
            })}>
                  Sign Up
                </Link>
              </div>}
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={toggleMenu} aria-label="Toggle menu">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && isMobile && <div className="md:hidden py-4 border-t border-border/40">
            <div className="flex flex-col space-y-2">
              <Link to="/projects" className={`px-4 py-2 rounded-md transition-colors ${isActive('/projects') ? 'bg-secondary text-foreground' : 'hover:bg-secondary/50'}`} onClick={() => setMenuOpen(false)}>
                Projects
              </Link>
              <Link to="/find-creators" className={`px-4 py-2 rounded-md transition-colors ${isActive('/find-creators') ? 'bg-secondary text-foreground' : 'hover:bg-secondary/50'}`} onClick={() => setMenuOpen(false)}>
                Find Creators
              </Link>
              <Link to="/chatroom" className={`px-4 py-2 rounded-md transition-colors ${isActive('/chatroom') ? 'bg-secondary text-foreground' : 'hover:bg-secondary/50'}`} onClick={() => setMenuOpen(false)}>
                Community
              </Link>
              {user && <>
                  <div className="border-t border-border/40 my-2"></div>
                  <Link to={`/profile/${user.id}`} className={`px-4 py-2 rounded-md transition-colors hover:bg-secondary/50`} onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/my-projects" className={`px-4 py-2 rounded-md transition-colors hover:bg-secondary/50`} onClick={() => setMenuOpen(false)}>
                    My Projects
                  </Link>
                  <Link to="/settings" className={`px-4 py-2 rounded-md transition-colors hover:bg-secondary/50`} onClick={() => setMenuOpen(false)}>
                    Settings
                  </Link>
                  <Link to="/messages" className={`px-4 py-2 rounded-md transition-colors hover:bg-secondary/50`} onClick={() => setMenuOpen(false)}>
                    Messages
                  </Link>
                </>}
            </div>
          </div>}
      </div>
    </nav>;
};
export default NavbarOriginal;