
// Re-export all functions from supabase subdirectories
import { fetchUserProfile, updateUserProfile } from './users';
import { fetchProjects, fetchProjectById, applyForProject } from './projects';
import { fetchPortfolioProjects, addPortfolioProject, getPortfolioItemDetails } from './portfolio';
import { uploadImageToStorage, getPublicUrlForFile } from './storage';
import { fetchCurrentProjects, addCurrentProject } from './creators';
import { fetchMessages, sendMessage } from './messages';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from './notifications';
import { fetchProjectApplications, updateApplicationStatus, startMessageWithApplicant } from './projectApplications';

export {
  // Users
  fetchUserProfile,
  updateUserProfile,
  
  // Projects
  fetchProjects,
  fetchProjectById,
  applyForProject,
  
  // Portfolio
  fetchPortfolioProjects,
  addPortfolioProject,
  getPortfolioItemDetails,
  
  // Storage
  uploadImageToStorage,
  getPublicUrlForFile,
  
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
