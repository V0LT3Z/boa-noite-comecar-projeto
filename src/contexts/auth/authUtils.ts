
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Checks if an email is already registered
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
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
    return data || false;
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
