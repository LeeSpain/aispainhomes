
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const SearchEmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-center">
      <Button variant="outline" onClick={() => navigate('/questionnaire')}>
        Can't find what you're looking for? Try our AI Property Finder
      </Button>
    </div>
  );
};

export default SearchEmptyState;
