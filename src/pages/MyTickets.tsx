
import { useAuth } from "@/contexts/AuthContext"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const MyTickets = () => {
  const { user } = useAuth()
  const { isLoading } = useProtectedRoute()
  
  if (isLoading) {
    return <div className="p-6">Carregando...</div>
  }
  
  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="p-4">
        <Link to="/minha-conta">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </Button>
        </Link>
      </div>

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
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="bg-dashboard-card border border-gray-200 p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-primary/20 rounded-lg" />
                    <div>
                      <h3 className="font-semibold">Deu Baile | Sexta {item}4.03</h3>
                      <p className="text-dashboard-muted">Pacco Club</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
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
    </div>
  )
}

export default MyTickets
