
import { useAuth } from "@/contexts/AuthContext"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset
} from "@/components/ui/sidebar"
import { ShoppingCart, UserCog, Heart, Bell, Tags } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import NextEvent from "@/components/dashboard/NextEvent"

const menuItems = [
  {
    title: "Meus ingressos",
    icon: ShoppingCart,
    url: "/meus-ingressos"
  },
  {
    title: "Editar perfil",
    icon: UserCog,
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
    icon: Tags,
    url: "/marketplace"
  }
]

const Dashboard = () => {
  const { user } = useAuth()
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
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

        <SidebarInset>
          <div className="p-6">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-6">
                  Olá, {user?.fullName?.split(' ')[0]}!
                </h1>
                <NextEvent />
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
