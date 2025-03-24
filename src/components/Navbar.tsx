
import React, { useState, useEffect } from 'react';
import { Menu, X, User, Search, Settings, Home, Film, LogIn, LogOut } from 'lucide-react';
import Button from './ui-custom/Button';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const { user, signOut } = useAuth();
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

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all-300 px-6 md:px-12 py-4",
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
            <Link to="/" className="text-sm font-medium text-foreground transition-all-200 hover:text-primary flex items-center gap-2">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/projects" className="text-sm font-medium text-foreground transition-all-200 hover:text-primary flex items-center gap-2">
              <Film size={18} />
              <span>Projects</span>
            </Link>
            <Link to="/find-creators" className="text-sm font-medium text-foreground transition-all-200 hover:text-primary flex items-center gap-2">
              <Search size={18} />
              <span>Find Creators</span>
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="text-sm font-medium text-foreground transition-all-200 hover:text-primary flex items-center gap-2">
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className="text-sm font-medium text-foreground transition-all-200 hover:text-primary flex items-center gap-2">
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-foreground transition-all-200 hover:text-primary flex items-center gap-2">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
              </Link>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleLogout}
                className="rounded-full text-muted-foreground"
                icon={<LogOut size={16} />}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button size="sm" className="rounded-full" onClick={() => navigate('/signup')}>
              Find Projects
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-foreground p-2 rounded-md focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-morphism absolute top-full left-0 right-0 p-6 mt-2 mx-4 rounded-lg shadow-lg">
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
            <Link 
              to="/find-creators" 
              className="text-sm font-medium text-foreground hover:text-primary px-2 py-1 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search size={18} />
              <span>Find Creators</span>
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
              {user ? 'Browse Projects' : 'Find Projects'}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
