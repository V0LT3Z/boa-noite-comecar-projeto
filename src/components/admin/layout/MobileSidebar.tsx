
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavigationItem } from '@/types/admin';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import SidebarFooter from './SidebarFooter';

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
              <Logo />
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
            <SidebarFooter onLogout={onLogout} />
          </div>
        </SheetContent>
      </Sheet>
      <span className="text-lg font-gooddog md:hidden">NOKTA TICKETS Admin</span>
    </div>
  );
};

export default MobileSidebar;
