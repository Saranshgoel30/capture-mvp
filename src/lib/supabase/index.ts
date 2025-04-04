
// Re-export everything from the individual files
export * from './client';
export * from './projects';
export * from './portfolio';
export * from './messages';
export * from './storage';
export * from './projectApplications';

// Explicitly export and rename to avoid conflicts
export { 
  fetchUserProfile,
  getCurrentUser,
  updateUserProfile
} from './users';

// Named export for notifications
export * from './notifications';
