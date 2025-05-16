
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, LogOut, Store, Bell, Heart } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MobileNavProps {
  navItems: { label: string; href: string; icon: React.ElementType }[];
  authenticatedItems: { label: string; href: string; icon: React.ElementType }[];
  isAuthenticated: boolean;
  user: any;
  signOut: () => void;
  setIsAuthDialogOpen: (open: boolean) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ 
  navItems, 
  authenticatedItems, 
  isAuthenticated, 
  user, 
  signOut, 
  setIsAuthDialogOpen 
}) => {
  const [isOpen, setIsOpen] = useState(false);

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

export default MobileNav;
