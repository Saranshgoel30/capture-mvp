
import React from 'react';
import { CheckCircle } from 'lucide-react';

const ApplicationSuccess: React.FC = () => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-center">
      <CheckCircle className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
      <p className="text-green-800 dark:text-green-300 font-medium">Application Submitted</p>
      <p className="text-green-600 dark:text-green-400 text-sm mt-1">
        You'll be notified if the creator responds.
      </p>
    </div>
  );
};

export default ApplicationSuccess;
