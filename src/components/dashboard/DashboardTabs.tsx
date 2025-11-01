
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
  Star,
  Layers,
  CreditCard
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const DashboardTabs = ({ activeTab, onTabChange, children }: DashboardTabsProps) => {
  const tabItems = [
    { value: "properties", label: "Properties", icon: Home },
    { value: "favorites", label: "Favorites", icon: Star },
    { value: "alerts", label: "Alerts", icon: Bell },
    { value: "documents", label: "Documents", icon: FileText },
    { value: "billing", label: "Billing", icon: CreditCard },
    { value: "lawyers", label: "Lawyers", icon: Users },
    { value: "utilities", label: "Utilities", icon: Tv },
    { value: "movers", label: "Movers", icon: Truck },
    { value: "schools", label: "Schools", icon: School },
    { value: "healthcare", label: "Healthcare", icon: HeartPulse },
    { value: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <div className="border rounded-md bg-white dark:bg-slate-800 mb-6 shadow-sm">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="w-full justify-start p-1 h-auto bg-transparent">
            {tabItems.map((item) => (
              <TabsTrigger 
                key={item.value} 
                value={item.value} 
                className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </div>
      
      {children}
    </Tabs>
  );
};

export default DashboardTabs;
