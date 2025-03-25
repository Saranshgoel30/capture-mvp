
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { addProject } from '@/lib/firestore';
import { Badge } from '@/components/ui/badge';

interface NewProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const projectTypes = [
  'Documentary', 'Short Film', 'Feature Film', 'Music Video', 
  'Podcast', 'Photography', 'Marketing', 'Animation', 'Other'
];

const NewProjectForm: React.FC<NewProjectFormProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('Documentary');
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const addRole = () => {
    if (newRole && !roles.includes(newRole)) {
      setRoles([...roles, newRole]);
      setNewRole('');
    }
  };

  const removeRole = (roleToRemove: string) => {
    setRoles(roles.filter(role => role !== roleToRemove));
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to post a new project.',
        variant: 'destructive',
      });
      return;
    }

    if (roles.length === 0) {
      toast({
        title: 'Roles needed',
        description: 'Please add at least one role needed for the project.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const projectData = {
        title: data.title,
        type: selectedType,
        description: data.description,
        location: data.location,
        timeline: data.timeline,
        rolesNeeded: roles,
        postedBy: userProfile?.name || user.displayName || user.email?.split('@')[0] || 'Anonymous',
        postedById: user.uid,
        postedByAvatar: userProfile?.avatar || user.photoURL || undefined,
        deadline: date ? format(date, 'MMMM d, yyyy') : 'Not specified',
        applicants: 0
      };

      const projectId = await addProject(projectData);
      
      if (projectId) {
        toast({
          title: 'Project created!',
          description: 'Your project has been successfully posted.',
        });
        reset();
        setRoles([]);
        setDate(new Date());
        onClose();
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Post a New Project</DialogTitle>
          <DialogDescription>
            Fill out the details below to post your project and find collaborators.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input 
              id="title" 
              {...register("title", { required: true })}
              placeholder="Enter a clear, descriptive title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-red-500 text-sm">Project title is required</p>}
          </div>

          <div className="space-y-2">
            <Label>Project Type</Label>
            <div className="flex flex-wrap gap-2">
              {projectTypes.map(type => (
                <Badge 
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea 
              id="description" 
              {...register("description", { required: true })}
              placeholder="Describe your project, goals, and vision"
              className={cn(
                errors.description ? "border-red-500" : "",
                "min-h-32"
              )}
            />
            {errors.description && <p className="text-red-500 text-sm">Project description is required</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                {...register("location", { required: true })}
                placeholder="City, Country or Remote"
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && <p className="text-red-500 text-sm">Location is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Input 
                id="timeline" 
                {...register("timeline", { required: true })}
                placeholder="e.g., Aug - Oct 2023"
                className={errors.timeline ? "border-red-500" : ""}
              />
              {errors.timeline && <p className="text-red-500 text-sm">Timeline is required</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Application Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Roles Needed</Label>
            <div className="flex gap-2">
              <Input 
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g., Cinematographer"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addRole}
              >
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {roles.map((role, index) => (
                <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                  {role}
                  <button 
                    type="button" 
                    onClick={() => removeRole(role)}
                    className="ml-1 rounded-full hover:bg-muted p-1"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
            {roles.length === 0 && (
              <p className="text-muted-foreground text-sm">Add at least one role needed for your project</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectForm;
