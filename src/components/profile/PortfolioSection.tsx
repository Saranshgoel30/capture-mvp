
import React from 'react';
import { PortfolioProject } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, PlayCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AddPortfolioItemForm from './AddPortfolioItemForm';

interface PortfolioSectionProps {
  portfolioProjects: PortfolioProject[];
  isLoading: boolean;
  isCurrentUser: boolean;
  onRefresh: () => void;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ 
  portfolioProjects, 
  isLoading,
  isCurrentUser,
  onRefresh
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const renderMedia = (project: PortfolioProject) => {
    if (!project.thumbnail) return null;
    
    // Check if it's a URL to a video (like YouTube or Vimeo)
    if (project.mediaType === 'video') {
      if (project.thumbnail.includes('youtube.com') || project.thumbnail.includes('youtu.be')) {
        // Convert YouTube link to embed format if needed
        let videoId = '';
        if (project.thumbnail.includes('youtube.com/watch?v=')) {
          videoId = project.thumbnail.split('v=')[1].split('&')[0];
        } else if (project.thumbnail.includes('youtu.be/')) {
          videoId = project.thumbnail.split('youtu.be/')[1];
        }
        
        if (videoId) {
          return (
            <div className="aspect-video w-full overflow-hidden">
              <iframe 
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          );
        }
      } else if (project.thumbnail.includes('vimeo.com')) {
        // Handle Vimeo links
        const vimeoId = project.thumbnail.split('vimeo.com/')[1];
        if (vimeoId) {
          return (
            <div className="aspect-video w-full overflow-hidden">
              <iframe 
                src={`https://player.vimeo.com/video/${vimeoId}`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          );
        }
      }
      
      // For direct video files from storage
      return (
        <div className="aspect-video w-full overflow-hidden">
          <video 
            src={project.thumbnail} 
            controls
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    // For images
    if (project.mediaType === 'image') {
      return (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img 
            src={project.thumbnail} 
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
          />
        </div>
      );
    }
    
    // For external links that aren't videos or images
    return (
      <div className="aspect-video w-full overflow-hidden bg-secondary/40 flex flex-col items-center justify-center gap-2 p-4">
        <PlayCircle size={48} className="text-muted-foreground/60" />
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => window.open(project.thumbnail, '_blank')}
        >
          <ExternalLink size={16} />
          View Project
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Portfolio</h2>
        {isCurrentUser && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => document.getElementById('add-portfolio-button')?.click()}
          >
            Add Project
          </Button>
        )}
      </div>

      {isCurrentUser && (
        <div className="mb-6 hidden">
          <AddPortfolioItemForm onSuccess={onRefresh} />
        </div>
      )}

      {portfolioProjects.length === 0 ? (
        <div className="bg-secondary/40 backdrop-blur-md rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">No portfolio items yet</h3>
          <p className="text-muted-foreground">
            {isCurrentUser 
              ? "Add your projects to showcase your work and skills to potential collaborators."
              : "This user hasn't added any portfolio items yet."}
          </p>
          {isCurrentUser && (
            <Button 
              id="add-portfolio-button"
              variant="default" 
              className="mt-4"
              onClick={() => document.getElementById('add-portfolio-dialog-trigger')?.click()}
            >
              Add Your First Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-all duration-200">
              {renderMedia(project)}
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
                  {project.collaborators && project.collaborators.length > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Collaborators: </span>
                      {project.collaborators.join(', ')}
                    </div>
                  )}
                  <p className="text-sm">{project.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {isCurrentUser && (
        <div className="hidden">
          <button id="add-portfolio-dialog-trigger" onClick={() => document.getElementById('portfolio-dialog-trigger')?.click()}>
            Add Portfolio
          </button>
        </div>
      )}
      
      <div className="hidden">
        <AddPortfolioItemForm onSuccess={onRefresh} />
      </div>
    </div>
  );
};

export default PortfolioSection;
