
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { RegisterData } from "./types";
import { checkCPFExists, checkEmailExists } from "./authUtils";

/**
 * Handles user login
 */
export const handleLogin = async (email: string, password: string): Promise<boolean> => {
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
  }
};

/**
 * Handles user registration
 */
export const handleRegister = async (userData: RegisterData): Promise<{success: boolean, requiresEmailConfirmation: boolean, error?: string}> => {
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
      console.log("Verificando CPF na função handleRegister:", userData.cpf);
      const cpfExists = await checkCPFExists(userData.cpf);
      console.log("Resultado da verificação de CPF:", cpfExists);
      
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
  }
};
