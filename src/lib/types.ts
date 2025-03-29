
export type CurrentProject = {
  id: string;
  userId: string;
  title: string;
  role: string;
  timeline: string;
  status: "In Production" | "Pre-Production" | "Post-Production";
  description: string;
  createdAt: number;
};

export type PortfolioProject = {
  id: string;
  userId: string;
  title: string;
  type: string;
  thumbnail: string;
  mediaType: 'image' | 'video' | 'link';
  role: string;
  date: string;
  collaborators: string[];
  description: string;
  createdAt: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  location: string;
  deadline: string;
  requiredRoles: string[];
  ownerId: string;
  createdAt: number;
  applicants?: number;
};

export type UserProfile = {
  id: string;
  userId: string;
  name: string;
  handle: string;
  avatar: string | null;
  bio: string;
  location: string;
  roles: string[];
  skills: string[];
  contact: {
    email: string;
  };
  stats: {
    followers: number;
    following: number;
    projects: number;
  };
  createdAt: number;
};

export type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: number;
  sender?: {
    full_name: string;
    avatar_url: string | null;
  };
};

export type ProjectApplication = {
  id: string;
  projectId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  coverLetter?: string;
  createdAt: number;
};
