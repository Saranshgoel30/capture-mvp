
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';
import { fetchUserProfile, createUserProfile } from '@/lib/firestore';
import { UserProfile } from '@/lib/types';

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signInWithGithub: () => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  createProfile: (profileData: Partial<UserProfile>) => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check active session and set user
    const checkSession = async () => {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    
    checkSession();

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile whenever the user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setProfileLoading(true);
        try {
          const profile = await fetchUserProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchProfile();
  }, [user]);

  const handleAuthError = (error: any) => {
    console.error('Authentication error:', error);
    toast({
      title: 'Authentication Error',
      description: error.message || 'Failed to authenticate. Please try again.',
      variant: 'destructive',
    });
    return false;
  };

  const createDefaultProfile = async (user: User) => {
    if (!user.email) return false;
    
    const defaultProfile: Omit<UserProfile, 'id' | 'createdAt'> = {
      userId: user.id,
      name: user.user_metadata?.name || user.email.split('@')[0],
      handle: `@${user.email.split('@')[0]}`,
      avatar: user.user_metadata?.avatar_url || undefined,
      roles: [],
      skills: [],
      contact: {
        email: user.email,
      },
      stats: {
        followers: 0,
        following: 0,
        projects: 0,
      }
    };

    try {
      const profileId = await createUserProfile(defaultProfile);
      if (profileId) {
        const profile = { ...defaultProfile, id: profileId } as UserProfile;
        setUserProfile(profile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating default profile:', error);
      return false;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
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
      return handleAuthError(error);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: 'Account created!',
          description: 'Your account has been successfully created.',
        });
        
        // Create default profile for new user
        await createDefaultProfile(data.user);
        return true;
      }
      
      return false;
    } catch (error: any) {
      return handleAuthError(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) throw error;
      
      toast({
        title: 'Welcome!',
        description: 'You are being redirected to Google for authentication.',
      });
      
      // Auth redirect is handled by Supabase
      return true;
    } catch (error: any) {
      return handleAuthError(error);
    }
  };

  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      });
      
      if (error) throw error;
      
      toast({
        title: 'Welcome!',
        description: 'You are being redirected to GitHub for authentication.',
      });
      
      // Auth redirect is handled by Supabase
      return true;
    } catch (error: any) {
      return handleAuthError(error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const createProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;
    
    setProfileLoading(true);
    try {
      // Check if profile already exists
      const existingProfile = await fetchUserProfile(user.id);
      
      if (!existingProfile) {
        const defaultProfile: Omit<UserProfile, 'id' | 'createdAt'> = {
          userId: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          handle: `@${user.email?.split('@')[0] || 'user'}`,
          roles: [],
          skills: [],
          contact: {
            email: user.email || '',
          },
          stats: {
            followers: 0,
            following: 0,
            projects: 0,
          },
          ...profileData
        };

        const profileId = await createUserProfile(defaultProfile);
        if (profileId) {
          const profile = { ...defaultProfile, id: profileId } as UserProfile;
          setUserProfile(profile);
          toast({
            title: 'Profile created!',
            description: 'Your profile has been successfully created.',
          });
        }
      }
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    createProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
