
import React from 'react';
import { PortfolioProject } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';

interface PortfolioSectionProps {
  portfolioProjects: PortfolioProject[];
  isLoading: boolean;
  isCurrentUser: boolean;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ 
  portfolioProjects, 
  isLoading,
  isCurrentUser 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (portfolioProjects.length === 0) {
    return (
      <div className="bg-secondary/40 backdrop-blur-md rounded-xl p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">No portfolio items yet</h3>
        <p className="text-muted-foreground">
          {isCurrentUser 
            ? "Add your projects to showcase your work and skills to potential collaborators."
            : "This user hasn't added any portfolio items yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {portfolioProjects.map((project) => (
        <Card key={project.id} className="overflow-hidden hover:shadow-md transition-all duration-200">
          {project.thumbnail && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={project.thumbnail} 
                alt={project.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
          )}
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <Badge variant="outline">{project.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Role: {project.role}</span>
                <span>{project.date}</span>
              </div>
              <p className="text-sm">{project.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PortfolioSection;
