
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, AlertCircle, Bell, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { EventDetails } from "@/types/event";
import { getUserFavorites, removeFromFavorites, subscribeToNotifications, Notification, getUserNotifications } from "@/services/favorites";
import { toast } from "@/hooks/use-toast";

const Favorites = () => {
  const { isLoading } = useProtectedRoute();
  const [favoriteEvents, setFavoriteEvents] = useState<EventDetails[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  
  useEffect(() => {
    if (!isLoading) {
      fetchFavorites();
      fetchNotifications();
      
      // Subscribe to real-time notifications
      const subscription = subscribeToNotifications((newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
        toast({
          title: "Nova notificação",
          description: newNotification.message,
          variant: "success"
        });
        setHasUnreadNotifications(true);
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isLoading]);
  
  const fetchFavorites = async () => {
    setIsLoadingFavorites(true);
    try {
      console.log("Buscando eventos favoritos...");
      const events = await getUserFavorites();
      console.log("Eventos favoritos recebidos:", events);
      setFavoriteEvents(events);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      toast({
        title: "Erro ao carregar favoritos",
        description: "Ocorreu um problema ao buscar seus eventos favoritos",
        variant: "destructive"
      });
    } finally {
      setIsLoadingFavorites(false);
    }
  };
  
  const fetchNotifications = async () => {
    const notifs = await getUserNotifications();
    setNotifications(notifs);
    setHasUnreadNotifications(notifs.some(notif => !notif.is_read));
  };
  
  const handleRemoveFromFavorites = async (eventId: number) => {
    try {
      const success = await removeFromFavorites(eventId);
      if (success) {
        setFavoriteEvents(prev => prev.filter(event => event.id !== eventId));
        toast({
          title: "Removido dos favoritos",
          description: "O evento foi removido da sua lista de favoritos",
          variant: "success"
        });
      }
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover este evento dos favoritos",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Bookmark className="h-8 w-8" />
            Meus Favoritos
          </h1>
          
          <Link to="/notificacoes">
            <Button
              variant="outline"
              className="flex items-center gap-2 relative"
              onClick={() => setHasUnreadNotifications(false)}
            >
              <Bell />
              Notificações
              {hasUnreadNotifications && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </Button>
          </Link>
        </div>
        
        {/* Notifications panel (simplified) */}
        {hasUnreadNotifications && (
          <div className="mb-6 p-4 bg-soft-purple rounded-lg border border-primary/20">
            <h2 className="text-lg font-semibold mb-2 text-primary">Notificações recentes</h2>
            <ul className="space-y-2">
              {notifications.slice(0, 3).map((notif) => (
                <li key={notif.id} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{notif.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {isLoadingFavorites ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-4" />
            <p>Carregando seus favoritos...</p>
          </div>
        ) : favoriteEvents.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-soft-purple">
              <Bookmark className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Você ainda não tem eventos favoritos</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Adicione eventos aos seus favoritos para receber notificações sobre disponibilidade de ingressos e promoções
            </p>
            <Link to="/">
              <Button className="bg-gradient-primary text-white">
                Explorar eventos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {favoriteEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-event-card transition-shadow">
                <div className="flex flex-col sm:flex-row h-auto">
                  {/* Imagem maior e com melhor qualidade */}
                  <div className="w-full sm:w-64 h-64 relative">
                    <img 
                      src={event.image || `https://picsum.photos/seed/${event.id}/800/800`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-primary opacity-10 mix-blend-multiply" />
                  </div>
                  
                  <CardContent className="flex flex-col flex-1 p-6">
                    <div className="flex-1 mb-4">
                      <h3 className="text-2xl font-bold text-primary mb-3">{event.title}</h3>
                      <div className="space-y-2 text-gray-700">
                        <p className="text-lg">{event.date} • {event.time}</p>
                        <p className="text-lg">{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-4">
                      <Link to={`/evento/${event.id}`}>
                        <Button variant="default" size="lg" className="bg-gradient-primary text-white hover:opacity-90">
                          Ver ingressos
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveFromFavorites(event.id)}
                      >
                        Remover dos favoritos
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
