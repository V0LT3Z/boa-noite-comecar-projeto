
import { QueryClient } from '@tanstack/react-query';

// Cria uma instância do QueryClient com configuração otimizada para baixo consumo de banda
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dados são considerados obsoletos após 5 minutos (reduz requisições)
      staleTime: 1000 * 60 * 5,
      
      // Dados permanecem em cache por 10 minutos antes de serem removidos
      gcTime: 1000 * 60 * 10,
      
      // Configurações para melhor experiência do usuário
      refetchOnMount: true, 
      
      // Otimização: Não recarregar automaticamente quando a janela ganha foco
      // isso reduz drasticamente as requisições feitas ao servidor quando
      // o usuário alterna entre abas ou aplicativos
      refetchOnWindowFocus: false,
      
      // Limita a 1 tentativa para não sobrecarregar em caso de falha
      retry: 1,
    },
  },
});
