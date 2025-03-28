
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

  useEffect(() => {
    const loadProfileData = async () => {
      if (!targetUserId) return;

      // Load portfolio projects
      await refreshPortfolio();

      // Load current projects
      setCurrentProjectsLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', targetUserId);
          
        if (error) throw error;
        
        // Convert Supabase data to our app's format
        const formattedProjects = data.map(project => ({
          id: project.id,
          userId: targetUserId,
          title: project.title,
          role: 'Creator', // Default role
          timeline: `Until ${new Date(project.deadline).toLocaleDateString()}`,
          status: "In Production" as "In Production" | "Pre-Production" | "Post-Production",
          description: project.description,
          createdAt: new Date(project.created_at).getTime()
        }));
        
        setCurrentProjects(formattedProjects);
      } catch (error) {
        console.error('Error loading current projects:', error);
      } finally {
        setCurrentProjectsLoading(false);
      }
    };

    loadProfileData();
  }, [targetUserId]);

  return {
    portfolioProjects,
    currentProjects,
    portfolioLoading,
    currentProjectsLoading,
    refreshPortfolio
  };
};
