import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, LogIn, LogOut, Settings, Film, Users, MessageSquare, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAnimalAvatarForUser } from '@/lib/animalAvatars';
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const {
    user,
    profile,
    signOut
  } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  const toggleMenu = () => setIsOpen(!isOpen);

  // Get animal avatar for user if available
  const userAvatar = user ? getAnimalAvatarForUser(user.id) : null;
  return <header className={`fixed top-0 left-0 w-full z-10 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="px-6 md:px-12 mx-auto py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl text-amber-700 font-bold">CAPTURE</span>
          </Link>
          
          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/projects" className="text-foreground hover:text-primary transition">
              Projects
            </Link>
            <Link to="/find-creators" className="text-foreground hover:text-primary transition">
              Find Creators
            </Link>
            {user && <Link to="/chatroom" className="text-foreground hover:text-primary transition">
                Community Chat
              </Link>}
            {user && <Link to="/messages" className="text-foreground hover:text-primary transition">
                Messages
              </Link>}
          </nav>
          
          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? <div className="flex items-center space-x-4">
                <Link to={`/profile/${user.id}`}>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={profile?.avatar_url || userAvatar} />
                    <AvatarFallback>{profile?.full_name?.charAt(0) || <User size={14} />}</AvatarFallback>
                  </Avatar>
                </Link>
                <Link to="/settings">
                  <Button variant="ghost" size="icon">
                    <Settings size={20} />
                  </Button>
                </Link>
                <Button variant="ghost" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div> : <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <button onClick={toggleMenu} className="text-foreground">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isOpen && <div className="mt-4 md:hidden bg-background border rounded-lg shadow-lg p-4 space-y-4">
            <Link to="/projects" className="block py-2 hover:text-primary transition flex items-center">
              <Film className="mr-2 h-4 w-4" />
              Projects
            </Link>
            <Link to="/find-creators" className="block py-2 hover:text-primary transition flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Find Creators
            </Link>
            {user && <Link to="/chatroom" className="block py-2 hover:text-primary transition flex items-center">
                <MessageCircle className="mr-2 h-4 w-4" />
                Community Chat
              </Link>}
            {user && <Link to="/messages" className="block py-2 hover:text-primary transition flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Link>}
            
            <div className="pt-2 border-t">
              {user ? <>
                  <Link to={`/profile/${user.id}`} className="block py-2 hover:text-primary transition flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <Link to="/settings" className="block py-2 hover:text-primary transition flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                  <button onClick={signOut} className="w-full text-left block py-2 hover:text-primary transition flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </> : <>
                  <Link to="/login" className="block py-2 hover:text-primary transition flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full mt-2">Sign Up</Button>
                  </Link>
                </>}
            </div>
          </div>}
      </div>
    </header>;
};
export default Navbar;