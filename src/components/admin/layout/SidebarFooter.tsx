
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarFooterProps {
  onLogout: () => void;
}

export const SidebarFooter = ({ onLogout }: SidebarFooterProps) => {
  return (
    <div className="p-3 border-t">
      <Link to="/" className="w-full">
        <Button variant="outline" className="w-full justify-start gap-3 font-gooddog">
          <Home size={18} />
          <span>Voltar ao site</span>
        </Button>
      </Link>
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-3 mt-2 text-destructive hover:text-destructive hover:bg-destructive/10 font-gooddog"
        onClick={onLogout}
      >
        <LogOut size={18} />
        <span>Sair</span>
      </Button>
    </div>
  );
};

export default SidebarFooter;
