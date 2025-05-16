
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User as UserIcon, Bell, Heart, Home, Menu, ArrowLeft, Store, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from '@/components/SearchBar';
import { useSearchParams } from 'react-router-dom';

// Import refactored components
import UserMenu from '@/components/navigation/UserMenu';
import MobileNav from '@/components/navigation/MobileNav';
import NavLink from '@/components/navigation/NavLink';

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { isAuthenticated, user, logout, isProducer } = useAuth();
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

  const handleSearch = (query: string) => {
    // Update URL with search query
    setSearchParams(query ? { q: query } : {});
  };

  const navItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Marketplace', href: '/marketplace', icon: Store },
  ];

  const authenticatedItems = [
    { label: 'Meus Ingressos', href: '/meus-ingressos', icon: Bell },
    { label: 'Favoritos', href: '/favoritos', icon: Heart },
    { label: 'Notificações', href: '/notificações', icon: Bell },
    { label: 'Minha Conta', href: '/minha-conta', icon: UserIcon },
  ];

  const producerItems = isProducer ? [
    { label: 'Painel Administrativo', href: '/admin', icon: LayoutDashboard },
  ] : [];

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
              <span className="font-gooddog text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NOKTA TICKETS
              </span>
            </Link>
            
            {!isMobile && (
              <nav className="flex items-center gap-6">
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

          {/* Barra de pesquisa centralizada com tamanho reduzido */}
          {location.pathname === '/' && (
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-[280px]">
              <SearchBar 
                onSearch={handleSearch}
                defaultQuery={searchQuery}
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            {!isMobile && isAuthenticated && (
              <UserMenu 
                user={user}
                isProducer={isProducer}
                logout={logout}
              />
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
                authenticatedItems={[...producerItems, ...authenticatedItems]}
                isAuthenticated={isAuthenticated}
                user={user}
                signOut={logout}
                setIsAuthDialogOpen={setIsAuthDialogOpen}
              />
            )}
          </div>
        </div>
      </div>

      {/* Barra de pesquisa para dispositivos móveis */}
      {isMobile && location.pathname === '/' && (
        <div className="px-4 py-2">
          <SearchBar 
            onSearch={handleSearch}
            defaultQuery={searchQuery}
          />
        </div>
      )}

      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen}
        onSuccess={() => setIsAuthDialogOpen(false)}
      />
    </header>
  );
};

export default Header;
