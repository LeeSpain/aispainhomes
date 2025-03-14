
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Info, Home, ShieldCheck, UserPlus, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/auth";

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
      
      {!user && (
        <Button
          variant="default"
          asChild
          onClick={handleClick}
          className="ml-2"
        >
          <Link to="/register" className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            Register
          </Link>
        </Button>
      )}
    </nav>
  );
};

export default NavLinks;
