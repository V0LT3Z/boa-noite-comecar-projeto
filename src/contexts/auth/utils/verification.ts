
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
 * Normalize CPF by removing all non-digit characters
 */
const normalizeCPF = (cpf: string): string => {
  return cpf.replace(/[^\d]/g, "");
};

/**
 * Checks if a CPF is already registered
 */
export const checkCPFExists = async (cpf: string): Promise<boolean> => {
  try {
    if (!cpf) return false;
    
    // Normalize CPF to remove formatting
    const normalizedCPF = normalizeCPF(cpf);
    
    console.log("Checking if CPF exists:", cpf, "Normalized:", normalizedCPF);
    
    // First try using the database function with normalized CPF
    const { data: exists, error } = await supabase.rpc('check_cpf_exists', {
      cpf_value: normalizedCPF
    });
    
    if (error) {
      console.error("Error checking CPF with RPC:", error);
      
      // Try with the formatted CPF as fallback
      const { data: existsFormatted, error: errorFormatted } = await supabase.rpc('check_cpf_exists', {
        cpf_value: cpf
      });
      
      if (!errorFormatted && existsFormatted === true) {
        console.log("CPF exists with formatted version");
        return true;
      }
      
      // As a last resort fallback, directly query the profiles table with both formats
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .or(`cpf.eq.${normalizedCPF},cpf.eq.${cpf}`)
        .limit(1);
      
      if (profilesError) {
        console.error("Error checking CPF in profiles:", profilesError);
        return false;
      }
      
      console.log("CPF direct query result:", profiles);
      return profiles && profiles.length > 0;
    }
    
    console.log("CPF exists check RPC result:", exists);
    return !!exists;
  } catch (error) {
    console.error("Error checking if CPF exists:", error);
    return false;
  }
};
