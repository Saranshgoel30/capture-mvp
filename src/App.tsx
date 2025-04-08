import { Route, Routes, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { initializeStorage } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Messages from './pages/Messages';
import Chatroom from './pages/Chatroom';
import ProjectDetails from './pages/ProjectDetails';
import FindCreators from './pages/FindCreators';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import MyProjects from './pages/MyProjects';
import OwnerDashboard from './pages/OwnerDashboard';

function App() {
  const { toast } = useToast();
  
  // Initialize storage buckets when the app loads
  useEffect(() => {
    // Run storage initialization in the background
    const initStorage = async () => {
      try {
        console.log('Starting storage initialization...');
        const result = await initializeStorage();
        if (result) {
          console.log('Storage initialization successful');
        } else {
          console.warn('Storage initialization may not have completed successfully');
          // Don't show an error to the user, just log it
        }
      } catch (error) {
        console.error('Failed to initialize storage:', error);
        toast({
          title: "Storage Initialization Warning",
          description: "Some features like file uploads might not work properly. Please refresh the page or contact support if issues persist.",
          variant: "destructive",
        });
      }
    };
    
    initStorage();
  }, [toast]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:userId" element={<Messages />} />
        <Route path="/chatroom" element={<Chatroom />} />
        <Route path="/find-creators" element={<FindCreators />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
