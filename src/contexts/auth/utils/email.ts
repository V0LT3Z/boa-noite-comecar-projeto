
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
