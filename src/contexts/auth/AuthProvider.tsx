
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import { AuthContextType, User, RegisterData } from './types';
import { 
  checkCPFExists, 
  checkEmailExists, 
  resendConfirmationEmail,
  forceClearAuthCache,
  completelyRemoveUserByEmail 
} from './authUtils';
import { handleLogin, handleRegister } from './authServices';

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

  const handleLoginWithLoading = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await handleLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterWithLoading = async (userData: RegisterData): Promise<{success: boolean, requiresEmailConfirmation: boolean, error?: string}> => {
    setIsLoading(true);
    try {
      return await handleRegister(userData);
    } finally {
      setIsLoading(false);
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
        login: handleLoginWithLoading,
        register: handleRegisterWithLoading,
        logout,
        openAuthModal,
        resendConfirmationEmail,
        checkEmailExists,
        checkCPFExists,
        clearAuthCache: forceClearAuthCache,
        removeUserByEmail: completelyRemoveUserByEmail
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
