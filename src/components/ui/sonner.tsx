
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
  variant?: "default" | "destructive" | "success";
}

const toast = (options: ToastOptions) => {
  const { title, description, variant } = options;
  
  // Toast de sucesso com fundo verde suave
  if (variant === "success") {
    return sonnerToast.success(title || "", {
      description,
      style: { 
        backgroundColor: "#F2FCE2",  // Soft green background 
        color: "#2e7d32",  // Dark green text
        borderColor: "#81c784"  // Light green border
      },
    });
  }
  
  // Toast de erro (destructive)
  if (variant === "destructive") {
    return sonnerToast(title || "", {
      description,
      style: { 
        backgroundColor: "#FFDEE2",  // Soft red background
        color: "#c62828",  // Dark red text
        borderColor: "#ef5350"  // Light red border
      },
    });
  }
  
  // Toast default
  return sonnerToast(title || "", {
    description,
  });
};

export { Toaster, toast }
