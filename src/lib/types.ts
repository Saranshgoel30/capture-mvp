
export type CurrentProject = {
  id: string;
  userId: string;
  title: string;
  role: string;
  timeline: string;
  status: "In Production" | "Pre-Production" | "Post-Production";
  description: string;
  createdAt: number;
  // Database field names
  user_id?: string;
  created_at?: string;
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
  // Database field names
  profile_id?: string;
  media_url?: string;
  media_type?: string;
  created_at?: string;
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
  
  // Additional properties used in the UI
  type?: string;
  timeline?: string;
  rolesNeeded?: string[];
  postedBy?: string;
  postedById?: string;
  postedByAvatar?: string;
  skills?: string[];      // Add skills property
  budget_range?: string;  // Add budget_range property
  
  // Database field names
  owner_id?: string;
  required_roles?: string[];
  created_at?: string;
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
  
  // Database field names
  full_name?: string;
  avatar_url?: string;
  city?: string;
  updated_at?: string;
  created_at?: string;
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
  
  // Add database field names for compatibility
  sender_id?: string;
  receiver_id?: string;
  created_at?: string;
};

export type ProjectApplication = {
  id: string;
  projectId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  coverLetter?: string;
  selectedRole?: string; // New field to store the selected role
  createdAt: number;
  
  // Database field names
  project_id?: string;
  applicant_id?: string;
  cover_letter?: string;
  selected_role?: string; // New database field name
  created_at?: string;
  
  // Related data
  project?: Project;
  applicant?: {
    id: string;
    name: string;
    avatar?: string;
    roles?: string[];
  };
  
  // Legacy field for compatibility with existing components
  applicant_profile?: {
    id?: string;
    full_name?: string;
    avatar_url?: string;
    roles?: string[];
  };
};

export type Notification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  relatedId?: string;
  relatedType?: string;
  createdAt: number;
  
  // Database field names
  user_id?: string;
  related_id?: string;
  related_type?: string;
  created_at?: string;
};
