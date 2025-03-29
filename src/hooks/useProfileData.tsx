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
      const { data, error } = await supabase
        .from('current_projects')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedExperience: CurrentProject[] = (data || []).map(item => ({
        id: item.id,
        userId: targetUserId,
        title: item.title,
        role: item.role,
        timeline: item.timeline,
        status: item.status as "In Production" | "Pre-Production" | "Post-Production",
        description: item.description,
        createdAt: new Date(item.created_at).getTime(),
        // Keep original fields for compatibility
        user_id: item.user_id,
        created_at: item.created_at
      }));
      
      setCurrentProjects(formattedExperience);
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
