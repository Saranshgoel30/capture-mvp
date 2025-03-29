
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabase/client';
import { toast } from "sonner";

type ExperienceFormData = {
  title: string;
  role: string;
  timeline: string;
  status: "In Production" | "Pre-Production" | "Post-Production";
  description: string;
};

interface AddExperienceFormProps {
  userId: string;
  onSuccess?: () => void;
}

const AddExperienceForm: React.FC<AddExperienceFormProps> = ({ userId, onSuccess }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<ExperienceFormData>();

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      const { error } = await supabase
        .from('current_projects')
        .insert({
          user_id: userId,
          title: data.title,
          role: data.role,
          timeline: data.timeline,
          status: data.status,
          description: data.description
        });

      if (error) throw error;

      toast.success('Experience added successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error adding experience:', error);
      toast.error('Failed to add experience');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input 
        {...register('title', { required: 'Title is required' })}
        placeholder="Project Title" 
      />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <Input 
        {...register('role', { required: 'Role is required' })}
        placeholder="Your Role" 
      />
      {errors.role && <p className="text-red-500">{errors.role.message}</p>}

      <Input 
        {...register('timeline', { required: 'Timeline is required' })}
        placeholder="Project Timeline (e.g., Summer 2023)" 
      />
      {errors.timeline && <p className="text-red-500">{errors.timeline.message}</p>}

      <Select 
        {...register('status', { required: 'Status is required' })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Project Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="In Production">In Production</SelectItem>
          <SelectItem value="Pre-Production">Pre-Production</SelectItem>
          <SelectItem value="Post-Production">Post-Production</SelectItem>
        </SelectContent>
      </Select>
      {errors.status && <p className="text-red-500">{errors.status.message}</p>}

      <Textarea 
        {...register('description', { required: 'Description is required' })}
        placeholder="Project Description" 
      />
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}

      <Button type="submit" className="w-full">Add Experience</Button>
    </form>
  );
};

export default AddExperienceForm;
