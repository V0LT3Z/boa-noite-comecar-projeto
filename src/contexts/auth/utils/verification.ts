
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
