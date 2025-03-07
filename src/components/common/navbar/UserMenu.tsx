
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface UserMenuProps {
  user: { name: string; email?: string } | null;
  onLogout: () => void;
  minimal?: boolean;
}

const UserMenu = ({ user, onLogout, minimal = false }: UserMenuProps) => {
  const navigate = useNavigate();
  
  // Check if user is admin (for demo, we'll consider admin@example.com as admin)
  const isAdmin = user?.email === 'admin@example.com';
  
  if (!user) {
    return minimal ? null : (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
          Login
        </Button>
        <Button size="sm" onClick={() => navigate('/register')}>
          Sign Up
        </Button>
      </div>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!minimal && (
          <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          Dashboard
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate('/admin')}>
            Admin Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
