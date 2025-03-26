
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Github } from 'lucide-react';
import Button from '../components/ui-custom/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailAuth } from '@/hooks/useEmailAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Signup: React.FC = () => {
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const { email, setEmail, password, setPassword, isLoading, handleSignup } = useEmailAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12 flex justify-center items-center">
        <div className="max-w-md w-full p-8 bg-secondary/40 backdrop-blur-md rounded-2xl">
          <h1 className="text-4xl font-bebas tracking-wider mb-6 text-center">SIGN UP</h1>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-center rounded-xl"
              icon={<Github size={20} />}
              onClick={() => signInWithGithub()}
            >
              Continue with Github
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-center rounded-xl"
              icon={<Mail size={20} />}
              onClick={() => signInWithGoogle()}
            >
              Continue with Google
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-secondary/40 text-muted-foreground">or</span>
              </div>
            </div>
            
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-background/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="bg-background/50"
                  required
                />
              </div>

              <Button 
                type="submit"
                variant="primary" 
                className="w-full justify-center rounded-xl mt-4"
                icon={<Mail size={20} />}
                isLoading={isLoading}
              >
                Sign up with Email
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link></p>
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

export default Signup;
