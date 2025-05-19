
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  authFallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isAuthError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isAuthError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if this is an authentication error
    const isAuthError = error.message.includes('JWT') || 
                       error.message.includes('token') || 
                       error.message.includes('auth') ||
                       error.message.includes('authentication') ||
                       error.message.includes('session');
    
    return { 
      hasError: true, 
      error,
      isAuthError
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    // Check if this might be related to auth issues and log it
    if (this.state.isAuthError) {
      console.error("Potential authentication error detected. Will attempt recovery.");
    }
  }

  private handleClearAuthAndReload = async () => {
    try {
      console.log("Clearing authentication state and reloading...");
      
      // Clear local auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear session storage as well
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
      
      // Attempt signout
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear cache if available
      if (window.caches) {
        const keys = await window.caches.keys();
        for (const key of keys) {
          if (key.includes('supabase') || key.includes('auth')) {
            await window.caches.delete(key);
          }
        }
      }
      
      // Reload window
      window.location.href = '/';
    } catch (e) {
      console.error("Error during auth cleanup:", e);
      // Force reload even if cleanup fails
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      // Render auth-specific fallback for authentication errors
      if (this.state.isAuthError) {
        return this.props.authFallback || (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm">
            <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Problema de autenticação</h2>
            <p className="text-gray-600 mb-4 text-center">
              Ocorreu um erro com sua sessão de usuário.
            </p>
            <Button 
              onClick={this.handleClearAuthAndReload}
              className="bg-gradient-primary mb-2"
            >
              Limpar cache e reconectar
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Apenas recarregar página
            </Button>
          </div>
        );
      }
      
      // For non-auth errors, use the standard fallback
      return this.props.fallback || (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm">
          <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Algo deu errado</h2>
          <p className="text-gray-600 mb-4 text-center">
            Ocorreu um erro ao renderizar este componente.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-primary"
          >
            Recarregar página
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
