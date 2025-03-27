
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';
import { fetchUserProfile, updateUserProfile } from '@/lib/supabase';

type Profile = {
  id: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  city?: string;
  roles?: string[];
  skills?: string[];
  social_links?: Record<string, string>; // Add this field to support social links
  updated_at?: string;
  created_at?: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile | null>;
  refreshUserProfile: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const { toast } = useToast();

  // Load user profile
  const refreshUserProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setProfileLoading(true);
    try {
      const userProfile = await fetchUserProfile(user.id);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Load user profile on user change
  useEffect(() => {
    refreshUserProfile();
  }, [user]);

  // Set up auth state listener and check current session
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Authentication methods
  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: 'Authentication Error',
        description: error.message || 'Failed to sign in. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const signUpWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // If email confirmation is disabled, the user will be signed in automatically
      if (data.session) {
        toast({
          title: 'Account created!',
          description: 'Your account has been successfully created.',
        });
        return true;
      } else {
        toast({
          title: 'Verification email sent',
          description: 'Please check your inbox to verify your email address.',
        });
        return false;
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: 'Authentication Error',
        description: error.message || 'Failed to sign up. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: 'Authentication Error',
        description: error.message || 'Failed to sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const signInWithGithub = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: 'Authentication Error',
        description: error.message || 'Failed to sign in with GitHub. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<Profile | null> => {
    if (!user || !profile) return null;
    
    try {
      const updatedProfile = await updateUserProfile(user.id, updates);
      setProfile(updatedProfile);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
      
      return updatedProfile;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    profileLoading,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
