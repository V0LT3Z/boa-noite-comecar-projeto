
import { useAuth } from "@/contexts/AuthContext"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { ShoppingCart, Settings, Heart, Bell, Tag, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card } from "@/components/ui/card"
import NextEvent from "@/components/dashboard/NextEvent"

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
        {/* Header */}
        <div className="p-6 text-center mb-4">
          <h1 className="text-3xl font-bold mb-2 animate-bounce text-primary">
            Olá, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-dashboard-muted">Bem-vindo(a) de volta à sua conta</p>
        </div>

        {/* Next Event Section */}
        <div className="px-4 mb-8">
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

      {/* Mobile Navigation - Fixed to bottom */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-dashboard-card border-t border-gray-200 z-10">
          <div className="flex justify-around items-center h-16">
            {menuItems.slice(0, 5).map((item) => (
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
