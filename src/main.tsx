
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { AlertTriangle } from 'lucide-react';
import { detectCorruptedAuthState, cleanupAuthState } from './contexts/auth/utils';

// Make sure the root rendering happens without any issues
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// Check for corrupted auth state before rendering
const hasCorruptedAuth = detectCorruptedAuthState();
if (hasCorruptedAuth) {
  console.warn("Detected corrupted auth state on startup, cleaning up...");
  cleanupAuthState();
}

// Add error boundaries to help catch and display errors
try {
  createRoot(rootElement).render(
    <ErrorBoundary
      authFallback={
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Problema de autenticação</h2>
            <p className="text-gray-600 mb-6">
              Foi detectado um problema com a sua sessão. Isso pode ocorrer quando seu cadastro foi modificado.
            </p>
            <button 
              onClick={() => {
                // Clear auth state
                Object.keys(localStorage).forEach(key => {
                  if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
                    localStorage.removeItem(key);
                  }
                });
                // Reload page
                window.location.href = '/';
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Limpar cache e reconectar
            </button>
          </div>
        </div>
      }
    >
      <App />
    </ErrorBoundary>
  );
} catch (error) {
  console.error("Failed to render the application:", error);
  
  // Clean up auth state if there's a render error
  cleanupAuthState();
  
  // Display a fallback error UI if rendering fails
  const errorElement = document.createElement('div');
  errorElement.style.padding = '20px';
  errorElement.style.margin = '20px';
  errorElement.style.backgroundColor = '#fff';
  errorElement.style.border = '1px solid #f00';
  errorElement.style.borderRadius = '5px';
  
  errorElement.innerHTML = `
    <h2 style="color: #f00;">Erro na aplicação</h2>
    <p>Desculpe, ocorreu um erro ao carregar a aplicação.</p>
    <p>Por favor, tente recarregar a página.</p>
    <button onclick="window.location.reload()" style="padding: 8px 16px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Recarregar
    </button>
    <button onclick="(() => {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      window.location.reload();
    })()" style="margin-top: 8px; padding: 8px 16px; background: #f97316; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Limpar cache e recarregar
    </button>
  `;
  
  rootElement.appendChild(errorElement);
}
