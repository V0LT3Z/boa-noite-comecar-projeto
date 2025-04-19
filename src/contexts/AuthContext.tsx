
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  email: string | null;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  openAuthModal: () => void; // Add this function to open auth modal
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  cpf?: string;
  birthDate?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const getRegisteredUsers = (): Record<string, { user: User, password: string }> => {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : {};
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const registeredUsers = getRegisteredUsers();
      const userRecord = registeredUsers[email];
      
      if (!userRecord || userRecord.password !== password) {
        toast({
          title: "Erro ao fazer login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
        return false;
      }
      
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(userRecord.user));
      
      setUser(userRecord.user);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando...",
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const registeredUsers = getRegisteredUsers();
      
      if (registeredUsers[userData.email]) {
        toast({
          title: "Erro ao criar conta",
          description: "Este email já está cadastrado.",
          variant: "destructive",
        });
        return false;
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        fullName: userData.fullName,
      };
      
      registeredUsers[userData.email] = {
        user: newUser,
        password: userData.password
      };
      
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    });
  };

  // New function to open auth modal
  const openAuthModal = () => {
    // This will be handled by the AuthDialog component
    // We're just providing the interface here
    // The actual implementation will be in the components that use this context
    document.dispatchEvent(new CustomEvent('openAuthModal'));
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: handleLogin,
        register,
        logout,
        openAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
