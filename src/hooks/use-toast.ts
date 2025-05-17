
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
        className: "rounded-xl border-none shadow-md",
      }

      if (variant === "destructive") {
        toastOptions.className = "bg-destructive text-white rounded-xl border-none shadow-md"
      } else if (variant === "success") {
        toastOptions.className = "bg-green-500 text-white rounded-xl border-none shadow-md"
      } else {
        // Default toast com gradiente roxo
        toastOptions.className = "bg-gradient-to-r from-primary to-secondary text-white rounded-xl border-none shadow-md"
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
    className: "rounded-xl border-none shadow-md",
  }

  if (variant === "destructive") {
    toastOptions.className = "bg-destructive text-white rounded-xl border-none shadow-md"
  } else if (variant === "success") {
    toastOptions.className = "bg-green-500 text-white rounded-xl border-none shadow-md"
  } else {
    // Default toast com gradiente roxo
    toastOptions.className = "bg-gradient-to-r from-primary to-secondary text-white rounded-xl border-none shadow-md"
  }

  return sonnerToast(title, {
    description,
    ...toastOptions,
  })
}

export { Toaster }
