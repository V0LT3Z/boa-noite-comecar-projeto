import { supabase } from "@/integrations/supabase/client";
import { EventDetails } from "@/types/event";
import { toast } from "@/components/ui/sonner";

// Type for Favorite
export interface Favorite {
  id: string;
  user_id: string;
  event_id: number;
  created_at: string;
}

// Type for Notification
export interface Notification {
  id: string;
  user_id: string;
  event_id: number;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

// Add an event to favorites
export const addToFavorites = async (eventId: number): Promise<boolean> => {
  try {
    // Get the current session to get the user's ID
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session?.user?.id) {
      toast({
        title: "Você precisa estar logado",
        description: "Faça login para adicionar eventos aos favoritos",
        variant: "destructive"
      });
      return false;
    }
    
    const userId = sessionData.session.user.id;
    
    const { data, error } = await supabase
      .from("favorites")
      .insert({
        event_id: eventId,
        user_id: userId
      })
      .select();
    
    if (error) throw error;
    
    toast({
      title: "Evento adicionado aos favoritos!",
      type: "success"
    });
    
    return true;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    toast({
      title: "Erro ao adicionar aos favoritos",
      description: "Tente novamente mais tarde",
      variant: "destructive"
    });
    return false;
  }
};

// Remove an event from favorites
export const removeFromFavorites = async (eventId: number): Promise<boolean> => {
  try {
    // Get the current session to get the user's ID
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session?.user?.id) {
      toast({
        title: "Você precisa estar logado",
        description: "Faça login para remover eventos dos favoritos",
        variant: "destructive"
      });
      return false;
    }
    
    const userId = sessionData.session.user.id;
    
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", userId);
    
    if (error) throw error;
    
    toast({
      title: "Evento removido dos favoritos",
      type: "success"
    });
    
    return true;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    toast({
      title: "Erro ao remover dos favoritos",
      description: "Tente novamente mais tarde",
      variant: "destructive"
    });
    return false;
  }
};

// Check if an event is in favorites
export const isEventFavorited = async (eventId: number): Promise<boolean> => {
  try {
    // Get the current session to get the user's ID
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session?.user?.id) {
      return false;
    }
    
    const userId = sessionData.session.user.id;
    
    const { data, error } = await supabase
      .from("favorites")
      .select()
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single();
    
    if (error && error.code !== "PGRST116") {
      console.error("Error checking favorite status:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

// Get all favorites for current user
export const getUserFavorites = async (): Promise<EventDetails[]> => {
  try {
    // Get the current session to get the user's ID
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session?.user?.id) {
      return [];
    }
    
    const userId = sessionData.session.user.id;
    
    const { data: favorites, error } = await supabase
      .from("favorites")
      .select("event_id")
      .eq("user_id", userId);
    
    if (error) throw error;
    
    // For demo purposes, we'll filter the mock events by the favorite IDs
    // In a real app, you would fetch the actual events from the database
    const mockEvents: EventDetails[] = [
      {
        id: 1,
        title: "Festival de Música 2024",
        date: "20 Maio 2024",
        time: "16:00",
        location: "Parque Villa-Lobos, São Paulo, SP",
        coordinates: {
          lat: -23.5464,
          lng: -46.7227
        },
        description: "O maior festival de música do Brasil está de volta!",
        image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&h=400&fit=crop",
        minimumAge: 16,
        tickets: [
          {
            id: 1,
            name: "Ingresso Inteira",
            price: 280,
            description: "Ingresso comum, valor integral",
            availableQuantity: 1000,
            maxPerPurchase: 4
          },
          {
            id: 2,
            name: "Ingresso Meia-entrada",
            price: 140,
            description: "Mediante comprovação na entrada do evento",
            availableQuantity: 500,
            maxPerPurchase: 2
          }
        ],
        warnings: [
          "É obrigatória a apresentação de documento com foto para entrada no evento",
          "Proibida a entrada de menores de 16 anos desacompanhados"
        ]
      },
      {
        id: 2,
        title: "Show de Comédia",
        date: "15 Junho 2024",
        time: "20:00",
        location: "Teatro Municipal, Rio de Janeiro, RJ",
        coordinates: {
          lat: -22.9083,
          lng: -43.1756
        },
        description: "Uma noite de diversão com os melhores comediantes do Brasil",
        image: "https://images.unsplash.com/photo-1642784358990-690278661ef3?w=1200&h=400&fit=crop",
        minimumAge: 18,
        tickets: [
          {
            id: 5,
            name: "Plateia",
            price: 120,
            description: "Ingresso comum",
            availableQuantity: 500,
            maxPerPurchase: 4
          }
        ],
        warnings: [
          "Evento para maiores de 18 anos",
          "Lugares não numerados"
        ]
      },
      {
        id: 3,
        title: "Exposição de Arte",
        date: "5 Julho 2024",
        time: "10:00",
        location: "MASP, São Paulo, SP",
        coordinates: {
          lat: -23.5614,
          lng: -46.6558
        },
        description: "Exposição de obras de artistas contemporâneos",
        image: "https://images.unsplash.com/photo-1594245158268-bed9b13b0f10?w=1200&h=400&fit=crop",
        minimumAge: 0,
        tickets: [
          {
            id: 8,
            name: "Entrada Geral",
            price: 50,
            description: "Acesso completo à exposição",
            availableQuantity: 1000,
            maxPerPurchase: 6
          }
        ],
        warnings: [
          "Proibido fotografar com flash",
          "Entrada gratuita para crianças até 10 anos"
        ]
      },
    ];
    
    const favoriteEventIds = favorites?.map(fav => fav.event_id) || [];
    return mockEvents.filter(event => favoriteEventIds.includes(event.id));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    toast({
      title: "Erro ao carregar favoritos",
      description: "Tente novamente mais tarde",
      variant: "destructive"
    });
    return [];
  }
};

// Get all user notifications
export const getUserNotifications = async (): Promise<Notification[]> => {
  try {
    // Get the current session to get the user's ID
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session?.user?.id) {
      return [];
    }
    
    const userId = sessionData.session.user.id;
    
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session?.user?.id) {
      return false;
    }
    
    const userId = sessionData.session.user.id;
    
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

// Subscribe to realtime notifications
export const subscribeToNotifications = (callback: (notification: Notification) => void) => {
  return supabase
    .channel('notifications-channel')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${supabase.auth.getSession().then(({ data }) => data.session?.user.id)}` 
      }, 
      (payload) => {
        const notification = payload.new as Notification;
        callback(notification);
      }
    )
    .subscribe();
};
