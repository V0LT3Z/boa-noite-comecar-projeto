
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { forceClearAuthCache } from "./stateManagement";

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
