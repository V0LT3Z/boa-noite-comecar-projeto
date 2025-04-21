import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function useProtectedAdminRoute() {
  const { isAuthenticated, isLoading, isProducer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Usuário não está autenticado
        toast({
          title: "Acesso restrito",
          description: "Faça login para acessar esta área",
          variant: "destructive",
        });
        navigate('/');
      } else if (!isProducer) {
        // Usuário está autenticado, mas não é produtor
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel administrativo",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [isAuthenticated, isLoading, isProducer, navigate]);

  return { isLoading, isAuthenticated, isProducer };
}
