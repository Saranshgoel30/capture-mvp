
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { initializeStorage } from '@/lib/supabase';

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

function App() {
  // Initialize storage buckets when the app loads
  useEffect(() => {
    // Run storage initialization in the background
    const initStorage = async () => {
      try {
        await initializeStorage();
      } catch (error) {
        console.error('Failed to initialize storage:', error);
      }
    };
    
    initStorage();
  }, []);

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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
