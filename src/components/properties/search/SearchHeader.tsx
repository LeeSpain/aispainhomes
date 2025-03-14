
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const SearchHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleActionClick = () => {
    if (user) {
      navigate('/questionnaire');
    } else {
      navigate('/register');
    }
  };
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Find Your Perfect Spanish Property</h1>
      <p className="text-muted-foreground mb-4">
        Create an account to browse our selection of premium properties throughout Spain and use our advanced search features.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={handleActionClick} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          {user ? 'Try Our AI Property Finder' : 'Register to Search Properties'}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/ai-guardian')}
          className="flex items-center gap-2"
        >
          <ShieldCheck className="h-4 w-4" />
          Learn About AI Guardian
        </Button>
      </div>
    </div>
  );
};

export default SearchHeader;
