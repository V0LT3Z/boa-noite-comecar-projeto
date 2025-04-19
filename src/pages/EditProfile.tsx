
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { ShoppingCart, Settings, Heart, Bell, Tag, User } from "lucide-react"

const editProfileSchema = z.object({
  email: z.string().email("Email inválido"),
  currentPassword: z.string().min(6, "A senha atual deve ter no mínimo 6 caracteres"),
  newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha deve ter no mínimo 6 caracteres"),
  bio: z.string().optional(),
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
      bio: "",
    },
  })

  const onSubmit = async (data: EditProfileFormValues) => {
    try {
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
    <div className="flex min-h-screen w-full">
      <SidebarProvider>
        <Sidebar>
          <SidebarContent className="bg-gradient-to-b from-primary to-secondary">
            <div className="p-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold">{user?.fullName}</h3>
                {/* Removed email from sidebar */}
              </div>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={window.location.pathname === item.url}
                        className={`${
                          window.location.pathname === item.url 
                            ? "bg-white/20 hover:bg-white/25 text-white" 
                            : "text-white/90 hover:bg-white/10"
                        }`}
                      >
                        <a href={item.url} className="flex items-center gap-3 py-3">
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 bg-soft-purple/10">
          <div className="w-full h-full p-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-primary p-6 text-white relative">
                <Button
                  variant="ghost"
                  className="mb-4 text-white hover:bg-white/20"
                  onClick={() => navigate("/minha-conta")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Editar Perfil</h1>
                <p className="text-white/80 mt-1">Atualize suas informações pessoais</p>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-4 pb-1 border-b border-gray-100">
                    Informações Pessoais
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-soft-purple/40 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                      </label>
                      <Input 
                        value={user?.fullName} 
                        disabled 
                        className="bg-white/80 border-primary/20 cursor-not-allowed font-medium" 
                      />
                    </div>
                    
                    <div className="bg-soft-purple/40 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF
                      </label>
                      <Input 
                        value="000.000.000-00" 
                        disabled 
                        className="bg-white/80 border-primary/20 cursor-not-allowed font-medium" 
                      />
                    </div>
                    
                    <div className="bg-soft-purple/40 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Nascimento
                      </label>
                      <Input 
                        value="01/01/2000" 
                        disabled 
                        className="bg-white/80 border-primary/20 cursor-not-allowed font-medium" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-4 pb-1 border-b border-gray-100">
                    Configurações da Conta
                  </h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="bg-soft-purple/40 rounded-lg p-5">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="email"
                                  placeholder="exemplo@email.com"
                                  className="border-primary/20 focus:border-primary bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="bg-soft-purple/40 rounded-lg p-5">
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Bio (opcional)
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Conte um pouco sobre você..."
                                  className="border-primary/20 focus:border-primary bg-white resize-none h-24"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="bg-soft-purple/40 rounded-lg p-5 space-y-4">
                        <h3 className="text-md font-medium text-gray-800">Alterar Senha</h3>

                        <FormField
                          control={form.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Senha Atual
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="password" 
                                  className="border-primary/20 focus:border-primary bg-white"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Nova Senha
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="password" 
                                    className="border-primary/20 focus:border-primary bg-white" 
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Confirmar Nova Senha
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="password" 
                                    className="border-primary/20 focus:border-primary bg-white" 
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate("/minha-conta")}
                          className="border-gray-200 hover:bg-gray-50 text-gray-700"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-primary hover:opacity-90 text-white"
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
        </div>
      </SidebarProvider>
    </div>
  )
}

export default EditProfile
