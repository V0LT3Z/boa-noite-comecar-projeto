
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
  
  // Toast de sucesso com fundo verde suave e gradiente
  if (variant === "success") {
    return sonnerToast.success(title || "", {
      description,
      style: { 
        backgroundColor: "#FFFFFF",  // White background
        color: "#2e7d32",  // Dark green text for better readability
        borderColor: "#E0E0E0",  // Light border
        borderRadius: "0.5rem",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
      // Custom component to add gradient header
      className: "relative pt-1",
      unstyled: false,
      // Add a gradient bar at the top of the toast
      jsx: (
        <div className="w-full">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4CAF50] to-[#8BC34A]" />
          <div className="pt-3 px-4 pb-4">
            <div className="font-medium text-[15px]">{title}</div>
            {description && <div className="text-[13px] text-gray-600 mt-1">{description}</div>}
          </div>
        </div>
      ),
    });
  }
  
  // Toast de erro (destructive) com fundo vermelho suave e gradiente
  if (variant === "destructive") {
    return sonnerToast.error(title || "", {
      description,
      style: { 
        backgroundColor: "#FFFFFF",  // White background
        color: "#c62828",  // Dark red text for better readability
        borderColor: "#E0E0E0",  // Light border
        borderRadius: "0.5rem",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
      // Custom component to add gradient header
      className: "relative pt-1",
      unstyled: false,
      // Add a gradient bar at the top of the toast
      jsx: (
        <div className="w-full">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E53935] to-[#EF5350]" />
          <div className="pt-3 px-4 pb-4">
            <div className="font-medium text-[15px]">{title}</div>
            {description && <div className="text-[13px] text-gray-600 mt-1">{description}</div>}
          </div>
        </div>
      ),
    });
  }
  
  // Toast default com gradiente roxo para azul (como o tema principal)
  return sonnerToast(title || "", {
    description,
    style: { 
      backgroundColor: "#FFFFFF",  // White background
      color: "#333333",  // Dark text for better readability
      borderColor: "#E0E0E0",  // Light border
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    },
    // Custom component to add gradient header
    className: "relative pt-1",
    unstyled: false,
    // Add a gradient bar at the top of the toast
    jsx: (
      <div className="w-full">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
        <div className="pt-3 px-4 pb-4">
          <div className="font-medium text-[15px]">{title}</div>
          {description && <div className="text-[13px] text-gray-600 mt-1">{description}</div>}
        </div>
      </div>
    ),
  });
};

export { Toaster, toast }
