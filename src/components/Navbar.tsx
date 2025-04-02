
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserCircle, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, signOut, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg z-50 border-b">
      <div className="mx-auto px-6 md:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">Capture</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/projects" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
              Projects
            </Link>
            {user && (
              <>
                <Link to="/my-projects" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                  My Projects
                </Link>
                <Link to="/find-creators" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                  Find Creators
                </Link>
                <Link to="/messages" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                  Messages
                </Link>
                <Link to="/chatroom" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                  Community Chat
                </Link>
              </>
            )}
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-accent"
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Authentication Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <UserCircle className="h-4 w-4" />
                    {profile?.full_name || user?.email?.split('@')[0] || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/profile/${user?.id}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-projects">My Projects</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 border-t">
                <Link
                  to="/projects"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                  onClick={closeMobileMenu}
                >
                  Projects
                </Link>
                
                {user && (
                  <>
                    <Link
                      to="/my-projects"
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                      onClick={closeMobileMenu}
                    >
                      My Projects
                    </Link>
                    <Link
                      to="/find-creators"
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                      onClick={closeMobileMenu}
                    >
                      Find Creators
                    </Link>
                    <Link
                      to="/messages"
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                      onClick={closeMobileMenu}
                    >
                      Messages
                    </Link>
                    <Link
                      to="/chatroom"
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                      onClick={closeMobileMenu}
                    >
                      Community Chat
                    </Link>
                    <Link
                      to={`/profile/${user?.id}`}
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                      onClick={closeMobileMenu}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                      onClick={closeMobileMenu}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        closeMobileMenu();
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-accent"
                    >
                      Logout
                    </button>
                  </>
                )}

                {!user && (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                      onClick={closeMobileMenu}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={closeMobileMenu}
                    >
                      Sign up
                    </Link>
                  </>
                )}

                <div className="pt-2 flex justify-center">
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
