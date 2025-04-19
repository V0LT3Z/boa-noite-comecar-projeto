
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User as UserIcon, Bell, Heart, Home, Search, Menu, X, LogOut, Ticket, Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { 
  Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger 
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
                <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name || 'Usuário'}</p>
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    { label: 'Buscar', href: '/buscar', icon: Search },
    { label: 'Marketplace', href: '/marketplace', icon: Store },
  ];

  const authenticatedItems = [
    { label: 'Meus Ingressos', href: '/meus-ingressos', icon: Ticket },
    { label: 'Favoritos', href: '/favoritos', icon: Heart },
    { label: 'Notificações', href: '/notificacoes', icon: Bell },
    { label: 'Minha Conta', href: '/minha-conta', icon: UserIcon },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 bg-background transition-all ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-primary">EventHub</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  active={location.pathname === item.href}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* Desktop Authentication */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-2 h-9 w-9">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar} alt={user?.fullName || 'User'} />
                      <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} alt={user?.fullName || 'User'} />
                        <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.fullName || 'Usuário'}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {authenticatedItems.map((item) => (
                        <SheetClose asChild key={item.href}>
                          <Link to={item.href}>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start gap-2"
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
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsAuthDialogOpen(true)}
                >
                  Entrar
                </Button>
                <Button onClick={() => setIsAuthDialogOpen(true)}>
                  Cadastrar
                </Button>
              </>
            )}
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
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
      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen}
        onSuccess={() => {}}
      />
    </header>
  );
};

export default Header;
