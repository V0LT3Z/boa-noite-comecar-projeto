
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, AlertCircle, Bell } from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { EventDetails } from "@/types/event";
import { getUserFavorites, removeFromFavorites, subscribeToNotifications, Notification, getUserNotifications } from "@/services/favorites";
import { toast } from "@/components/ui/sonner";

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
    const events = await getUserFavorites();
    setFavoriteEvents(events);
    setIsLoadingFavorites(false);
  };
  
  const fetchNotifications = async () => {
    const notifs = await getUserNotifications();
    setNotifications(notifs);
    setHasUnreadNotifications(notifs.some(notif => !notif.is_read));
  };
  
  const handleRemoveFromFavorites = async (eventId: number) => {
    const success = await removeFromFavorites(eventId);
    if (success) {
      setFavoriteEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };
  
  useEffect(() => {
    if (favoriteEvents.length > 0 && !isLoading) {
      const timeout = setTimeout(() => {
        const mockNotification: Notification = {
          id: `notif-${Date.now()}`,
          user_id: "demo-user-id",
          event_id: favoriteEvents[0].id,
          message: `Últimos ingressos para ${favoriteEvents[0].title}! Não perca essa oportunidade!`,
          type: "ticket_running_out",
          is_read: false,
          created_at: new Date().toISOString()
        };
        
        setNotifications(prev => [mockNotification, ...prev]);
        setHasUnreadNotifications(true);
        
        toast({
          title: "Nova notificação",
          description: mockNotification.message,
          variant: "success"
        });
      }, 10000); // Show after 10 seconds
      
      return () => clearTimeout(timeout);
    }
  }, [favoriteEvents, isLoading]);

  if (isLoading) {
    return <div>Carregando...</div>;
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
          <div className="text-center py-12">Carregando seus favoritos...</div>
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
                  <div className="w-full sm:w-48 h-48 relative">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-primary opacity-30 mix-blend-multiply" />
                  </div>
                  
                  <CardContent className="flex flex-col flex-1 p-4">
                    <div className="flex-1 mb-4">
                      <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                      <div className="space-y-2 text-gray-600">
                        <p>{event.date} • {event.time}</p>
                        <p>{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-2">
                      <Link to={`/evento/${event.id}`}>
                        <Button variant="default" className="bg-gradient-primary text-white hover:opacity-90">
                          Ver ingressos
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
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
