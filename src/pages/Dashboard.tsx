
import { useAuth } from "@/contexts/AuthContext"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { Home, Calendar, User, ShoppingCart, Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Início",
    icon: Home,
    url: "/minha-conta"
  },
  {
    title: "Agenda",
    icon: Calendar,
    url: "/agenda"
  },
  {
    title: "Ingressos",
    icon: ShoppingCart,
    url: "/meus-ingressos"
  },
  {
    title: "Favoritos",
    icon: Heart,
    url: "/favoritos"
  },
  {
    title: "Perfil",
    icon: User,
    url: "/editar-perfil"
  }
]

const Dashboard = () => {
  const { user } = useAuth()
  const { isLoading } = useProtectedRoute();
  
  if (isLoading) {
    return <div className="p-6">Carregando...</div>;
  }
  
  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text pb-20">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Meus Pedidos</h1>
      </div>

      {/* Content */}
      <div className="px-4">
        <Tabs defaultValue="ingressos" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-dashboard-card rounded-xl h-12 p-1">
            <TabsTrigger 
              value="ingressos"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Ingressos
            </TabsTrigger>
            <TabsTrigger 
              value="produtos"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Produtos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ingressos" className="mt-4">
            {/* Lista de ingressos aqui */}
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="bg-dashboard-card border-none p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-primary/20 rounded-lg" />
                    <div>
                      <h3 className="font-semibold">Deu Baile | Sexta {item}4.03</h3>
                      <p className="text-dashboard-muted">Pacco Club</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-dashboard-bg rounded-full text-sm">
                        1 ingresso
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="produtos">
            <div className="text-center py-8 text-dashboard-muted">
              Nenhum produto disponível
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dashboard-card border-t border-white/10">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={cn(
                "flex flex-col items-center text-dashboard-muted transition-colors",
                window.location.pathname === item.url && "text-primary"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Dashboard
