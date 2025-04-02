
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Settings: React.FC = () => {
  const { user, profile } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
