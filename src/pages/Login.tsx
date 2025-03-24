
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Github, Linkedin } from 'lucide-react';
import Button from '../components/ui-custom/Button';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12 flex justify-center items-center">
        <div className="max-w-md w-full p-8 bg-secondary/40 backdrop-blur-md rounded-2xl">
          <h1 className="text-4xl font-bebas tracking-wider mb-6 text-center">LOGIN</h1>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-center rounded-xl"
              icon={<Github size={20} />}
            >
              Continue with Github
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-center rounded-xl"
              icon={<Linkedin size={20} />}
            >
              Continue with LinkedIn
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-secondary/40 text-muted-foreground">or</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full justify-center rounded-xl"
              icon={<Mail size={20} />}
            >
              Continue with Email
            </Button>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></p>
              <p className="mt-2">
                <Link to="/projects" className="text-primary hover:underline">Continue as guest</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
