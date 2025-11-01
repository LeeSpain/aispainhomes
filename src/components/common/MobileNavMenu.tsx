import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Home, Star, AlertCircle, CreditCard, Briefcase, FileText, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface MobileNavMenuProps {
  activeTab: string;
  activeSubTab: string | null;
  unreadAlertCount: number;
  favoritesCount: number;
  onTabChange: (tab: string) => void;
  onSubTabChange: (subTab: string) => void;
}

const MobileNavMenu = ({ 
  activeTab, 
  activeSubTab, 
  unreadAlertCount, 
  favoritesCount,
  onTabChange,
  onSubTabChange 
}: MobileNavMenuProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const navItems = [
    { id: 'properties', label: 'Properties', icon: Home },
    { 
      id: 'favorites', 
      label: 'Favorites', 
      icon: Star, 
      badge: favoritesCount > 0 ? favoritesCount : undefined 
    },
    { 
      id: 'alerts', 
      label: 'Alerts', 
      icon: AlertCircle, 
      badge: unreadAlertCount > 0 ? unreadAlertCount : undefined 
    },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { 
      id: 'services', 
      label: 'Services', 
      icon: Briefcase,
      subItems: [
        { id: 'lawyers', label: 'Legal' },
        { id: 'utilities', label: 'Utilities' },
        { id: 'movers', label: 'Moving' },
        { id: 'schools', label: 'Education' },
        { id: 'healthcare', label: 'Healthcare' },
      ]
    },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    if (item.subItems) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else {
      onTabChange(item.id);
      setIsOpen(false);
    }
  };

  const handleSubItemClick = (parentId: string, subItemId: string) => {
    onTabChange(parentId);
    onSubTabChange(subItemId);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Dashboard Menu</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-1">
          {navItems.map((item) => (
            <div key={item.id}>
              <Button
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="w-full justify-between"
                onClick={() => handleItemClick(item)}
              >
                <span className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </span>
                {item.subItems && (
                  expandedMenu === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {item.subItems && expandedMenu === item.id && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Button
                      key={subItem.id}
                      variant={activeSubTab === subItem.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-sm"
                      onClick={() => handleSubItemClick(item.id, subItem.id)}
                    >
                      {subItem.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavMenu;
