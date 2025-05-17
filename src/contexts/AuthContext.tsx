
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
  register: (userData: RegisterData) => Promise<{success: boolean, requiresEmailConfirmation: boolean, error?: string}>;
  logout: () => void;
  openAuthModal: () => void;
  resendConfirmationEmail: (email: string) => Promise<boolean>;
  checkEmailExists: (email: string) => Promise<boolean>;
  checkCPFExists: (cpf: string) => Promise<boolean>;
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
      // Proceed with login attempt
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        console.error("Login error:", error);

        // Traduzir mensagens de erro específicas
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email não confirmado",
            description: "Por favor, verifique seu email e clique no link de confirmação ou solicite um novo email de confirmação.",
            variant: "destructive",
          });
          
          return false;
        }
        
        // Mapeamento de erros comuns para mensagens em português
        let errorMessage = "Verifique suas credenciais e tente novamente.";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Usuário não encontrado.";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Formato de email inválido.";
        }
        
        toast({
          title: "Erro ao fazer login",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
      
      // Check if email is confirmed after successful login
      if (!data.user?.email_confirmed_at) {
        toast({
          title: "Email não confirmado",
          description: "Por favor, verifique seu email e clique no link de confirmação ou solicite um novo email de confirmação.",
          variant: "destructive",
        });
        
        // Sign out the user since they shouldn't be logged in without email confirmation
        await supabase.auth.signOut();
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

  // Check if email already exists
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });

      // If there's no error in the OTP request, the user exists
      // But we might still get a different error that's not related to user existence
      if (error) {
        if (error.message.includes("User not found")) {
          return false; // User does not exist
        }
        // Any other error indicates the user might exist, but there was a different issue
        return true;
      }

      // If we got data back, the user exists
      return true;
    } catch (error) {
      console.error("Error checking if email exists:", error);
      // Default to false to prevent blocking registration in case of errors
      return false;
    }
  };

  // Check if CPF already exists using our new database function
  const checkCPFExists = async (cpf: string): Promise<boolean> => {
    try {
      if (!cpf) return false;
      
      // Call our database function to check if CPF exists
      const { data, error } = await supabase.rpc('check_cpf_exists', {
        cpf_value: cpf
      });
      
      if (error) {
        console.error("Error checking CPF:", error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error("Error checking if CPF exists:", error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<{success: boolean, requiresEmailConfirmation: boolean, error?: string}> => {
    setIsLoading(true);
    try {
      // First check if email already exists
      const emailExists = await checkEmailExists(userData.email);
      if (emailExists) {
        return { 
          success: false, 
          requiresEmailConfirmation: false,
          error: "Este email já está cadastrado. Tente fazer login ou recuperar sua senha."
        };
      }

      // Check if CPF already exists if provided
      if (userData.cpf) {
        const cpfExists = await checkCPFExists(userData.cpf);
        if (cpfExists) {
          return { 
            success: false, 
            requiresEmailConfirmation: false,
            error: "Este CPF já está cadastrado. Não é possível criar múltiplas contas com o mesmo CPF."
          };
        }
      }
      
      // Registrar o usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role || 'user',
            cpf: userData.cpf,
            birth_date: userData.birthDate
          }
        }
      });
      
      if (error) {
        console.error("Registration error:", error);
        
        // Traduzir mensagens de erro comuns para português
        let errorMessage = "Ocorreu um erro ao criar sua conta. Tente novamente.";
        
        if (error.message.includes("User already registered")) {
          errorMessage = "Este email já está cadastrado. Tente fazer login.";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "A senha deve ter pelo menos 6 caracteres.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        }
        
        return { success: false, requiresEmailConfirmation: false, error: errorMessage };
      }
      
      // After successful signup, update profile with CPF and birth date
      if (data.user && (userData.cpf || userData.birthDate)) {
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              cpf: userData.cpf,
              birth_date: userData.birthDate ? new Date(userData.birthDate).toISOString() : null
            })
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error("Error updating profile:", updateError);
          }
        } catch (profileError) {
          console.error("Error updating profile after registration:", profileError);
        }
      }
      
      // Verificar se o email precisa de confirmação
      const requiresEmailConfirmation = data?.user && !data.user.email_confirmed_at;
      
      if (requiresEmailConfirmation) {
        // Não mostrar toast aqui, deixar para o componente de registro decidir a melhor mensagem
        console.log("Email confirmation required for:", userData.email);
      }
      
      return { success: true, requiresEmailConfirmation: requiresEmailConfirmation || false };
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        requiresEmailConfirmation: false,
        error: "Ocorreu um erro ao criar sua conta. Tente novamente."
      };
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
        resendConfirmationEmail,
        checkEmailExists,
        checkCPFExists
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
