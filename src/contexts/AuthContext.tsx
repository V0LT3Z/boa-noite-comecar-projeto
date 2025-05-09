
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  resendConfirmationEmail: (email: string) => Promise<boolean>;
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
    const setupAuth = async () => {
      try {
        // Configurar listener para mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.id);
            await handleAuthChange(session);
          }
        );

        // Verificar sessão existente
        const { data: { session } } = await supabase.auth.getSession();
        await handleAuthChange(session);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Authentication error:", error);
        setIsLoading(false);
      }
    };
    
    setupAuth();
  }, []);

  const handleAuthChange = async (session: Session | null) => {
    if (session?.user) {
      const supabaseUser = session.user;
      
      try {
        // Verifica se existe um perfil para o usuário ou pega os metadados
        const userMeta = supabaseUser.user_metadata;
        const role = userMeta?.role || 'user';
        const fullName = userMeta?.full_name || userMeta?.name || 'Usuário';
        
        const userProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          fullName: fullName,
          role: role
        };
        
        console.log("User authenticated:", userProfile);
        setUser(userProfile);
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    } else {
      console.log("No authenticated user found");
      setUser(null);
    }
    
    setIsLoading(false);
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        console.error("Login error:", error);

        // Handle specific error cases
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email não confirmado",
            description: "Por favor, verifique seu email e clique no link de confirmação ou solicite um novo email de confirmação.",
            variant: "destructive",
          });
          
          return false;
        }
        
        toast({
          title: "Erro ao fazer login",
          description: error.message || "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
        variant: "default",
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
      // Registrar o usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role || 'user'
          }
        }
      });
      
      if (error) {
        console.error("Registration error:", error);
        toast({
          title: "Erro ao criar conta",
          description: error.message || "Ocorreu um erro ao criar sua conta. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }
      
      // Verificar se o email precisa de confirmação
      if (data?.user && !data.user.email_confirmed_at) {
        toast({
          title: "Quase lá!",
          description: "Por favor, verifique seu email e clique no link de confirmação para ativar sua conta.",
          variant: "default",
        });
      } else {
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao Lovue Tickets!",
          variant: "success",
        });
      }
      
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

  const resendConfirmationEmail = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        console.error("Error resending confirmation email:", error);
        toast({
          title: "Erro ao reenviar email",
          description: error.message || "Não foi possível reenviar o email de confirmação. Tente novamente mais tarde.",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Email reenviado!",
        description: "Verifique sua caixa de entrada pelo email de confirmação.",
        variant: "success",
      });
      return true;
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      toast({
        title: "Erro ao reenviar email",
        description: "Não foi possível reenviar o email de confirmação. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    console.log("Logging out user");
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
    }
    
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
      variant: "default",
    });
  };

  const openAuthModal = () => {
    console.log("Opening auth modal via context");
    document.dispatchEvent(new CustomEvent('openAuthModal'));
  };

  const isProducer = user?.role === 'producer' || user?.role === 'admin';

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
        openAuthModal,
        resendConfirmationEmail
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
