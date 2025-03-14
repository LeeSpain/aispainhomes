
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, ShieldCheck, Bell, Search } from "lucide-react";
import { User } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  user: User;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, <span className="text-primary">{user.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Your AI Guardian is monitoring your property search and relocation needs
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate("/questionnaire")} className="flex items-center">
            <Home className="mr-1 h-4 w-4" />
            Property Search
          </Button>
          <Button size="sm" variant="default" onClick={() => navigate("/questionnaire?service=guardian")} className="flex items-center">
            <ShieldCheck className="mr-1 h-4 w-4" />
            AI Guardian
          </Button>
          <Button size="sm" variant="ghost" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 px-1 py-0.5 min-w-4 h-4 flex items-center justify-center text-[10px]">3</Badge>
          </Button>
        </div>
      </div>
      <div className="mt-4 flex">
        <div className="bg-muted/50 px-3 py-1 rounded-md text-sm text-muted-foreground flex items-center">
          <Search className="h-3 w-3 mr-1" />
          <span>Quick tip: Use AI Guardian chat to get personalized assistance with your property search</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
