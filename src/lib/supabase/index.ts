
// Re-export all functions from supabase subdirectories
import { fetchUserProfile, updateUserProfile, extractNameFromEmail } from './users';
import { fetchProjects, fetchProjectById, applyForProject, addProject } from './projects';
import { 
  fetchPortfolioItems, 
  addPortfolioItem, 
  getPortfolioItemDetails 
} from './portfolio';
import { 
  uploadProfileImage, 
  getPublicUrlForFile,
  initializeStorage 
} from './storage';
import { 
  fetchCurrentProjects, 
  addCurrentProject 
} from './creators';
import { 
  getMessages, 
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
  extractNameFromEmail,
  
  // Projects
  fetchProjects,
  fetchProjectById,
  applyForProject,
  addProject,
  
  // Portfolio
  fetchPortfolioItems,
  addPortfolioItem,
  getPortfolioItemDetails,
  
  // Storage
  uploadProfileImage,
  getPublicUrlForFile,
  initializeStorage,
  
  // Creators
  fetchCurrentProjects,
  addCurrentProject,
  
  // Messages
  getMessages,
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
