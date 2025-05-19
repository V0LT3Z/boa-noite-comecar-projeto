
import { QueryClient } from '@tanstack/react-query';

// Cria uma instância do QueryClient com configuração otimizada para eventos
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dados são considerados obsoletos após 2 minutos (mais adequado para conteúdo que muda com frequência)
      staleTime: 1000 * 60 * 2,
      
      // Dados permanecem em cache por 10 minutos antes de serem removidos
      gcTime: 1000 * 60 * 10,
      
      // Configurações para melhor experiência do usuário
      refetchOnMount: true,
      refetchOnWindowFocus: 'always',
      
      // Limita a 1 tentativa para não sobrecarregar em caso de falha
      retry: 1,
    },
  },
});
