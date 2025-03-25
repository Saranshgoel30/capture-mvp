
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserPortfolio, fetchUserCurrentProjects } from '@/lib/firestore';
import { PortfolioProject, CurrentProject } from '@/lib/types';

export const useProfileData = (userId?: string) => {
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [currentProjects, setCurrentProjects] = useState<CurrentProject[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [currentProjectsLoading, setCurrentProjectsLoading] = useState(false);
  const { user } = useAuth();

  const targetUserId = userId || user?.uid;

  useEffect(() => {
    const loadProfileData = async () => {
      if (!targetUserId) return;

      // Load portfolio projects
      setPortfolioLoading(true);
      try {
        const portfolio = await fetchUserPortfolio(targetUserId);
        setPortfolioProjects(portfolio);
      } catch (error) {
        console.error('Error loading portfolio projects:', error);
      } finally {
        setPortfolioLoading(false);
      }

      // Load current projects
      setCurrentProjectsLoading(true);
      try {
        const current = await fetchUserCurrentProjects(targetUserId);
        setCurrentProjects(current);
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
    currentProjectsLoading
  };
};
