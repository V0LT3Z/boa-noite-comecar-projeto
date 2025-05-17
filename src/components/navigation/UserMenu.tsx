
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Heart, LogOut, Ticket, User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  user: any;
  isProducer: boolean;
  logout: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export const UserMenu = ({ user, isProducer, logout }: UserMenuProps) => {
  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const authenticatedItems: NavItem[] = [
    { label: 'Meus Ingressos', href: '/meus-ingressos', icon: Ticket },
    { label: 'Favoritos', href: '/favoritos', icon: Heart },
    { label: 'Notificações', href: '/notificacoes', icon: Bell },
    { label: 'Minha Conta', href: '/minha-conta', icon: User },
  ];

  const producerItems: NavItem[] = isProducer ? [
    { label: 'Painel Administrativo', href: '/admin', icon: Settings },
  ] : [];

  return (
    <div className="flex items-center gap-3">
      <Link to="/notificacoes">
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-gray-100"
        >
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>
      </Link>
      <Link to="/favoritos">
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-gray-100"
        >
          <Heart className="h-5 w-5 text-gray-600" />
        </Button>
      </Link>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="rounded-full p-2 h-9 w-9 hover:bg-soft-purple/10">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-gooddog">
                {getInitials(user?.fullName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-80 sm:w-96 p-0 border-l border-gray-100">
          <div className="flex flex-col h-full">
            <div className="p-6 bg-gradient-to-r from-primary to-secondary">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-white">
                  <AvatarFallback className="bg-white text-primary text-xl font-gooddog">
                    {getInitials(user?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <h3 className="font-semibold text-lg font-gooddog">{user?.fullName || 'Usuário'}</h3>
                  <p className="text-white/90 text-sm mt-1 font-gooddog">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 py-4">
              <div className="px-2 space-y-1">
                {producerItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link to={item.href}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-3 h-12 px-4 hover:bg-primary/5 hover:text-primary font-gooddog"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
                {authenticatedItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link to={item.href}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-3 h-12 px-4 hover:bg-primary/5 hover:text-primary font-gooddog"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 h-12 px-4 text-destructive hover:bg-destructive/5 hover:text-destructive font-gooddog"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sair</span>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserMenu;
