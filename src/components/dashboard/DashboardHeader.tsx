
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, ShieldCheck } from "lucide-react";
import { User } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  user: User;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">Manage your property search and relocation services</p>
      </div>
      <div className="mt-4 sm:mt-0 flex gap-2">
        <Button variant="outline" onClick={() => navigate("/questionnaire")} className="flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Property Search
        </Button>
        <Button variant="default" onClick={() => navigate("/questionnaire?service=guardian")} className="flex items-center">
          <ShieldCheck className="mr-2 h-4 w-4" />
          AI Guardian
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
