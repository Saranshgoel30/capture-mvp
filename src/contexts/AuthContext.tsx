
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
import { fetchUserProfile, createUserProfile } from '@/lib/firestore';
import { UserProfile } from '@/lib/types';

// We use TwitterAuthProvider as a substitute for LinkedIn since Firebase doesn't directly support LinkedIn
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const linkedinProvider = new TwitterAuthProvider(); // Using Twitter as a substitute

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signInWithGithub: () => Promise<boolean>;
  signInWithLinkedin: () => Promise<boolean>;
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

  // Fetch user profile whenever the user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setProfileLoading(true);
        try {
          const profile = await fetchUserProfile(user.uid);
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
    return false;
  };

  const createDefaultProfile = async (user: User) => {
    if (!user.email) return;
    
    const defaultProfile: Omit<UserProfile, 'id' | 'createdAt'> = {
      userId: user.uid,
      name: user.displayName || user.email.split('@')[0],
      handle: `@${user.email.split('@')[0]}`,
      avatar: user.photoURL || undefined,
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

  const createProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;
    
    setProfileLoading(true);
    try {
      // Check if profile already exists
      const existingProfile = await fetchUserProfile(user.uid);
      
      if (!existingProfile) {
        const defaultProfile: Omit<UserProfile, 'id' | 'createdAt'> = {
          userId: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'User',
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

  // In a development or demo environment, let's simulate auth
  const isDevEnvironment = window.location.hostname === "localhost" || 
                           window.location.hostname.includes("lovableproject.com");

  const signInWithGoogle = async () => {
    try {
      if (isDevEnvironment) {
        // Create a mock user for development
        const mockUser = {
          uid: 'google-user-123',
          email: 'demo@gmail.com',
          displayName: 'Google User',
          photoURL: null,
        } as User;
        setUser(mockUser);
        toast({
          title: 'Welcome! (Dev Mode)',
          description: 'You have successfully signed in with Google.',
        });
        return true;
      }

      const result = await signInWithPopup(auth, googleProvider);
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with Google.',
      });
      
      // Check if profile exists, create if not
      const profile = await fetchUserProfile(result.user.uid);
      if (!profile) {
        await createDefaultProfile(result.user);
      }
      return true;
    } catch (error: any) {
      return handleAuthError(error);
    }
  };

  const signInWithGithub = async () => {
    try {
      if (isDevEnvironment) {
        // Create a mock user for development
        const mockUser = {
          uid: 'github-user-123',
          email: 'demo@github.com',
          displayName: 'GitHub User',
          photoURL: null,
        } as User;
        setUser(mockUser);
        toast({
          title: 'Welcome! (Dev Mode)',
          description: 'You have successfully signed in with GitHub.',
        });
        return true;
      }

      const result = await signInWithPopup(auth, githubProvider);
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with GitHub.',
      });
      
      // Check if profile exists, create if not
      const profile = await fetchUserProfile(result.user.uid);
      if (!profile) {
        await createDefaultProfile(result.user);
      }
      return true;
    } catch (error: any) {
      return handleAuthError(error);
    }
  };

  const signInWithLinkedin = async () => {
    try {
      if (isDevEnvironment) {
        // Create a mock user for development
        const mockUser = {
          uid: 'linkedin-user-123',
          email: 'demo@linkedin.com',
          displayName: 'LinkedIn User',
          photoURL: null,
        } as User;
        setUser(mockUser);
        toast({
          title: 'Welcome! (Dev Mode)',
          description: 'You have successfully signed in with LinkedIn.',
        });
        return true;
      }

      // Using Twitter as a substitute for LinkedIn
      const result = await signInWithPopup(auth, linkedinProvider);
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with LinkedIn.',
      });
      
      // Check if profile exists, create if not
      const profile = await fetchUserProfile(result.user.uid);
      if (!profile) {
        await createDefaultProfile(result.user);
      }
      return true;
    } catch (error: any) {
      return handleAuthError(error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      if (isDevEnvironment) {
        // Create a mock user for development
        const mockUser = {
          uid: 'email-user-123',
          email: email,
          displayName: email.split('@')[0],
          photoURL: null,
        } as User;
        setUser(mockUser);
        toast({
          title: 'Welcome! (Dev Mode)',
          description: 'You have successfully signed in with Email.',
        });
        return true;
      }

      await signInWithEmailAndPassword(auth, email, password);
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
      if (isDevEnvironment) {
        // Create a mock user for development
        const mockUser = {
          uid: 'email-user-' + Date.now(),
          email: email,
          displayName: email.split('@')[0],
          photoURL: null,
        } as User;
        setUser(mockUser);
        
        // Create profile for new email user
        await createDefaultProfile(mockUser);
        
        toast({
          title: 'Account created! (Dev Mode)',
          description: 'Your account has been successfully created.',
        });
        return true;
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Account created!',
        description: 'Your account has been successfully created.',
      });
      
      // Create default profile for new email user
      await createDefaultProfile(result.user);
      return true;
    } catch (error: any) {
      return handleAuthError(error);
    }
  };

  const signOut = async () => {
    try {
      if (isDevEnvironment) {
        setUser(null);
        setUserProfile(null);
        toast({
          title: 'Signed out (Dev Mode)',
          description: 'You have been successfully signed out.',
        });
        return;
      }

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
    userProfile,
    loading,
    profileLoading,
    signInWithGoogle,
    signInWithGithub,
    signInWithLinkedin,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    createProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
