
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  CheckCheck, 
  Filter, 
  X, 
  Heart, 
  Mail, 
  Calendar,
  ArrowRight,
  Info
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { 
  getUserNotifications, 
  markAllNotificationsAsRead, 
  clearAllNotifications, 
  subscribeToNotifications,
  Notification,
  markNotificationAsRead
} from "@/services/favorites";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";

type NotificationType = "all" | "unread" | "favorites" | "transactions" | "events";

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "ticket_running_out":
    case "event_update":
      return <Calendar className="h-5 w-5 text-primary" />;
    case "favorite_update":
      return <Heart className="h-5 w-5 text-red-500" />;
    case "transaction_update":
      return <Mail className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-secondary" />;
  }
};

const NotificationsPage = () => {
  const { isLoading } = useProtectedRoute();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationType>("all");
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  
  useEffect(() => {
    if (!isLoading) {
      fetchNotifications();
      
      // Subscribe to real-time notifications
      const subscription = subscribeToNotifications((newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
        applyFilter([newNotification, ...notifications], activeFilter);
        
        toast({
          title: "Nova notificação",
          description: newNotification.message,
          variant: "success"
        });
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isLoading]);
  
  useEffect(() => {
    applyFilter(notifications, activeFilter);
  }, [activeFilter, notifications]);

  const fetchNotifications = async () => {
    setIsLoadingNotifications(true);
    const notifs = await getUserNotifications();
    setNotifications(notifs);
    applyFilter(notifs, activeFilter);
    setIsLoadingNotifications(false);
  };
  
  const applyFilter = (notifs: Notification[], filter: NotificationType) => {
    let filtered = [...notifs];
    
    switch (filter) {
      case "unread":
        filtered = filtered.filter(notif => !notif.is_read);
        break;
      case "favorites":
        filtered = filtered.filter(notif => notif.type === "favorite_update");
        break;
      case "transactions":
        filtered = filtered.filter(notif => notif.type === "transaction_update");
        break;
      case "events":
        filtered = filtered.filter(notif => 
          notif.type === "event_update" || notif.type === "ticket_running_out"
        );
        break;
    }
    
    setFilteredNotifications(filtered);
  };
  
  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead();
    if (success) {
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
      applyFilter(notifications.map(notif => ({ ...notif, is_read: true })), activeFilter);
      toast({
        title: "Notificações",
        description: "Todas as notificações foram marcadas como lidas",
        variant: "success"
      });
    }
  };
  
  const handleClearAll = async () => {
    const success = await clearAllNotifications();
    if (success) {
      setNotifications([]);
      setFilteredNotifications([]);
      toast({
        title: "Notificações",
        description: "Todas as notificações foram removidas",
        variant: "success"
      });
    }
  };
  
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
      setNotifications(prev => prev.map(notif => 
        notif.id === notification.id 
          ? { ...notif, is_read: true } 
          : notif
      ));
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "dd/MM/yyyy 'às' HH:mm");
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Bell className="h-7 w-7" />
            Notificações
          </h1>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Marcar todas como lidas</span>
              <span className="sm:hidden">Marcar lidas</span>
            </Button>
            <Button
              variant="outline"
              size="sm" 
              className="flex items-center gap-1 text-destructive border-destructive hover:bg-red-50"
              onClick={handleClearAll}
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Limpar todas</span>
              <span className="sm:hidden">Limpar</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveFilter(value as NotificationType)}>
          <TabsList className="mb-6 w-full overflow-auto flex sm:justify-center rounded-lg p-2 bg-muted/50">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Todas</span>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>Não lidas</span>
              {notifications.filter(n => !n.is_read).length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {notifications.filter(n => !n.is_read).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>Favoritos</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>Transações</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Eventos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <NotificationsContent 
              notifications={filteredNotifications} 
              isLoading={isLoadingNotifications}
              onNotificationClick={handleNotificationClick}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="unread" className="mt-0">
            <NotificationsContent 
              notifications={filteredNotifications}
              isLoading={isLoadingNotifications}
              onNotificationClick={handleNotificationClick}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            <NotificationsContent 
              notifications={filteredNotifications}
              isLoading={isLoadingNotifications}
              onNotificationClick={handleNotificationClick}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-0">
            <NotificationsContent 
              notifications={filteredNotifications}
              isLoading={isLoadingNotifications}
              onNotificationClick={handleNotificationClick}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="events" className="mt-0">
            <NotificationsContent 
              notifications={filteredNotifications}
              isLoading={isLoadingNotifications}
              onNotificationClick={handleNotificationClick}
              formatDate={formatDate}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

interface NotificationsContentProps {
  notifications: Notification[];
  isLoading: boolean;
  onNotificationClick: (notification: Notification) => void;
  formatDate: (date: string) => string;
}

const NotificationsContent = ({ 
  notifications, 
  isLoading,
  onNotificationClick,
  formatDate
}: NotificationsContentProps) => {
  if (isLoading) {
    return <div className="text-center py-12">Carregando suas notificações...</div>;
  }
  
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-soft-purple">
          <Bell className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">Nenhuma notificação encontrada</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Você não tem notificações nesta categoria no momento.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Link 
          key={notification.id} 
          to={`/evento/${notification.event_id}`}
          onClick={() => onNotificationClick(notification)}
        >
          <Card 
            className={`p-4 hover:bg-muted/30 transition-colors border-l-4 ${
              !notification.is_read 
                ? 'border-l-primary bg-soft-purple/10' 
                : 'border-l-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-muted/50 p-3 rounded-full">
                <NotificationIcon type={notification.type} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-medium ${!notification.is_read ? 'text-primary font-semibold' : 'text-gray-700'}`}>
                    {notification.type === "ticket_running_out" && "Últimos ingressos disponíveis!"}
                    {notification.type === "favorite_update" && "Atualização de favorito"}
                    {notification.type === "event_update" && "Atualização de evento"}
                    {notification.type === "transaction_update" && "Atualização de transação"}
                  </h3>
                  {!notification.is_read && (
                    <Badge variant="secondary" className="bg-primary text-white">
                      Novo
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600">{notification.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {formatDate(notification.created_at)}
                  </span>
                  <Button variant="ghost" size="sm" className="text-xs gap-1 p-0 h-auto">
                    Ver detalhes 
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default NotificationsPage;
