
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import ProfileImage from '@/components/profile/ProfileImage';

const formSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  city: z.string().optional(),
  skills: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

const ProfileSettingsForm: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      city: profile?.city || '',
      skills: profile?.skills || [],
      roles: profile?.roles || [],
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    if (!user) return;

    try {
      const result = await updateProfile(values);
      
      if (result) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your profile',
        variant: 'destructive',
      });
    }
  }

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const currentSkills = form.getValues().skills || [];
    if (!currentSkills.includes(newSkill)) {
      form.setValue('skills', [...currentSkills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    const currentSkills = form.getValues().skills || [];
    form.setValue('skills', currentSkills.filter(s => s !== skill));
  };

  const addRole = () => {
    if (!newRole.trim()) return;
    
    const currentRoles = form.getValues().roles || [];
    if (!currentRoles.includes(newRole)) {
      form.setValue('roles', [...currentRoles, newRole]);
      setNewRole('');
    }
  };

  const removeRole = (role: string) => {
    const currentRoles = form.getValues().roles || [];
    form.setValue('roles', currentRoles.filter(r => r !== role));
  };

  const handleAvatarUpdate = async (newAvatarUrl: string) => {
    try {
      await updateProfile({ avatar_url: newAvatarUrl });
      toast({
        title: 'Profile Picture Updated',
        description: 'Your profile picture has been successfully updated',
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your profile picture',
        variant: 'destructive',
      });
    }
  };

  if (!user || !profile) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Profile Image Section - Mobile Optimized */}
      <div className="flex flex-col items-center space-y-4 text-center">
        <div>
          <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
          <p className="text-sm text-muted-foreground mb-4 px-4">
            Tap the camera icon to upload a new profile picture
          </p>
        </div>
        <ProfileImage 
          avatar={profile.avatar_url} 
          name={profile.full_name} 
          userId={user.id}
          size="lg"
          onAvatarUpdate={handleAvatarUpdate}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your name" 
                    className="h-12 text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about yourself" 
                    className="resize-none min-h-[100px] text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Location</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your city" 
                    className="h-12 text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Skills Section - Mobile Optimized */}
          <div className="space-y-3">
            <FormLabel className="text-base">Skills</FormLabel>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 h-12 text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={addSkill}
                className="h-12 px-6 whitespace-nowrap"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {form.watch('skills')?.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="flex items-center gap-2 py-2 px-3 text-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Roles Section - Mobile Optimized */}
          <div className="space-y-3">
            <FormLabel className="text-base">Roles</FormLabel>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Add a role"
                className="flex-1 h-12 text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRole();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={addRole}
                className="h-12 px-6 whitespace-nowrap"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {form.watch('roles')?.map((role) => (
                <Badge 
                  key={role} 
                  variant="secondary" 
                  className="flex items-center gap-2 py-2 px-3 text-sm"
                >
                  <span>{role}</span>
                  <button
                    type="button"
                    onClick={() => removeRole(role)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base font-medium">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileSettingsForm;
