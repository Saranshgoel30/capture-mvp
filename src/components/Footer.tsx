
import React from 'react';
import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 bg-secondary/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="text-center lg:text-left">
              <Link to="/" className="font-bebas text-xl sm:text-2xl tracking-wider">
                CAPTURE
              </Link>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Connecting creative minds with artistic opportunities. A platform for creatives to find and collaborate on projects.
              </p>
            </div>
            
            <div className="flex flex-col items-center lg:items-end w-full lg:w-auto">
              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-4 text-center">
                <Link 
                  to="/privacy" 
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-background/50"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/contact" 
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-background/50"
                >
                  Contact Us
                </Link>
              </div>
              
              {/* Social */}
              <div className="flex justify-center items-center">
                <a 
                  href="#" 
                  className="text-foreground hover:text-primary transition-colors p-3 rounded-lg hover:bg-background/50"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="pt-4 sm:pt-6 border-t border-white/10 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} Capture. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
