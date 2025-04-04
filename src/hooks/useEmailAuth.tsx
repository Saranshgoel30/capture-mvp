
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useEmailAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please provide both email and password.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Login form submitted with:", { email });
      const success = await signInWithEmail(email, password);
      console.log("Login result:", success);
      if (success) {
        navigate('/projects');
      }
    } catch (error: any) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please provide both email and password.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Signup form submitted with:", { email });
      const success = await signUpWithEmail(email, password);
      console.log("Signup result:", success);
      if (success) {
        navigate('/projects');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
    handleSignup,
  };
};
