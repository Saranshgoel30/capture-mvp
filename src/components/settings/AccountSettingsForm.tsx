
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
import { Eye, EyeOff } from 'lucide-react';

const emailFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const AccountSettingsForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmitEmail(values: EmailFormValues) {
    if (!user) return;

    try {
      setIsUpdatingEmail(true);
      const { error } = await supabase.auth.updateUser({
        email: values.email,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Email Update Initiated',
        description: 'Check your new email for a confirmation link to complete the change.',
      });
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'There was an error updating your email',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  }

  async function onSubmitPassword(values: PasswordFormValues) {
    if (!user) return;

    try {
      setIsUpdatingPassword(true);
      
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: values.currentPassword,
      });
      
      if (signInError) {
        toast({
          title: 'Authentication Failed',
          description: 'Current password is incorrect',
          variant: 'destructive',
        });
        setIsUpdatingPassword(false);
        return;
      }
      
      // If current password is correct, update to new password
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (error) throw error;
      
      // Reset form fields
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated',
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'There was an error updating your password',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Email Update Form */}
      <div>
        <h3 className="text-lg font-medium mb-4">Update Email Address</h3>
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isUpdatingEmail || emailForm.getValues().email === user?.email}
            >
              {isUpdatingEmail ? 'Updating...' : 'Update Email'}
            </Button>
          </form>
        </Form>
      </div>

      {/* Password Update Form */}
      <div>
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showCurrentPassword ? "text" : "password"} 
                        placeholder="Current password" 
                        {...field} 
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="New password" 
                        {...field} 
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirm new password" 
                        {...field} 
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isUpdatingPassword || 
                !passwordForm.formState.isValid || 
                Object.keys(passwordForm.formState.errors).length > 0}
            >
              {isUpdatingPassword ? 'Updating...' : 'Change Password'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AccountSettingsForm;
