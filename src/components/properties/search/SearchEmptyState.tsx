
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const SearchEmptyState = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleClick = () => {
    if (user) {
      navigate('/questionnaire');
    } else {
      navigate('/register');
    }
  };
  
  return (
    <div className="flex justify-center">
      <Button variant="outline" onClick={handleClick}>
        Can't find what you're looking for? Try our AI Property Finder
      </Button>
    </div>
  );
};

export default SearchEmptyState;
