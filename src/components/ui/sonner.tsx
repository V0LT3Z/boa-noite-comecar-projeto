
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
  type?: "default" | "success";
}

const toast = (options: ToastOptions) => {
  const { title, description, variant, type } = options;
  
  let className = "";
  
  if (variant === "destructive") {
    className = "bg-destructive border-destructive/20 text-white";
  } else if (type === "success") {
    className = "bg-[#F2FCE2] border-green-200 text-green-800";
  }
  
  return sonnerToast(title || "", {
    description,
    className,
    descriptionClassName: variant === "destructive" ? "text-white/90" : type === "success" ? "text-green-700" : "",
  });
};

export { Toaster, toast }
