
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
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent
} from "@/components/ui/sidebar"
import { ShoppingCart, Settings, Heart, Bell, Tag } from "lucide-react"

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

const menuItems = [
  {
    title: "Meus ingressos",
    icon: ShoppingCart,
    url: "/meus-ingressos"
  },
  {
    title: "Editar perfil",
    icon: Settings,
    url: "/editar-perfil"
  },
  {
    title: "Favoritos",
    icon: Heart,
    url: "/favoritos"
  },
  {
    title: "Notificações",
    icon: Bell,
    url: "/notificacoes"
  },
  {
    title: "Acessar Marketplace",
    icon: Tag,
    url: "/marketplace"
  }
];

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
    <SidebarProvider>
      <div className="min-h-screen bg-dashboard-bg flex">
        {/* Sidebar */}
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={window.location.pathname === item.url}
                        tooltip={item.title}
                      >
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-primary p-6 text-white">
              <Button
                variant="ghost"
                className="mb-4 text-white hover:bg-white/20"
                onClick={() => navigate("/minha-conta")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Editar Perfil</h1>
            </div>

            {/* Profile Form Container */}
            <div className="p-8 space-y-6">
              {/* Readonly Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <Input 
                    value={user?.fullName} 
                    disabled 
                    className="bg-gray-50 cursor-not-allowed" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF
                  </label>
                  <Input 
                    value="000.000.000-00" 
                    disabled 
                    className="bg-gray-50 cursor-not-allowed" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <Input 
                    value="01/01/2000" 
                    disabled 
                    className="bg-gray-50 cursor-not-allowed" 
                  />
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
                          <Input 
                            {...field} 
                            type="email" 
                            className="focus:ring-primary focus:border-primary" 
                          />
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
                          <Input 
                            {...field} 
                            type="password" 
                            className="focus:ring-primary focus:border-primary" 
                          />
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
                          <Input 
                            {...field} 
                            type="password" 
                            className="focus:ring-primary focus:border-primary" 
                          />
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
                          <Input 
                            {...field} 
                            type="password" 
                            className="focus:ring-primary focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/minha-conta")}
                      className="hover:bg-gray-50"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/90"
                    >
                      Salvar alterações
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default EditProfile
