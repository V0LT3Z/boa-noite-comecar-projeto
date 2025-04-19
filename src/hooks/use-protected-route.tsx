
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save current location to redirect back after login
      localStorage.setItem('redirectAfterLogin', location.pathname);
      
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive",
      });
      
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  return { isLoading };
}
