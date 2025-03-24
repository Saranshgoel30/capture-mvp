
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './ui-custom/Button';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all-300 px-6 md:px-12 py-4",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <span className="font-bold text-xl tracking-tight text-foreground">
            Startup
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            <a href="#home" className="text-sm font-medium text-foreground transition-all-200 hover:text-primary">
              Home
            </a>
            <a href="#features" className="text-sm font-medium text-foreground transition-all-200 hover:text-primary">
              Features
            </a>
            <a href="#about" className="text-sm font-medium text-foreground transition-all-200 hover:text-primary">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground transition-all-200 hover:text-primary">
              Contact
            </a>
          </div>
          <Button size="sm">Get Started</Button>
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
            <a 
              href="#home" 
              className="text-sm font-medium text-foreground hover:text-primary px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#features" 
              className="text-sm font-medium text-foreground hover:text-primary px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#about" 
              className="text-sm font-medium text-foreground hover:text-primary px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="#contact" 
              className="text-sm font-medium text-foreground hover:text-primary px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <Button size="sm" className="mt-2" onClick={() => setIsMenuOpen(false)}>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
