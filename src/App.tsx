import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Index from "./pages/Index"
import EventDetails from "./pages/EventDetails"
import Checkout from "./pages/Checkout"
import PaymentSuccess from "./pages/PaymentSuccess"
import NotFound from "./pages/NotFound"
import Dashboard from "./pages/Dashboard"
import MyTickets from "./pages/MyTickets"
import EditProfile from "./pages/EditProfile"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/evento/:id" element={<EventDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pagamento-sucesso" element={<PaymentSuccess />} />
            <Route path="/minha-conta" element={<Dashboard />} />
            <Route path="/meus-ingressos" element={<MyTickets />} />
            <Route path="/editar-perfil" element={<EditProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
