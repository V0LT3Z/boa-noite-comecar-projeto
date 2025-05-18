
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure the root rendering happens without any issues
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// Add error boundaries to help catch and display errors
try {
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Failed to render the application:", error);
  
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
  `;
  
  rootElement.appendChild(errorElement);
}
