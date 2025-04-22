
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ForgotPasswordForm({ onSuccess, onCancel }: ForgotPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsSubmitting(true);
    
    try {
      console.log("Iniciando processo de recuperação de senha para:", data.email);
      
      // URL de recuperação de senha que será enviada por email
      const resetLink = `${window.location.origin}/reset-password`;
      
      // Enviar email de recuperação de senha diretamente pelo Supabase Auth
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: resetLink,
      });
      
      if (error) {
        console.error("Erro Supabase Auth:", error);
        throw error;
      }
      
      console.log("Email de recuperação enviado com sucesso via Supabase Auth");
      
      toast({
        title: "Email enviado com sucesso",
        description: "Verifique sua caixa de entrada para instruções de recuperação de senha.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex gap-3 pt-2">
          <Button 
            type="button" 
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Voltar
          </Button>
          
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
