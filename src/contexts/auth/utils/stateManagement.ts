
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
  
  // Remove redirectAfterLogin if it exists
  localStorage.removeItem('redirectAfterLogin');
  
  // Remove any application-specific auth data
  localStorage.removeItem('authUser');
  localStorage.removeItem('userRole');
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
    
    // Registra a limpeza para debugging
    console.log("Auth cache cleared completely at:", new Date().toISOString());
    
    // Informa ao usuário que deve limpar os cookies e cache do navegador
    toast({
      title: "Cache de autenticação limpo",
      description: "Autenticação reiniciada com sucesso. Se continuar tendo problemas, limpe também os cookies do navegador.",
      variant: "default",
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao limpar cache de autenticação:", error);
    return false;
  }
};

/**
 * Detecta se há tokens de autenticação corrompidos
 * @returns boolean indicando se foram encontrados tokens potencialmente corrompidos
 */
export const detectCorruptedAuthState = () => {
  try {
    // Verifica se existe token de autenticação mas sem informações válidas
    const hasAuthToken = Object.keys(localStorage).some(key => 
      key.startsWith('supabase.auth.token') || 
      (key.includes('sb-') && key.includes('-auth-token'))
    );
    
    if (!hasAuthToken) {
      return false; // Sem token, sem corrupção
    }
    
    // Tenta ler o token para ver se está válido
    try {
      const tokenKey = Object.keys(localStorage).find(key => 
        key.startsWith('supabase.auth.token') || 
        (key.includes('sb-') && key.includes('-auth-token'))
      );
      
      if (tokenKey) {
        const tokenData = JSON.parse(localStorage.getItem(tokenKey) || '{}');
        // Se não tiver expiresAt ou user, pode estar corrompido
        if (!tokenData.expiresAt || !tokenData.user || !tokenData.user.id) {
          console.warn("Detected potentially corrupted auth token");
          return true;
        }
      }
    } catch (e) {
      console.error("Error parsing auth token:", e);
      return true; // Se não conseguir ler o token, está corrompido
    }
    
    return false;
  } catch (error) {
    console.error("Error checking auth state:", error);
    return false; // Em caso de erro, assume não corrompido
  }
};
