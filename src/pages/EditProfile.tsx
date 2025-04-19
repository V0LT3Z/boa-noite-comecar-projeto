
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useAuth } from "@/contexts/AuthContext"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { toast } from "@/components/ui/sonner"

const editProfileSchema = z.object({
  email: z.string().email("Email inválido"),
  currentPassword: z.string().min(6, "A senha atual deve ter no mínimo 6 caracteres"),
  newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha deve ter no mínimo 6 caracteres"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

const EditProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { isLoading } = useProtectedRoute()

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: EditProfileFormValues) => {
    try {
      // Aqui você implementará a lógica de atualização do perfil
      // quando conectar com o Supabase
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
        type: "success",
      })
      navigate("/minha-conta")
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar suas informações",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-dashboard-bg p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/minha-conta")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Perfil</h1>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Readonly Fields */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <Input value={user?.fullName} disabled className="bg-gray-50" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <Input value="000.000.000-00" disabled className="bg-gray-50" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data de Nascimento
              </label>
              <Input value="01/01/2000" disabled className="bg-gray-50" />
            </div>
          </div>

          {/* Editable Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
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
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/minha-conta")}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar alterações
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
