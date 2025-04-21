import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string | null;
  fullName: string;
  role?: 'user' | 'producer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProducer: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  openAuthModal: () => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  cpf?: string;
  birthDate?: string;
  role?: 'user' | 'producer' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        console.log("Checking authentication:", { hasUser: !!storedUser, hasToken: !!token });
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          console.log("User authenticated:", parsedUser);
          setUser(parsedUser);
        } else {
          console.log("No authenticated user found");
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
      
      console.log("User logged in:", userRecord.user);
      setUser(userRecord.user);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
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
        role: userData.role || 'user'
      };
      
      registeredUsers[userData.email] = {
        user: newUser,
        password: userData.password
      };
      
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      console.log("User registered:", newUser);
      setUser(newUser);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Lovue Tickets!",
      });
      
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
    console.log("Logging out user");
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    });
  };

  const openAuthModal = () => {
    console.log("Opening auth modal via context");
    document.dispatchEvent(new CustomEvent('openAuthModal'));
  };

  // Verificar se o usuário é um produtor
  const isProducer = !!user && (user.role === 'producer' || user.role === 'admin');

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isProducer,
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
