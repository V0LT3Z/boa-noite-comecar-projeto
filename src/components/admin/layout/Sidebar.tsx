
import { Link } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarLink } from './SidebarLink';
import { NavigationItem } from '@/types/admin';

interface SidebarProps {
  navigationItems: NavigationItem[];
  currentPath: string;
  onLogout: () => void;
}

export const Sidebar = ({ navigationItems, currentPath, onLogout }: SidebarProps) => {
  return (
    <div className="h-full flex flex-col border-r bg-card">
      <div className="h-16 flex items-center px-4 border-b">
        <Link to="/admin" className="flex items-center">
          <span className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            NOKTA TICKETS Admin
          </span>
        </Link>
      </div>
      <div className="flex-1 flex flex-col p-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <SidebarLink 
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.path}
          />
        ))}
      </div>
      <div className="p-3 border-t">
        <Link to="/" className="w-full">
          <Button variant="outline" className="w-full justify-start gap-3">
            <Home size={18} />
            <span>Voltar ao site</span>
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
};
