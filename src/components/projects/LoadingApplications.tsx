
import React from 'react';
import { Clock } from 'lucide-react';

const LoadingApplications: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <Clock className="animate-spin h-6 w-6 mr-2" />
      <span>Loading applications...</span>
    </div>
  );
};

export default LoadingApplications;
