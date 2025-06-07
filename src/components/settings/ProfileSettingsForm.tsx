
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
import { X } from 'lucide-react';
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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click the camera icon to upload a new profile picture
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
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
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
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about yourself" 
                    className="resize-none" 
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
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Your city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Skills</FormLabel>
            <div className="flex items-center gap-2 mb-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch('skills')?.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeSkill(skill)} 
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <FormLabel>Roles</FormLabel>
            <div className="flex items-center gap-2 mb-2">
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Add a role"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRole();
                  }
                }}
              />
              <Button type="button" onClick={addRole}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch('roles')?.map((role) => (
                <Badge key={role} variant="secondary" className="flex items-center gap-1">
                  {role}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeRole(role)} 
                  />
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileSettingsForm;
