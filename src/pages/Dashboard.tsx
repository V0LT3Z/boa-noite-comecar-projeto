
import { useAuth } from "@/contexts/AuthContext"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { ShoppingCart, Settings, Heart, Bell, Tag, Home } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card } from "@/components/ui/card"
import NextEvent from "@/components/dashboard/NextEvent"

const menuItems = [
  {
    title: "Ir para Home",
    icon: Home,
    url: "/"
  },
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
]

const promotionalBanners = [
  {
    title: "Instale nosso app!",
    description: "Receba notificações em tempo real sobre eventos e descontos!",
    gradient: "from-primary to-secondary",
    icon: "🔔"
  },
  {
    title: "Novidade: Revenda de Ingressos",
    description: "Agora você pode revender seus ingressos direto no app!",
    gradient: "from-purple-500 to-pink-500",
    icon: "⚠️"
  },
  {
    title: "Compartilhe e Ganhe",
    description: "Indique amigos e ganhe descontos exclusivos!",
    gradient: "from-blue-500 to-teal-500",
    icon: "🎁"
  }
]

const Dashboard = () => {
  const { user } = useAuth()
  const { isLoading } = useProtectedRoute()
  const isMobile = useIsMobile()
  
  if (isLoading) {
    return <div className="p-6">Carregando...</div>
  }
  
  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-64 bg-dashboard-card border-r border-gray-200 p-4 hidden md:block">
          <div className="space-y-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg text-dashboard-muted transition-colors hover:bg-gray-100",
                  window.location.pathname === item.url && "text-primary bg-primary/10"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        {/* Modern Header with Gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/lovable-uploads/7b4e3f1a-a268-405e-a83f-6869b87e4b6f.png')] bg-cover bg-center opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
          
          <div className="relative px-6 py-12 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-soft-purple ring-4 ring-white/20 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-primary">
                  {user?.fullName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white">
                Olá, {user?.fullName?.split(' ')[0]}! 👋
              </h1>
            </div>
          </div>
        </div>

        {/* Next Event Section */}
        <div className="px-4 mb-8 -mt-6 relative z-10">
          <NextEvent />
        </div>

        {/* Section Title */}
        <div className="px-4 mb-4">
          <h2 className="text-xl font-semibold">Novidades e Promoções</h2>
        </div>

        {/* Promotional Banners */}
        <div className="px-4 space-y-4 mb-8">
          {promotionalBanners.map((banner, index) => (
            <Card 
              key={index}
              className={cn(
                "p-6 bg-gradient-to-r text-white cursor-pointer transition-transform hover:scale-[1.02]",
                banner.gradient
              )}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{banner.icon}</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                  <p className="text-white/90">{banner.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-dashboard-card border-t border-gray-200 z-10">
          <div className="flex justify-around items-center h-16">
            {menuItems.slice(0, 4).map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  "flex flex-col items-center text-dashboard-muted transition-colors",
                  window.location.pathname === item.url && "text-primary"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.title.split(' ')[0]}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

export default Dashboard
