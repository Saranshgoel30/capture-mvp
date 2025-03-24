
import React from 'react';
import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 md:px-12 bg-secondary/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link to="/" className="font-bebas text-2xl tracking-wider">CAPTURE</Link>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Connecting creative minds with artistic opportunities. A platform for creatives to find and collaborate on projects.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-4 mb-4">
              <Link to="/privacy" className="text-sm text-foreground hover:text-primary transition-all-200">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-sm text-foreground hover:text-primary transition-all-200">
                Contact Us
              </Link>
            </div>
            
            <div className="flex justify-center items-center gap-4">
              <a href="#" className="text-foreground hover:text-primary transition-all-200">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Capture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
