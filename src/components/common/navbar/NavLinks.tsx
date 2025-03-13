
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { ShieldCheck } from "lucide-react";

interface NavLinksProps {
  className?: string;
  onLinkClick?: () => void;
}

const NavLinks = ({ className, onLinkClick }: NavLinksProps) => {
  const { t } = useTranslation();
  
  const links = [
    { label: t('nav.home'), href: "/" },
    { label: t('nav.about'), href: "/about" },
    { label: t('nav.search'), href: "/search" },
    { 
      label: t('subscription.guardian'), 
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
    </nav>
  );
};

export default NavLinks;
