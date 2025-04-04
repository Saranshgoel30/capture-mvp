
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Github } from 'lucide-react';
import Button from '../components/ui-custom/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailAuth } from '@/hooks/useEmailAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithGithub, user } = useAuth();
  const { email, setEmail, password, setPassword, isLoading, handleSignup } = useEmailAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/projects');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 flex justify-center items-center">
        <div className="w-full max-w-md p-4 sm:p-8 bg-secondary/40 backdrop-blur-md rounded-2xl">
          <h1 className="text-3xl sm:text-4xl font-bebas tracking-wider mb-4 sm:mb-6 text-center">SIGN UP</h1>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-center rounded-xl text-sm sm:text-base"
              icon={<Github size={18} />}
              onClick={() => signInWithGithub()}
            >
              Continue with Github
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-center rounded-xl text-sm sm:text-base"
              icon={<Mail size={18} />}
              onClick={() => signInWithGoogle()}
            >
              Continue with Google
            </Button>
            
            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-secondary/40 text-muted-foreground">or</span>
              </div>
            </div>
            
            <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-background/50"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="bg-background/50"
                  required
                  autoComplete="new-password"
                />
              </div>

              <Button 
                type="submit"
                variant="primary" 
                className="w-full justify-center rounded-xl mt-2 sm:mt-4 text-sm sm:text-base"
                isLoading={isLoading}
              >
                Sign up with Email
              </Button>
            </form>
            
            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground">
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
