
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Header from "./components/Header";
import Index from "./pages/Index";
import AllEvents from "./pages/AllEvents";
import EventDetails from "./pages/EventDetails";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyTickets from "./pages/MyTickets";
import Favorites from "./pages/Favorites";
import Notifications from "./pages/Notifications";
import EditProfile from "./pages/EditProfile";
import Marketplace from "./pages/Marketplace";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminTeamManagement from "./pages/admin/AdminTeamManagement";
import AdminQRVerification from "./pages/admin/AdminQRVerification";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReports from "./pages/admin/AdminReports";
import AdminFinancial from "./pages/admin/AdminFinancial";
import PaymentSuccessConfirmation from "./pages/PaymentSuccessConfirmation";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/eventos" element={<AllEvents />} />
                <Route path="/evento/:id" element={<EventDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/pagamento-sucesso" element={<PaymentSuccessConfirmation />} />
                <Route path="/marketplace" element={<Marketplace />} />

                {/* Protected user routes */}
                <Route path="/minha-conta" element={<Dashboard />} />
                <Route path="/meus-ingressos" element={<MyTickets />} />
                <Route path="/favoritos" element={<Favorites />} />
                <Route path="/notificacoes" element={<Notifications />} />
                <Route path="/editar-perfil" element={<EditProfile />} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/eventos" element={<AdminEvents />} />
                <Route path="/admin/usuarios" element={<AdminTeamManagement />} />
                <Route path="/admin/verificacao-qr" element={<AdminQRVerification />} />
                <Route path="/admin/financeiro" element={<AdminFinancial />} />
                <Route path="/admin/relatorios" element={<AdminReports />} />
                <Route path="/admin/suporte" element={<AdminSupport />} />
                <Route path="/admin/configuracoes" element={<AdminSettings />} />

                {/* Redirects and Not Found */}
                <Route path="/admin/team" element={<Navigate to="/admin/usuarios" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
