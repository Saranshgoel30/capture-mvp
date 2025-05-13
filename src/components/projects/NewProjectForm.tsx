import React, { useState } from 'react';
import { X, Calendar, Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { addProject } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NewProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void; // Added optional onProjectCreated prop
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddRole = () => {
    if (role && !roles.includes(role)) {
      setRoles([...roles, role]);
      setRole('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setRoles(roles.filter(r => r !== roleToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRole();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setType('');
    setRole('');
    setRoles([]);
    setDeadline(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to post a project.",
        variant: "destructive",
      });
      return;
    }
    
    if (!title || !description || !location || !type || roles.length === 0 || !deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const projectData = {
        title,
        description,
        location,
        type,
        roles,
        deadline: deadline.toISOString().split('T')[0], // Format as YYYY-MM-DD
      };
      
      await addProject(projectData);
      
      toast({
        title: "Project Posted",
        description: "Your project has been successfully posted.",
      });
      
      resetForm();
      onClose();
      
      // Call the onProjectCreated callback if provided
      if (onProjectCreated) {
        onProjectCreated();
      } else {
        // Redirect to projects page and refresh to see the new project only if onProjectCreated is not provided
        navigate('/projects');
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error posting project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to post project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Share the details of your creative project and find collaborators.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="title">Project Title*</Label>
            <Input
              id="title"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="type">Project Type*</Label>
            <Input
              id="type"
              placeholder="e.g., Short Film, Music Video, Commercial"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              placeholder="Describe your project, goals, and vision..."
              className="min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="location">Location*</Label>
            <Input
              id="location"
              placeholder="e.g., Los Angeles, CA or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="deadline">Project Deadline*</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={deadline}
                  onSelect={(date) => {
                    setDeadline(date);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="roles">Roles Needed*</Label>
            <div className="flex gap-2">
              <Input
                id="roles"
                placeholder="e.g., Cinematographer, Editor"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddRole} variant="outline">
                <Plus size={18} />
              </Button>
            </div>
            {roles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {roles.map((r, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {r}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveRole(r)}
                      className="ml-1 rounded-full hover:bg-muted p-1"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : "Post Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectForm;
