
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast as sonnerToast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg data-[type=success]:!bg-[#F2FCE2] data-[type=success]:!border-green-200 data-[type=success]:!text-green-800",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:data-[type=success]:!text-green-700",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

// Creating a wrapper around sonner toast to provide proper typing
interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  type?: "default" | "success";
}

// Corrigindo a forma como a função toast é implementada
const toast = (options: ToastOptions) => {
  const { type, ...rest } = options;
  // Passando os parâmetros corretamente para o sonnerToast
  return sonnerToast(rest.title || "", {
    description: rest.description,
    type: type
  });
};

export { Toaster, toast }
