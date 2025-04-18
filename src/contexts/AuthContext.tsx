
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  fullName: string;
  email: string;
  cpf?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
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

  useEffect(() => {
    // Check if user is already logged in on mount
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

  // Helper function to get registered users from localStorage
  const getRegisteredUsers = (): Record<string, { user: User, password: string }> => {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : {};
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage
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
      
      // User exists and password matches
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      // Store auth data
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(userRecord.user));
      
      setUser(userRecord.user);
      
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email is already registered
      const registeredUsers = getRegisteredUsers();
      
      if (registeredUsers[userData.email]) {
        toast({
          title: "Erro ao criar conta",
          description: "Este email já está cadastrado.",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        fullName: userData.fullName,
        email: userData.email,
        cpf: userData.cpf,
      };
      
      // Store user in "database" (localStorage)
      registeredUsers[userData.email] = {
        user: newUser,
        password: userData.password
      };
      
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Auto-login after registration
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

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
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
