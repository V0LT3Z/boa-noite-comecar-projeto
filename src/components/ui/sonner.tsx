
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
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
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
  type?: "success";
}

const toast = (options: ToastOptions) => {
  const { title, description, variant, type } = options;
  
  // Se for um toast de erro (destructive)
  if (variant === "destructive") {
    return sonnerToast(title || "", {
      description,
      className: "bg-destructive text-destructive-foreground border-destructive",
    });
  } 
  // Se for um toast de sucesso
  else if (type === "success") {
    return sonnerToast(title || "", {
      description,
      className: "bg-[#F2FCE2] text-green-800 border-green-200",
    });
  }
  
  // Toast default
  return sonnerToast(title || "", {
    description,
  });
};

export { Toaster, toast }
