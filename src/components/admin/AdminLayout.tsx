
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedAdminRoute } from '@/hooks/use-protected-admin-route';
import { 
  Home, BarChart2, Calendar, Users, Settings,
  DollarSign, ScanLine, HelpCircle 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sidebar } from './layout/Sidebar';
import { MobileSidebar } from './layout/MobileSidebar';
import { NavigationItem } from '@/types/admin';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isLoading, isProducer } = useProtectedAdminRoute();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    { path: '/admin', label: 'Painel', icon: Home },
    { path: '/admin/eventos', label: 'Eventos', icon: Calendar },
    { path: '/admin/usuarios', label: 'Usuários', icon: Users },
    { path: '/admin/verificacao-qr', label: 'Verificação QR Code', icon: ScanLine },
    { path: '/admin/financeiro', label: 'Financeiro', icon: DollarSign },
    { path: '/admin/relatorios', label: 'Relatórios', icon: BarChart2 },
    { path: '/admin/suporte', label: 'Suporte', icon: HelpCircle },
    { path: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  ];

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
          <div className="h-full flex flex-col">
            <div className="h-16 flex items-center px-4 border-b">
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="flex-1 flex flex-col p-3 space-y-1 overflow-y-auto">
              {Array(8).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 md:pl-64">
          <div className="h-16 flex items-center px-4 border-b bg-white">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-40 ml-4" />
          </div>
          <div className="flex-1 p-6">
            <div className="grid gap-6">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isProducer) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Sidebar 
          navigationItems={navigationItems}
          currentPath={location.pathname}
          onLogout={logout}
        />
      </div>
      <div className="flex flex-col flex-1 md:pl-64">
        <header className="h-16 flex items-center px-4 border-b bg-white md:bg-transparent md:border-none sticky top-0 z-10">
          <div className="flex justify-between items-center w-full">
            <MobileSidebar 
              navigationItems={navigationItems}
              currentPath={location.pathname}
              onLogout={logout}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                Olá, {user?.fullName?.split(' ')[0]}
              </span>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
