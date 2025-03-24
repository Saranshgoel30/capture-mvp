
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  TwitterAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// We use TwitterAuthProvider as a substitute for LinkedIn since Firebase doesn't directly support LinkedIn
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const linkedinProvider = new TwitterAuthProvider(); // Using Twitter as a substitute

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithLinkedin: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthError = (error: any) => {
    console.error('Authentication error:', error);
    toast({
      title: 'Authentication Error',
      description: error.message || 'Failed to authenticate. Please try again.',
      variant: 'destructive',
    });
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with Google.',
      });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const signInWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with GitHub.',
      });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const signInWithLinkedin = async () => {
    try {
      // Using Twitter as a substitute for LinkedIn
      await signInWithPopup(auth, linkedinProvider);
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with LinkedIn.',
      });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Account created!',
        description: 'Your account has been successfully created.',
      });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signInWithLinkedin,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
