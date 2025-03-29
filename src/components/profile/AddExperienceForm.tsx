
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface AddExperienceFormProps {
  userId: string;
  onSuccess: () => void;
}

const AddExperienceForm: React.FC<AddExperienceFormProps> = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    timeline: '',
    description: '',
    status: 'In Production' as 'In Production' | 'Pre-Production' | 'Post-Production' | 'Completed'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Insert into the current_projects table
      const { error } = await supabase
        .from('current_projects')
        .insert({
          user_id: userId,
          title: formData.title,
          role: formData.role,
          timeline: formData.timeline,
          description: formData.description,
          status: formData.status,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error adding experience:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Your Role</Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="e.g. Director, Cinematographer"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="timeline">Timeline</Label>
          <Input
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleInputChange}
            placeholder="e.g. Jan-Mar 2023"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="status">Status</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="In Production">In Production</SelectItem>
            <SelectItem value="Pre-Production">Pre-Production</SelectItem>
            <SelectItem value="Post-Production">Post-Production</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe your role and responsibilities"
          className="min-h-[100px]"
          required
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Add Experience'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddExperienceForm;
