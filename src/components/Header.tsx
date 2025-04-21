import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, Bell, Heart, Home, Search, Menu, LogOut, Ticket, Store, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { 
  Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger 
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, active, children }) => {
  return (
    <Link
      to={href}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        active ? 'text-primary' : 'text-gray-500'
      }`}
    >
      {children}
    </Link>
  );
};

interface MobileNavProps {
  navItems: { label: string; href: string; icon: any }[];
  authenticatedItems: { label: string; href: string; icon: any }[];
  isAuthenticated: boolean;
  user: any;
  signOut: () => void;
  setIsAuthDialogOpen: (open: boolean) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  navItems, 
  authenticatedItems, 
  isAuthenticated, 
  user, 
  signOut, 
  setIsAuthDialogOpen 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-sm">
        <SheetHeader className="text-left">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.fullName || 'Usuário'}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          ) : null}
          <div className="space-y-1">
            {navItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link to={item.href}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              </SheetClose>
            ))}
            {isAuthenticated ? (
              <>
                {authenticatedItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link to={item.href}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive gap-2"
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setIsAuthDialogOpen(true);
                    setIsOpen(false);
                  }}
                >
                  Entrar
                </Button>
                <Button 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setIsAuthDialogOpen(true);
                    setIsOpen(false);
                  }}
                >
                  Cadastrar
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Header = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackButton = () => {
    if (isAuthenticated && location.pathname !== '/minha-conta') {
      navigate('/minha-conta');
    } else {
      navigate('/');
    }
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const navItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Marketplace', href: '/marketplace', icon: Store },
  ];

  const authenticatedItems = [
    { label: 'Meus Ingressos', href: '/meus-ingressos', icon: Ticket },
    { label: 'Favoritos', href: '/favoritos', icon: Heart },
    { label: 'Notificações', href: '/notificacoes', icon: Bell },
    { label: 'Minha Conta', href: '/minha-conta', icon: UserIcon },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {location.pathname !== '/' && location.pathname !== '/minha-conta' && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBackButton}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">
                {isAuthenticated ? 'Voltar para Dashboard' : 'Voltar para início'}
              </span>
            </Button>
          )}

          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-xl">
                EventHub
              </span>
            </Link>
            
            {!isMobile && (
              <nav className="flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-sm font-medium transition-all hover:text-primary ${
                      location.pathname === item.href 
                        ? 'text-primary relative after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-5 after:h-0.5 after:bg-primary after:rounded-full'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!isMobile && isAuthenticated && (
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
                        <AvatarFallback className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
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
                            <AvatarFallback className="bg-white text-primary text-xl">
                              {getInitials(user?.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-white">
                            <h3 className="font-semibold text-lg">{user?.fullName || 'Usuário'}</h3>
                            <p className="text-white/90 text-sm mt-1">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 py-4">
                        <div className="px-2 space-y-1">
                          {authenticatedItems.map((item) => (
                            <SheetClose asChild key={item.href}>
                              <Link to={item.href}>
                                <Button 
                                  variant="ghost" 
                                  className="w-full justify-start gap-3 h-12 px-4 hover:bg-primary/5 hover:text-primary"
                                >
                                  <item.icon className="h-5 w-5" />
                                  <span className="font-medium">{item.label}</span>
                                </Button>
                              </Link>
                            </SheetClose>
                          ))}
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-3 h-12 px-4 text-destructive hover:bg-destructive/5 hover:text-destructive"
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
            )}

            {!isMobile && !isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost"
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="text-gray-600 hover:text-primary hover:bg-primary/5 border border-gray-200"
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                >
                  Cadastrar
                </Button>
              </div>
            ) : isMobile && (
              <MobileNav 
                navItems={navItems} 
                authenticatedItems={authenticatedItems}
                isAuthenticated={isAuthenticated}
                user={user}
                signOut={logout}
                setIsAuthDialogOpen={setIsAuthDialogOpen}
              />
            )}
          </div>
        </div>
      </div>

      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen}
        onSuccess={() => setIsAuthDialogOpen(false)}
      />
    </header>
  );
};

export default Header;
