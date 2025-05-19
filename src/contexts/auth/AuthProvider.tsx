
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
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
} from './utils';
import { handleLogin, handleRegister } from './authServices';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const lastSessionCheckRef = useRef<number>(0);
  const authErrorCountRef = useRef<number>(0);
  
  // Session validation function
  const validateSession = async (session: Session | null) => {
    if (!session) return false;
    
    try {
      // Don't check too frequently (limit to once every 30 seconds)
      const now = Date.now();
      if (now - lastSessionCheckRef.current < 30000) {
        return true; // Skip check if too recent
      }
      lastSessionCheckRef.current = now;
      
      // Check if user still exists by looking up profile (doesn't trigger RLS issues)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error validating user session:", error);
        authErrorCountRef.current += 1;
        
        // If we get too many errors, assume session is invalid
        if (authErrorCountRef.current >= 3) {
          return false;
        }
        
        // Benefit of doubt on first few errors (might be network issues)
        return true;
      }
      
      // Reset error counter on successful check
      authErrorCountRef.current = 0;
      
      // If profile exists, session is valid
      return !!profile;
    } catch (error) {
      console.error("Exception during session validation:", error);
      return true; // Benefit of the doubt on exceptions
    }
  };

  // Handle cleanup on session error
  const handleSessionError = async (errorMessage: string) => {
    setSessionError(errorMessage);
    setUser(null);
    await forceClearAuthCache();
    
    toast({
      title: "Problema de autenticação",
      description: errorMessage,
      variant: "destructive",
    });
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Configurar listener para mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.id);
            
            // Verify session integrity for SIGNED_IN and TOKEN_REFRESHED events
            if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
              // Use setTimeout to avoid potential deadlocks with Supabase client
              setTimeout(async () => {
                const isValid = await validateSession(session);
                if (!isValid) {
                  console.error("Session validation failed - user may have been deleted");
                  await handleSessionError("Sua sessão expirou ou não é mais válida. Por favor, faça login novamente.");
                  return;
                }
                await handleAuthChange(session);
              }, 0);
            } else {
              await handleAuthChange(session);
            }
          }
        );

        // Verificar sessão existente
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const isValid = await validateSession(session);
          if (!isValid) {
            console.error("Initial session validation failed - user may have been deleted");
            await handleSessionError("Sua sessão expirou ou não é mais válida. Por favor, faça login novamente.");
          } else {
            await handleAuthChange(session);
          }
        } else {
          setIsLoading(false);
        }
        
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
    
    // Clear state first
    setUser(null);
    
    // Clean up auth state
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
    }
    
    // Force cleanup to ensure all tokens are cleared
    await forceClearAuthCache();
    
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
      variant: "default",
    });
  };
  
  // Add periodic session validation (every 5 minutes)
  useEffect(() => {
    const checkSessionPeriodically = async () => {
      if (user && user.id) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const isValid = await validateSession(session);
          if (!isValid) {
            console.warn("Periodic session check failed - user may have been deleted");
            await handleSessionError("Sua sessão expirou ou não é mais válida. Você será desconectado.");
            await logout();
          }
        }
      }
    };
    
    const interval = setInterval(checkSessionPeriodically, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [user]);

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
      {sessionError ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-center mb-3">Problema com sua sessão</h3>
            <p className="text-center text-gray-600 mb-4">{sessionError}</p>
            <div className="flex justify-center">
              <Button onClick={() => window.location.reload()} className="bg-gradient-primary">
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      ) : children}
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
