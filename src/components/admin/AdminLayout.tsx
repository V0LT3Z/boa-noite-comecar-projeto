
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedAdminRoute } from '@/hooks/use-protected-admin-route';
import { 
  Home, BarChart2, Calendar, Users, Settings, LogOut, 
  Menu, ChevronRight, Music, Ticket, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, active }: SidebarLinkProps) => (
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

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isLoading, isProducer } = useProtectedAdminRoute();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { path: '/admin', label: 'Painel', icon: Home },
    { path: '/admin/eventos', label: 'Eventos', icon: Calendar },
    { path: '/admin/ingressos', label: 'Ingressos', icon: Ticket },
    { path: '/admin/artistas', label: 'Artistas', icon: Music },
    { path: '/admin/usuarios', label: 'Usuários', icon: Users },
    { path: '/admin/financeiro', label: 'Financeiro', icon: DollarSign },
    { path: '/admin/relatorios', label: 'Relatórios', icon: BarChart2 },
    { path: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  ];

  // Função auxiliar para obter as iniciais do nome do usuário
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
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="h-full flex flex-col border-r bg-card">
          <div className="h-16 flex items-center px-4 border-b">
            <Link to="/admin" className="flex items-center">
              <span className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EventHub Admin
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
                active={location.pathname === item.path}
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
              onClick={logout}
            >
              <LogOut size={18} />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 md:pl-64">
        {/* Header mobile */}
        <header className="h-16 flex items-center px-4 border-b bg-white md:bg-transparent md:border-none sticky top-0 z-10">
          <div className="flex justify-between items-center w-full">
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
                        EventHub Admin
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col p-3 space-y-1 overflow-y-auto">
                      {navigationItems.map((item) => (
                        <Link key={item.path} to={item.path}>
                          <Button
                            variant={location.pathname === item.path ? "default" : "ghost"}
                            className={cn(
                              "w-full justify-start gap-3", 
                              location.pathname === item.path ? "bg-primary text-primary-foreground" : ""
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
                        onClick={logout}
                      >
                        <LogOut size={18} />
                        <span>Sair</span>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <span className="text-lg font-semibold md:hidden">EventHub Admin</span>
            </div>
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

        {/* Conteúdo principal */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
