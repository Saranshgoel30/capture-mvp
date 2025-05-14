
// Re-export all functions from supabase subdirectories
import { fetchUserProfile, updateUserProfile } from './users';
import { fetchProjects, fetchProjectById, applyForProject, addProject } from './projects';
import { 
  fetchPortfolioItems as fetchPortfolioProjects, 
  addPortfolioItem as addPortfolioProject, 
  getPortfolioItemDetails 
} from './portfolio';
import { 
  uploadProfileImage as uploadImageToStorage, 
  getPublicUrlForFile,
  initializeStorage 
} from './storage';
import { 
  fetchCurrentProjects, 
  addCurrentProject 
} from './creators';
import { 
  getMessages as fetchMessages, 
  sendMessage 
} from './messages';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from './notifications';
import { fetchProjectApplications, updateApplicationStatus, startMessageWithApplicant } from './projectApplications';
import { supabase } from './client';

export {
  // Client
  supabase,
  
  // Users
  fetchUserProfile,
  updateUserProfile,
  
  // Projects
  fetchProjects,
  fetchProjectById,
  applyForProject,
  addProject,
  
  // Portfolio
  fetchPortfolioProjects,
  addPortfolioProject,
  getPortfolioItemDetails,
  
  // Storage
  uploadImageToStorage,
  getPublicUrlForFile,
  initializeStorage,
  
  // Creators
  fetchCurrentProjects,
  addCurrentProject,
  
  // Messages
  fetchMessages,
  sendMessage,
  
  // Notifications
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  
  // Project Applications
  fetchProjectApplications,
  updateApplicationStatus,
  startMessageWithApplicant,
};
