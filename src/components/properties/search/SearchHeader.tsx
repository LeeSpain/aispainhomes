
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from "lucide-react";

const SearchHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Find Your Perfect Spanish Property</h1>
      <p className="text-muted-foreground mb-4">
        Browse our selection of premium properties throughout Spain or use our advanced filters to find exactly what you're looking for.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={() => navigate('/questionnaire')}>
          Try Our AI Property Finder
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
