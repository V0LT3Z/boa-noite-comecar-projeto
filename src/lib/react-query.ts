
import { QueryClient } from '@tanstack/react-query';

// Cria uma instância do QueryClient com configuração padrão
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos
      retry: 1,
    },
  },
});
