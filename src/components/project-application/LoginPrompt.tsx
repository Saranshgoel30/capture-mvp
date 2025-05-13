
import React from 'react';
import { User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const LoginPrompt: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
      <User className="h-8 w-8 mx-auto text-gray-400 mb-2" />
      <p className="text-gray-600 dark:text-gray-300 mb-2">Sign in to apply for this project</p>
      <Button
        variant="outline"
        onClick={() => navigate('/login')}
      >
        Sign In
      </Button>
    </div>
  );
};

export default LoginPrompt;
