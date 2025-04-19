
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

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
  
  // Base style for the toast
  const baseClassName = "flex flex-col gap-1 p-2";
  let className = baseClassName;
  
  // Handle destructive (error) toasts
  if (variant === "destructive") {
    className = `${baseClassName} bg-destructive border-destructive text-destructive-foreground`;
  } 
  // Handle success toasts 
  else if (type === "success") {
    className = `${baseClassName} bg-[#F2FCE2] border-green-200 text-green-800`;
  }
  
  return {
    ...Sonner.toast(title || "", {
      description,
      className,
    })
  };
};

export { Toaster, toast }
