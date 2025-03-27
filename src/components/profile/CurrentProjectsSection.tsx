
import React from 'react';
import { CurrentProject } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock } from 'lucide-react';

interface CurrentProjectsSectionProps {
  currentProjects: CurrentProject[];
  isLoading: boolean;
  isCurrentUser: boolean;
}

const CurrentProjectsSection: React.FC<CurrentProjectsSectionProps> = ({ 
  currentProjects, 
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

  if (currentProjects.length === 0) {
    return (
      <div className="bg-secondary/40 backdrop-blur-md rounded-xl p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">No current projects</h3>
        <p className="text-muted-foreground">
          {isCurrentUser 
            ? "You aren't currently working on any projects. Create or join a project to get started!"
            : "This user isn't currently working on any projects."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {currentProjects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-all duration-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{project.title}</CardTitle>
              <Badge variant={
                project.status === "In Production" ? "default" :
                project.status === "Pre-Production" ? "secondary" : "outline"
              }>
                {project.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock size={14} className="mr-1" />
                <span>{project.timeline}</span>
                <span className="mx-2">•</span>
                <span>Role: {project.role}</span>
              </div>
              <p className="text-sm">{project.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrentProjectsSection;
