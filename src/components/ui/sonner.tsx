
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
  
  // Toast de erro (destructive)
  if (variant === "destructive") {
    return sonnerToast(title || "", {
      description,
      style: { backgroundColor: "#ea384c", color: "#ffffff", borderColor: "#ea384c" },
    });
  } 
  // Toast de sucesso - usando cores roxas compatíveis com o tema
  else if (type === "success") {
    return sonnerToast.success(title || "", {
      description,
      style: { backgroundColor: "#E5DEFF", color: "#6E59A5", borderColor: "#9b87f5" },
    });
  }
  
  // Toast default
  return sonnerToast(title || "", {
    description,
    style: { backgroundColor: "#f1f5f9", color: "#334155", borderColor: "#e2e8f0" },
  });
};

export { Toaster, toast }
