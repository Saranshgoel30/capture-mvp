
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { PortfolioProject, CurrentProject } from '@/lib/types';
import { fetchPortfolioItems } from '@/lib/supabase/portfolio';

export const useProfileData = (userId?: string) => {
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [currentProjects, setCurrentProjects] = useState<CurrentProject[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [currentProjectsLoading, setCurrentProjectsLoading] = useState(false);
  const { user } = useAuth();

  const targetUserId = userId || (user ? user.id : null);

  const refreshPortfolio = async () => {
    if (!targetUserId) return;
    
    setPortfolioLoading(true);
    try {
      const items = await fetchPortfolioItems(targetUserId);
      setPortfolioProjects(items);
    } catch (error) {
      console.error('Error loading portfolio projects:', error);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const refreshExperience = async () => {
    if (!targetUserId) return;
    
    setCurrentProjectsLoading(true);
    try {
      // First try to fetch from current_projects table
      const { data: experienceData, error: experienceError } = await supabase
        .from('current_projects')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });
        
      if (experienceError) throw experienceError;
      
      if (experienceData && experienceData.length > 0) {
        // Format experience data
        const formattedExperience = experienceData.map(item => ({
          id: item.id,
          userId: targetUserId,
          title: item.title,
          role: item.role,
          timeline: item.timeline,
          status: item.status as "In Production" | "Pre-Production" | "Post-Production" | "Completed",
          description: item.description,
          createdAt: new Date(item.created_at).getTime()
        }));
        
        setCurrentProjects(formattedExperience);
      } else {
        // Fallback to projects table if no experience found (backwards compatibility)
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', targetUserId);
            
        if (projectsError) throw projectsError;
        
        if (projectsData) {
          // Convert Supabase data to our app's format
          const formattedProjects = projectsData.map(project => ({
            id: project.id,
            userId: targetUserId,
            title: project.title,
            role: 'Creator', // Default role
            timeline: `Until ${new Date(project.deadline).toLocaleDateString()}`,
            status: "In Production" as "In Production" | "Pre-Production" | "Post-Production" | "Completed",
            description: project.description,
            createdAt: new Date(project.created_at).getTime()
          }));
          
          setCurrentProjects(formattedProjects);
        }
      }
    } catch (error) {
      console.error('Error loading experience:', error);
    } finally {
      setCurrentProjectsLoading(false);
    }
  };

  useEffect(() => {
    const loadProfileData = async () => {
      if (!targetUserId) return;

      // Load portfolio projects
      await refreshPortfolio();

      // Load experience
      await refreshExperience();
    };

    loadProfileData();
  }, [targetUserId]);

  return {
    portfolioProjects,
    currentProjects,
    portfolioLoading,
    currentProjectsLoading,
    refreshPortfolio,
    refreshExperience
  };
};
