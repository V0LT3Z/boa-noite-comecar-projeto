
import React from 'react';
import { SidebarLink } from './SidebarLink';
import { NavigationItem } from '@/types/admin';
import Logo from './Logo';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
  navigationItems: NavigationItem[];
  currentPath: string;
  onLogout: () => void;
}

export const Sidebar = ({ navigationItems, currentPath, onLogout }: SidebarProps) => {
  return (
    <div className="h-full flex flex-col border-r bg-card">
      <div className="h-16 flex items-center px-4 border-b">
        <Logo />
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
      <SidebarFooter onLogout={onLogout} />
    </div>
  );
};

export default Sidebar;
