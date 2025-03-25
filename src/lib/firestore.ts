
import { db } from './firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp, serverTimestamp } from 'firebase/firestore';
import { Project, UserProfile, PortfolioProject, CurrentProject } from './types';

// Project Collection
const projectsCollection = collection(db, 'projects');

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const q = query(projectsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Project, 'id'>;
      projects.push({ id: doc.id, ...data });
    });
    
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    const projectDoc = doc(db, 'projects', projectId);
    const docSnap = await getDoc(projectDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<Project, 'id'>;
      return { id: docSnap.id, ...data };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

export const addProject = async (project: Omit<Project, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    const projectWithTimestamp = {
      ...project,
      createdAt: Date.now()
    };
    
    const docRef = await addDoc(projectsCollection, projectWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error adding project:', error);
    return null;
  }
};

export const updateProject = async (projectId: string, data: Partial<Project>): Promise<boolean> => {
  try {
    const projectDoc = doc(db, 'projects', projectId);
    await updateDoc(projectDoc, data);
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    const projectDoc = doc(db, 'projects', projectId);
    await deleteDoc(projectDoc);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

// User Profiles Collection
const profilesCollection = collection(db, 'profiles');

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const q = query(profilesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data() as Omit<UserProfile, 'id'>;
      return { id: doc.id, ...data };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    const profileWithTimestamp = {
      ...profile,
      createdAt: Date.now()
    };
    
    const docRef = await addDoc(profilesCollection, profileWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (profileId: string, data: Partial<UserProfile>): Promise<boolean> => {
  try {
    const profileDoc = doc(db, 'profiles', profileId);
    await updateDoc(profileDoc, data);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Portfolio Projects Collection
const portfolioCollection = collection(db, 'portfolioProjects');

export const fetchUserPortfolio = async (userId: string): Promise<PortfolioProject[]> => {
  try {
    const q = query(portfolioCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const portfolioProjects: PortfolioProject[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<PortfolioProject, 'id'>;
      portfolioProjects.push({ id: doc.id, ...data });
    });
    
    return portfolioProjects;
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return [];
  }
};

export const addPortfolioProject = async (project: Omit<PortfolioProject, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    const projectWithTimestamp = {
      ...project,
      createdAt: Date.now()
    };
    
    const docRef = await addDoc(portfolioCollection, projectWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error adding portfolio project:', error);
    return null;
  }
};

// Current Projects Collection
const currentProjectsCollection = collection(db, 'currentProjects');

export const fetchUserCurrentProjects = async (userId: string): Promise<CurrentProject[]> => {
  try {
    const q = query(currentProjectsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const currentProjects: CurrentProject[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<CurrentProject, 'id'>;
      currentProjects.push({ id: doc.id, ...data });
    });
    
    return currentProjects;
  } catch (error) {
    console.error('Error fetching current projects:', error);
    return [];
  }
};

export const addCurrentProject = async (project: Omit<CurrentProject, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    const projectWithTimestamp = {
      ...project,
      createdAt: Date.now()
    };
    
    const docRef = await addDoc(currentProjectsCollection, projectWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error adding current project:', error);
    return null;
  }
};
