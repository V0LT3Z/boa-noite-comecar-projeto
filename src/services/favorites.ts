
import { supabase } from "@/integrations/supabase/client";
import { EventDetails } from "@/types/event";
import { toast } from "@/components/ui/sonner";

export interface Notification {
  id: string;
  user_id: string;
  event_id: number;
  message: string;
  type: "ticket_running_out" | "event_update" | "favorite_update" | "transaction_update";
  is_read: boolean;
  created_at: string;
}

// Add an event to favorites
export const addToFavorites = async (eventId: number): Promise<boolean> => {
  try {
    const { error } = await supabase.from('favorites').insert([
      { event_id: eventId },
    ]);
    
    if (error) {
      console.error("Error adding to favorites:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar aos favoritos. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Sucesso",
      description: "Evento adicionado aos favoritos!",
      variant: "success",
    });
    return true;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    toast({
      title: "Erro",
      description: "Não foi possível adicionar aos favoritos. Tente novamente.",
      variant: "destructive",
    });
    return false;
  }
};

// Remove an event from favorites
export const removeFromFavorites = async (eventId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('event_id', eventId);
    
    if (error) {
      console.error("Error removing from favorites:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover dos favoritos. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Removido",
      description: "Evento removido dos favoritos.",
      variant: "destructive",
    });
    return true;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    toast({
      title: "Erro",
      description: "Não foi possível remover dos favoritos. Tente novamente.",
      variant: "destructive",
    });
    return false;
  }
};

// Check if an event is in favorites
export const isEventFavorited = async (eventId: number): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('favorites')
      .select()
      .eq('event_id', eventId)
      .single();
    
    return !!data;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

// Get all user favorites
export const getUserFavorites = async (): Promise<EventDetails[]> => {
  try {
    // In a real app, we would join with an events table
    // For now, let's return mock data
    return [
      {
        id: 1,
        title: "Festival de Música",
        description: "Um grande festival com os melhores artistas nacionais.",
        date: "20/05/2025",
        time: "16:00",
        location: "Parque da Cidade, São Paulo",
        image: "https://picsum.photos/seed/event1/800/500",
        tickets: [
          { id: 1, name: "Ingresso Comum", price: 150.0 },
          { id: 2, name: "Ingresso VIP", price: 300.0 },
        ],
        venue: {
          name: "Parque da Cidade",
          address: "Av. Principal, 1000, São Paulo",
          capacity: 10000,
          map_url: "https://maps.google.com",
        },
      },
      {
        id: 2,
        title: "Peça de Teatro: O Fantasma da Ópera",
        description: "A famosa peça de teatro chega à cidade.",
        date: "15/06/2025",
        time: "20:00",
        location: "Teatro Municipal, Rio de Janeiro",
        image: "https://picsum.photos/seed/event2/800/500",
        tickets: [
          { id: 3, name: "Plateia", price: 120.0 },
          { id: 4, name: "Camarote", price: 240.0 },
        ],
        venue: {
          name: "Teatro Municipal",
          address: "Praça Central, 500, Rio de Janeiro",
          capacity: 800,
          map_url: "https://maps.google.com",
        },
      },
    ];
  } catch (error) {
    console.error("Error getting user favorites:", error);
    return [];
  }
};

// Subscribe to realtime notifications
export const subscribeToNotifications = (callback: (notification: Notification) => void) => {
  // In a real app, this would use Supabase realtime
  // For now, we'll just return an empty unsubscribe function
  return {
    unsubscribe: () => {},
  };
};

// Get all user notifications
export const getUserNotifications = async (): Promise<Notification[]> => {
  try {
    // In a real app, this would fetch from the notifications table
    // For now, let's return mock data
    return [
      {
        id: "notif-1",
        user_id: "demo-user-id",
        event_id: 1,
        message: "Últimos ingressos para Festival de Música! Não perca essa oportunidade!",
        type: "ticket_running_out",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
      },
      {
        id: "notif-2",
        user_id: "demo-user-id",
        event_id: 2,
        message: "A peça O Fantasma da Ópera mudou de horário para 21h00.",
        type: "event_update",
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
      },
      {
        id: "notif-3",
        user_id: "demo-user-id",
        event_id: 1,
        message: "Festival de Música adicionado aos seus favoritos.",
        type: "favorite_update",
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
      },
      {
        id: "notif-4",
        user_id: "demo-user-id",
        event_id: 2,
        message: "Sua compra de ingressos para O Fantasma da Ópera foi confirmada.",
        type: "transaction_update",
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
      },
      {
        id: "notif-5",
        user_id: "demo-user-id",
        event_id: 1,
        message: "Festival de Música anunciou uma nova atração: Banda Demo!",
        type: "event_update",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 hours ago
      }
    ];
  } catch (error) {
    console.error("Error getting user notifications:", error);
    return [];
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    // In a real app, this would update notifications in database
    return true;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return false;
  }
};

// Mark a specific notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    // In a real app, this would update a specific notification
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

// Clear all notifications
export const clearAllNotifications = async (): Promise<boolean> => {
  try {
    // In a real app, this would delete notifications from database
    return true;
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return false;
  }
};
