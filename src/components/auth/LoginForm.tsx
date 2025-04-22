
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccess: () => void
  onForgotPassword: () => void
}

export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const { login, resendConfirmationEmail } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [resendingEmail, setResendingEmail] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    console.log("Login data:", data)
    setIsSubmitting(true);
    setCurrentEmail(data.email);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        // Check if we have a redirect URL saved
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          window.location.href = redirectUrl;
        }
        
        onSuccess();
      } else {
        // Check if it might be an unconfirmed email issue
        const errorMessage = document.querySelector(".sonner-toast")?.textContent || "";
        if (errorMessage.includes("Email não confirmado") || errorMessage.includes("Email not confirmed")) {
          setEmailNotConfirmed(true);
        }
      }
    } catch (error) {
      console.error("Login submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleResendEmail = async () => {
    if (!currentEmail || resendingEmail) return;
    
    setResendingEmail(true);
    await resendConfirmationEmail(currentEmail);
    setResendingEmail(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {emailNotConfirmed && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
            <AlertDescription className="text-sm">
              Seu email ainda não foi confirmado. 
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs text-destructive-foreground underline ml-1"
                onClick={handleResendEmail}
                disabled={resendingEmail}
              >
                {resendingEmail ? "Enviando..." : "Reenviar email de confirmação"}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input placeholder="seu@email.com" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••" 
                    {...field} 
                    className="pl-10 pr-10" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-xs text-secondary hover:text-primary"
            onClick={onForgotPassword}
          >
            Esqueceu a senha?
          </Button>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  )
}
