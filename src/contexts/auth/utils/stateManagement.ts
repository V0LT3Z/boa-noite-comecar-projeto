
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
