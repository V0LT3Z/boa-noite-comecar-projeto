
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavigationItem } from '@/types/admin';

interface MobileSidebarProps {
  navigationItems: NavigationItem[];
  currentPath: string;
  onLogout: () => void;
}

export const MobileSidebar = ({ navigationItems, currentPath, onLogout }: MobileSidebarProps) => {
  return (
    <div className="md:hidden flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-full flex flex-col">
            <div className="h-16 flex items-center px-4 border-b">
              <span className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NOKTA TICKETS Admin
              </span>
            </div>
            <div className="flex-1 flex flex-col p-3 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={currentPath === item.path ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3", 
                      currentPath === item.path ? "bg-primary text-primary-foreground" : ""
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
            <div className="p-3 border-t">
              <Link to="/">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Home size={18} />
                  <span>Voltar ao site</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 mt-2 text-destructive hover:text-destructive"
                onClick={onLogout}
              >
                <LogOut size={18} />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <span className="text-lg font-semibold md:hidden">NOKTA TICKETS Admin</span>
    </div>
  );
};
