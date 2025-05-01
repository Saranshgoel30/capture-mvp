
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react'; // Import the Shield icon

const Navbar = () => {
  const { user } = useAuth();
  
  // Function to check if user is admin
  const isAdmin = () => {
    // You can implement your admin check logic here
    // For example, checking a specific user ID or a role in the user object
    return user && (user.email === 'admin@example.com' || user.id === 'your-admin-user-id');
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Logo and other navbar items */}
        {isAdmin() && (
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 flex items-center" 
            onClick={() => window.location.href = '/admin-dashboard'}
          >
            <Shield className="mr-2 h-4 w-4" />
            Admin Dashboard
          </Button>
        )}
        
        {/* User menu and other items */}
      </div>
    </nav>
  );
};

export default Navbar;
