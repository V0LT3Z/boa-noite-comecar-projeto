
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
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg data-[type=success]:!bg-[#F2FCE2] data-[type=success]:!border-green-200 data-[type=success]:!text-green-800 data-[type=destructive]:!bg-destructive data-[type=destructive]:!border-destructive/20 data-[type=destructive]:!text-white",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:data-[type=success]:!text-green-700 group-[.toast]:data-[type=destructive]:!text-white/90",
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
  
  if (variant === "destructive") {
    return sonnerToast(title || "", {
      description,
      // Use data attributes for styling
      className: 'data-[type=destructive]',
    });
  } else if (type === "success") {
    return sonnerToast(title || "", {
      description,
      // Use data attributes for styling
      className: 'data-[type=success]',
    });
  } else {
    return sonnerToast(title || "", {
      description,
    });
  }
};

export { Toaster, toast }
