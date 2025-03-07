
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Home, 
  Settings, 
  FileText, 
  Users,
  Tv,
  Truck,
  School,
  HeartPulse,
  Star
} from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const DashboardTabs = ({ activeTab, onTabChange, children }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-8">
      <TabsList className="w-full overflow-x-auto py-2">
        <TabsTrigger value="properties" className="flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Properties
        </TabsTrigger>
        <TabsTrigger value="favorites" className="flex items-center">
          <Star className="mr-2 h-4 w-4" />
          Favorites
        </TabsTrigger>
        <TabsTrigger value="alerts" className="flex items-center">
          <Bell className="mr-2 h-4 w-4" />
          Alerts
        </TabsTrigger>
        <TabsTrigger value="lawyers" className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Lawyers
        </TabsTrigger>
        <TabsTrigger value="utilities" className="flex items-center">
          <Tv className="mr-2 h-4 w-4" />
          Utilities
        </TabsTrigger>
        <TabsTrigger value="movers" className="flex items-center">
          <Truck className="mr-2 h-4 w-4" />
          Movers
        </TabsTrigger>
        <TabsTrigger value="schools" className="flex items-center">
          <School className="mr-2 h-4 w-4" />
          Schools
        </TabsTrigger>
        <TabsTrigger value="healthcare" className="flex items-center">
          <HeartPulse className="mr-2 h-4 w-4" />
          Healthcare
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          Documents
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default DashboardTabs;
