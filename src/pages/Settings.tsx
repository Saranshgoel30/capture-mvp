
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleDeleteAllUsers = async () => {
    try {
      setIsDeleting(true);
      const { data, error } = await supabase.functions.invoke('delete_all_users');
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'All users (except your account) have been deleted',
        variant: 'default',
      });
    } catch (error: any) {
      console.error('Error deleting users:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete users: ' + (error.message || 'Unknown error'),
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
          
          <div className="space-y-8">
            {/* Profile Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Name</h3>
                    <p>{profile?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Email</h3>
                    <p>{user?.email || 'Not set'}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <a href={`/profile/${user.id}`}>Edit Profile</a>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Database Management Card */}
            <Card>
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
                <CardDescription>Advanced settings for database management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Warning: These actions are irreversible and affect the entire database.
                </p>
                
                <div className="space-y-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isDeleting}>
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete All Users (Except Me)
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will permanently delete all users from the database except your own account.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAllUsers}>Yes, Delete All Users</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
