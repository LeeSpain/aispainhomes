
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavLinksProps {
  className?: string;
  onLinkClick?: () => void;
}

const NavLinks = ({ className, onLinkClick }: NavLinksProps) => {
  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Site Tracking", href: "/site-tracking" },
    { label: "Questionnaire", href: "/questionnaire" },
  ];

  const handleClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <nav className={cn("flex gap-1", className)}>
      {links.map((link) => (
        <Button
          key={link.href}
          variant="ghost"
          asChild
          onClick={handleClick}
        >
          <Link to={link.href}>{link.label}</Link>
        </Button>
      ))}
    </nav>
  );
};

export default NavLinks;
