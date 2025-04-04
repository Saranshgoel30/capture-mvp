
import React from 'react';
import { AlertCircle } from 'lucide-react';

const NoApplications: React.FC = () => {
  return (
    <div className="text-center py-8">
      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
      <h3 className="text-lg font-medium mb-1">No applications yet</h3>
      <p className="text-muted-foreground">
        When people apply to your project, their applications will appear here.
      </p>
    </div>
  );
};

export default NoApplications;
