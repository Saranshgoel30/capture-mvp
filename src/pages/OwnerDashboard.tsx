
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { User } from '@supabase/supabase-js';

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    totalChatMessages: 0
  });

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      // Total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Total projects
      const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact' });

      // Total chat messages
      const { count: totalChatMessages } = await supabase
        .from('chatroom_messages')
        .select('*', { count: 'exact' });

      setDashboardStats({
        totalUsers: totalUsers ?? 0,
        activeUsers: 0, // TODO: Implement active user tracking
        totalProjects: totalProjects ?? 0,
        totalChatMessages: totalChatMessages ?? 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      });
    }
  };

  // Fetch chat messages
  const fetchChatMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chatroom_messages')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setChatMessages(data || []);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch chat messages',
        variant: 'destructive'
      });
    }
  };

  // Delete a user
  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      
      // Remove user from local state
      setUsers(users.filter(u => u.id !== userId));
      
      toast({
        title: 'User Deleted',
        description: 'The user has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
    }
  };

  // Delete a chat message
  const deleteChatMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chatroom_messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
      
      // Remove message from local state
      setChatMessages(chatMessages.filter(msg => msg.id !== messageId));
      
      toast({
        title: 'Message Deleted',
        description: 'The chat message has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
      fetchUsers();
      fetchChatMessages();
    }
  }, [user]);

  // Check if the user is an admin
  if (!user || !['saransh.goel_ug25@ashoka.edu.in', 'saranshsgoel@gmail.com'].includes(user.email || '')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>
        
        <Tabs defaultValue="statistics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="chat">Community Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <h3 className="text-lg font-semibold">Total Users</h3>
                  <p className="text-2xl">{dashboardStats.totalUsers}</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <h3 className="text-lg font-semibold">Total Projects</h3>
                  <p className="text-2xl">{dashboardStats.totalProjects}</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <h3 className="text-lg font-semibold">Active Users</h3>
                  <p className="text-2xl">{dashboardStats.activeUsers}</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <h3 className="text-lg font-semibold">Total Chat Messages</h3>
                  <p className="text-2xl">{dashboardStats.totalChatMessages}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>List of all registered users</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Last Sign In</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deleteUser(user.id)}
                          >
                            Delete User
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Community Chat Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Recent Chat Messages</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chatMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>{message.profiles?.full_name || 'Unknown User'}</TableCell>
                        <TableCell>{message.content}</TableCell>
                        <TableCell>{new Date(message.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deleteChatMessage(message.id)}
                          >
                            Delete Message
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboard;
