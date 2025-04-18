import { LogIn, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { AuthDialog } from "./auth/AuthDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleAuthSuccess = () => {
    setIsAuthDialogOpen(false);
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-1" />
          <div className="text-3xl font-bold text-primary text-center flex-1">
            Ticket Hub
          </div>
          <div className="flex-1 flex justify-end">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                    aria-label="Menu do usuário"
                  >
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>{user?.fullName?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end"
                  className="w-56 bg-white dark:bg-gray-800 shadow-lg"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logout()}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                onClick={() => setIsAuthDialogOpen(true)}
                aria-label="Fazer login"
              >
                <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
        onSuccess={handleAuthSuccess} 
      />
    </header>
  );
};

export default Header;
