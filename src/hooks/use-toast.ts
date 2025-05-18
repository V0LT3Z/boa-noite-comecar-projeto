
import { toast as sonnerToast, ToastT, Toaster } from "sonner"

type ToastProps = {
  title: string
  description: string
  variant?: "default" | "destructive" | "success"
}

// Criando o hook useToast que retorna a função toast
export const useToast = () => {
  return {
    toast: ({ title, description, variant = "default" }: ToastProps) => {
      const toastOptions: Partial<ToastT> = {
        position: "bottom-right",
        className: "my-2", // Aumentando o espaçamento vertical para evitar sobreposição
        duration: 5000, // Aumentando a duração para 5 segundos para dar mais tempo para leitura
      }

      if (variant === "destructive") {
        toastOptions.className = "bg-destructive text-white border-destructive-border rounded-lg shadow-md my-2 font-gooddog"
      } else if (variant === "success") {
        toastOptions.className = "bg-green-500 text-white border-green-600 rounded-lg shadow-md my-2 font-gooddog"
      } else {
        // Default toast com gradiente
        toastOptions.className = "bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-md my-2 font-gooddog"
      }

      return sonnerToast(title, {
        description,
        ...toastOptions,
      })
    }
  }
}

// Mantendo a exportação da função toast direta para compatibilidade
export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  const toastOptions: Partial<ToastT> = {
    position: "bottom-right",
    className: "my-2", // Aumentando o espaçamento vertical para evitar sobreposição
    duration: 5000, // Aumentando a duração para 5 segundos para dar mais tempo para leitura
  }

  if (variant === "destructive") {
    toastOptions.className = "bg-destructive text-white border-destructive-border rounded-lg shadow-md my-2 font-gooddog"
  } else if (variant === "success") {
    toastOptions.className = "bg-green-500 text-white border-green-600 rounded-lg shadow-md my-2 font-gooddog"
  } else {
    // Default toast com gradiente
    toastOptions.className = "bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-md my-2 font-gooddog"
  }

  return sonnerToast(title, {
    description,
    ...toastOptions,
  })
}

export { Toaster }
