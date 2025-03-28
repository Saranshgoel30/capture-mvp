// Project and User profile types for the application

export interface Project {
  id?: string;
  title: string;
  type: string;
  description: string;
  location: string;
  timeline: string;
  rolesNeeded: string[];
  postedBy: string;
  postedById: string;
  postedByAvatar?: string;
  deadline: string;
  applicants: number;
  createdAt: number;
}

export interface ProjectApplication {
  id?: string;
  projectId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: number;
}

export interface UserProfile {
  id?: string;
  userId: string;
  name: string;
  handle: string;
  avatar?: string;
  location?: string;
  bio?: string;
  roles: string[];
  skills: string[];
  contact: {
    email: string;
    instagram?: string;
    website?: string;
  };
  stats: {
    followers: number;
    following: number;
    projects: number;
  };
  createdAt: number;
}

export interface PortfolioProject {
  id?: string;
  userId: string;
  title: string;
  type: string;
  thumbnail?: string;
  mediaType?: 'link' | 'image' | 'video';
  role: string;
  date: string;
  collaborators: string[];
  description: string;
  createdAt: number;
}

export interface CurrentProject {
  id?: string;
  userId: string;
  title: string;
  role: string;
  timeline: string;
  status: "In Production" | "Pre-Production" | "Post-Production";
  description: string;
  createdAt: number;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url: string;
  };
}
