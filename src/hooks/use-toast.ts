
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
      }

      if (variant === "destructive") {
        toastOptions.className = "bg-destructive text-destructive-foreground"
      } else if (variant === "success") {
        toastOptions.className = "bg-green-500 text-white"
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
  }

  if (variant === "destructive") {
    toastOptions.className = "bg-destructive text-destructive-foreground"
  } else if (variant === "success") {
    toastOptions.className = "bg-green-500 text-white"
  }

  return sonnerToast(title, {
    description,
    ...toastOptions,
  })
}

export { Toaster }
