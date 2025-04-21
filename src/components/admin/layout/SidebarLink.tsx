
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

export const SidebarLink = ({ to, icon: Icon, label, active }: SidebarLinkProps) => (
  <Link to={to} className="w-full">
    <Button
      variant={active ? "default" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 h-10 font-medium", 
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
      {active && <ChevronRight className="ml-auto h-4 w-4" />}
    </Button>
  </Link>
);
