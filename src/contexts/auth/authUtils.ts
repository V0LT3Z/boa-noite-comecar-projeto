import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Checks if an email is already registered
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    // Primeiro, verificamos diretamente na tabela de usuários usando a função de RPC
    // para evitar problemas com cache ou estado temporário
    const { data: userExists, error: userCheckError } = await supabase
      .rpc('check_email_exists', { email_value: email });
    
    if (!userCheckError && userExists === false) {
      return false;
    }
    
    // Como fallback, tentamos o método OTP que é menos confiável
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      }
    });

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

/**
 * Checks if a CPF is already registered
 */
export const checkCPFExists = async (cpf: string): Promise<boolean> => {
  try {
    if (!cpf) return false;
    
    console.log("Checking if CPF exists:", cpf);
    
    // Call our database function to check if CPF exists
    const { data, error } = await supabase.rpc('check_cpf_exists', {
      cpf_value: cpf
    });
    
    if (error) {
      console.error("Error checking CPF:", error);
      return false;
    }
    
    console.log("CPF exists check result:", data);
    return !!data; // Converte explicitamente para boolean
  } catch (error) {
    console.error("Error checking if CPF exists:", error);
    return false;
  }
};

/**
 * Resends confirmation email for registration
 */
export const resendConfirmationEmail = async (email: string): Promise<boolean> => {
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

/**
 * Cleans up auth state in local storage
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Força a limpeza do cache de autenticação
 * Use esta função quando houver problemas com emails que parecem ainda estar cadastrados
 */
export const forceClearAuthCache = async () => {
  try {
    // Primeiro limpa todo o estado local de autenticação
    cleanupAuthState();
    
    // Força desconexão em todos os dispositivos
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.error("Erro ao forçar desconexão global:", err);
    }
    
    // Limpa o cache do navegador para a origem do Supabase
    if (window.caches) {
      try {
        const keys = await window.caches.keys();
        for (const key of keys) {
          if (key.includes('supabase') || key.includes('auth')) {
            await window.caches.delete(key);
          }
        }
      } catch (err) {
        console.error("Erro ao limpar cache do navegador:", err);
      }
    }
    
    // Informa ao usuário que deve limpar os cookies e cache do navegador
    toast({
      title: "Cache de autenticação limpo",
      description: "Recomendamos limpar os cookies do navegador e recarregar a página para garantir uma experiência sem problemas.",
      variant: "default",
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao limpar cache de autenticação:", error);
    return false;
  }
};

/**
 * Remove completamente um cadastro por email
 */
export const completelyRemoveUserByEmail = async (email: string): Promise<boolean> => {
  try {
    if (!email) return false;
    
    // Isso requer função no banco de dados com permissões específicas
    const { data, error } = await supabase.functions.invoke('remove-user-by-email', {
      body: { email }
    });
    
    if (error) {
      console.error("Erro ao remover usuário:", error);
      toast({
        title: "Erro ao remover cadastro",
        description: "Não foi possível remover completamente o cadastro. Entre em contato com o suporte.",
        variant: "destructive",
      });
      return false;
    }
    
    // Limpa o cache local
    await forceClearAuthCache();
    
    toast({
      title: "Cadastro removido com sucesso!",
      description: "O email foi completamente removido do sistema e pode ser utilizado novamente.",
      variant: "success",
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao remover cadastro:", error);
    return false;
  }
};
