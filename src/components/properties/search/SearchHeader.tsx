
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const SearchHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Find Your Spanish Property</h1>
      <Button 
        onClick={() => navigate('/questionnaire')}
        className="flex items-center gap-2"
      >
        AI Property Finder <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchHeader;
