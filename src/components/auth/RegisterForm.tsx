import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, User, Mail, Lock, CreditCard } from "lucide-react"

import { cn } from "@/lib/utils"
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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"

// CPF validation function
const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "")
  if (cleanCPF.length !== 11) return false
  if (/^(\d)\1+$/.test(cleanCPF)) return false

  let sum = 0
  let remainder
  
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleanCPF.substring(i-1, i)) * (11 - i)
  }
  
  remainder = (sum * 10) % 11
  if ((remainder === 10) || (remainder === 11)) remainder = 0
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false
  
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleanCPF.substring(i-1, i)) * (12 - i)
  }
  
  remainder = (sum * 10) % 11
  if ((remainder === 10) || (remainder === 11)) remainder = 0
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false
  
  return true
}

const registerSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha é obrigatória"),
  cpf: z.string()
    .min(11, "CPF inválido")
    .max(14, "CPF inválido")
    .refine(cpf => validateCPF(cpf), { message: "CPF inválido" }),
  birthDate: z.string().refine(date => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && 
           parsedDate < new Date() && 
           parsedDate > new Date("1900-01-01");
  }, { message: "Data de nascimento inválida" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      cpf: "",
      birthDate: "",
    },
  })

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    let formatted = ""
    
    if (cleaned.length <= 3) {
      formatted = cleaned
    } else if (cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
    } else if (cleaned.length <= 9) {
      formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
    } else {
      formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`
    }
    
    return formatted
  }

  function onSubmit(data: RegisterFormValues) {
    console.log("Register data:", data)
    setTimeout(() => {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Redirecionando para o checkout...",
      })
      onSuccess()
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Seu nome completo" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="seu@email.com" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="password" placeholder="••••••" {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="password" placeholder="••••••" {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="000.000.000-00"
                    value={formatCPF(field.value)}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    maxLength={14}
                    className="pl-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de nascimento</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field}
                  className="w-full"
                  placeholder="Selecione uma data"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-primary text-white hover:opacity-90"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </Form>
  )
}
