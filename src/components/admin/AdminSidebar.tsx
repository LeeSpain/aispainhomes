import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Globe, 
  Bot, 
  Settings,
  Server,
  Menu,
  X,
  FileText,
  Wallet
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'websites', label: 'Website Tracking', icon: Globe },
  { id: 'resources', label: 'Official Resources', icon: FileText },
  { id: 'stripe', label: 'Stripe Settings', icon: Wallet },
  { id: 'ai', label: 'AI Settings', icon: Bot },
  { id: 'system', label: 'System', icon: Settings },
];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Server className="h-6 w-6 text-primary-foreground" />
          </div>
          {open && (
            <div>
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">System Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={cn(
                      "w-full justify-start",
                      activeTab === item.id && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {open && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {open && (
          <div className="space-y-1">
            <p className="text-xs font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@example.com</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
