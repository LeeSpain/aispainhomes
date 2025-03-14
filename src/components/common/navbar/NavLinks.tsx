
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Info, Home, ShieldCheck, Building2, Zap, Users } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLinksProps {
  className?: string;
  onLinkClick?: () => void;
}

const NavLinks = ({ className, onLinkClick }: NavLinksProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const links = [
    { label: t('nav.home'), href: "/", icon: <Home className="h-4 w-4" /> },
    { label: t('nav.about'), href: "/about", icon: <Info className="h-4 w-4" /> },
    { 
      label: "Property", 
      href: "/property",
      icon: <Building2 className="h-4 w-4" />
    },
    { 
      label: "AI Guardian", 
      href: "/ai-guardian",
      icon: <ShieldCheck className="h-4 w-4" />
    },
  ];

  // Add Admin Dashboard link if user is admin
  if (user?.email === 'admin@example.com') {
    links.push({
      label: t('nav.admin_dashboard'),
      href: "/admin",
      icon: <Zap className="h-4 w-4" />
    });
  }

  const handleClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <nav className={cn("hidden md:flex gap-1", className)}>
      {links.map((link) => (
        <Button
          key={link.href}
          variant="ghost"
          asChild
          onClick={handleClick}
        >
          <Link to={link.href} className="flex items-center gap-1">
            {link.icon}
            {link.label}
          </Link>
        </Button>
      ))}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="default"
            className="ml-2 flex items-center gap-1"
          >
            <Zap className="h-4 w-4" />
            {t('nav.quick_access')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <a href="/dashboard" className="flex items-center gap-2 w-full">
              <Users className="h-4 w-4" />
              {t('nav.user_dashboard')}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href="/admin" className="flex items-center gap-2 w-full">
              <Zap className="h-4 w-4" />
              {t('nav.admin_dashboard')}
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default NavLinks;
