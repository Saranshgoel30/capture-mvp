
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  X, User, Save, Camera, Loader2, BellRing, Link2, AtSign, 
  Github, Mail, Instagram, Globe, Twitter, Linkedin, Youtube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/supabase';

const Settings: React.FC = () => {
  const { user, profile, refreshUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    city: '',
    bio: '',
    avatar_url: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    website: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    github: '',
    youtube: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    projectMatches: true,
    messages: true,
    applications: true,
    marketing: false
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        city: profile.city || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
      setSkills(profile.skills || []);
      setRoles(profile.roles || []);
      
      // Set social links if they exist in the profile
      if (profile.social_links) {
        setSocialLinks({
          ...socialLinks,
          ...profile.social_links
        });
      }
    }
  }, [user, profile, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: checked }));
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addRole = () => {
    if (newRole && !roles.includes(newRole)) {
      setRoles([...roles, newRole]);
      setNewRole('');
    }
  };

  const removeRole = (roleToRemove: string) => {
    setRoles(roles.filter(role => role !== roleToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updates = {
        ...formData,
        skills,
        roles,
        social_links: socialLinks,
        notification_preferences: notifications
      };
      
      await updateUserProfile(user.id, updates);
      await refreshUserProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update profile',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-6 md:px-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas tracking-wider mb-8">SETTINGS</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information. This will be visible to other users.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={formData.avatar_url} alt={formData.full_name} />
                          <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                            {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : <User size={36} />}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                        >
                          <Camera size={14} />
                        </Button>
                      </div>
                      
                      <div className="space-y-4 flex-1">
                        <div>
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            placeholder="e.g., Los Angeles, CA"
                            value={formData.city}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell others about yourself..."
                        className="min-h-32"
                        value={formData.bio}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Label>Professional Roles</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          placeholder="e.g., Director, Cinematographer"
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
                    </div>
                    
                    <div>
                      <Label>Skills</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="e.g., Premiere Pro, After Effects"
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={addSkill}
                        >
                          Add
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="pl-2 pr-1 py-1 flex items-center gap-1">
                            {skill}
                            <button 
                              type="button" 
                              onClick={() => removeSkill(skill)}
                              className="ml-1 rounded-full hover:bg-muted p-1"
                            >
                              <X size={14} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/profile')}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>
                    Connect your social media accounts to your profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-[20px_1fr] items-center gap-4">
                      <Globe className="h-5 w-5" />
                      <div className="flex-1">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          name="website" 
                          placeholder="https://yourdomain.com" 
                          value={socialLinks.website}
                          onChange={handleSocialLinkChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[20px_1fr] items-center gap-4">
                      <Instagram className="h-5 w-5" />
                      <div className="flex-1">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input 
                          id="instagram" 
                          name="instagram" 
                          placeholder="username" 
                          value={socialLinks.instagram}
                          onChange={handleSocialLinkChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[20px_1fr] items-center gap-4">
                      <Twitter className="h-5 w-5" />
                      <div className="flex-1">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input 
                          id="twitter" 
                          name="twitter" 
                          placeholder="username" 
                          value={socialLinks.twitter}
                          onChange={handleSocialLinkChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[20px_1fr] items-center gap-4">
                      <Linkedin className="h-5 w-5" />
                      <div className="flex-1">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          id="linkedin" 
                          name="linkedin" 
                          placeholder="username or URL" 
                          value={socialLinks.linkedin}
                          onChange={handleSocialLinkChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[20px_1fr] items-center gap-4">
                      <Github className="h-5 w-5" />
                      <div className="flex-1">
                        <Label htmlFor="github">GitHub</Label>
                        <Input 
                          id="github" 
                          name="github" 
                          placeholder="username" 
                          value={socialLinks.github}
                          onChange={handleSocialLinkChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[20px_1fr] items-center gap-4">
                      <Youtube className="h-5 w-5" />
                      <div className="flex-1">
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input 
                          id="youtube" 
                          name="youtube" 
                          placeholder="channel name or URL" 
                          value={socialLinks.youtube}
                          onChange={handleSocialLinkChange}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Links
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Control which notifications you receive and how you receive them.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                        <span className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </span>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={notifications.email}
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="project-matches" className="text-base">Project Matches</Label>
                        <span className="text-sm text-muted-foreground">
                          Get notified about projects that match your skills
                        </span>
                      </div>
                      <Switch 
                        id="project-matches" 
                        checked={notifications.projectMatches}
                        onCheckedChange={(checked) => handleNotificationChange('projectMatches', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="messages" className="text-base">Messages</Label>
                        <span className="text-sm text-muted-foreground">
                          Receive notifications for new messages
                        </span>
                      </div>
                      <Switch 
                        id="messages" 
                        checked={notifications.messages}
                        onCheckedChange={(checked) => handleNotificationChange('messages', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="applications" className="text-base">Application Updates</Label>
                        <span className="text-sm text-muted-foreground">
                          Get notified about status changes to your applications
                        </span>
                      </div>
                      <Switch 
                        id="applications" 
                        checked={notifications.applications}
                        onCheckedChange={(checked) => handleNotificationChange('applications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="marketing" className="text-base">Marketing Emails</Label>
                        <span className="text-sm text-muted-foreground">
                          Receive updates about new features and events
                        </span>
                      </div>
                      <Switch 
                        id="marketing" 
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Email Address</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Authentication</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {user?.app_metadata?.provider || 'Email'}
                      </Badge>
                      {user?.app_metadata?.provider === 'google' && (
                        <span className="text-sm text-muted-foreground">Connected via Google</span>
                      )}
                      {user?.app_metadata?.provider === 'github' && (
                        <span className="text-sm text-muted-foreground">Connected via GitHub</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-4">
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
