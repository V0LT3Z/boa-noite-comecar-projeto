
import { supabase } from "@/integrations/supabase/client";
import { EventDetails } from "@/types/event";

// Definição do tipo de notificação
export interface Notification {
  id: string;
  user_id: string;
  event_id: number;
  message: string;
  type: "ticket_running_out" | "event_update" | "favorite_update" | "transaction_update";
  is_read: boolean;
  created_at: string;
}

// Função para adicionar um evento aos favoritos
export const addToFavorites = async (eventId: number) => {
  // Verificar se o usuário está logado
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Você precisa estar logado para adicionar favoritos");
  }

  const userId = session.user.id;
  console.log("Adicionando favorito - UserID:", userId, "EventID:", eventId);

  // Verificar se já está nos favoritos
  const { data: existing, error: checkError } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .maybeSingle();

  if (checkError) {
    console.error("Erro ao verificar favorito:", checkError);
    throw checkError;
  }

  if (existing) {
    // Se já existe, não faz nada
    console.log("Evento já está nos favoritos");
    return true;
  }

  // Se não existe, adiciona aos favoritos
  const { data, error } = await supabase
    .from("favorites")
    .insert({
      user_id: userId,
      event_id: eventId
    });

  if (error) {
    console.error("Erro ao adicionar favorito:", error);
    throw error;
  }

  console.log("Favorito adicionado com sucesso", data);
  return true;
};

// Função para remover um evento dos favoritos
export const removeFromFavorites = async (eventId: number) => {
  // Verificar se o usuário está logado
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Você precisa estar logado para remover favoritos");
  }

  const userId = session.user.id;
  console.log("Removendo favorito - UserID:", userId, "EventID:", eventId);

  // Remover dos favoritos
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("event_id", eventId);

  if (error) {
    console.error("Erro ao remover favorito:", error);
    throw error;
  }

  console.log("Favorito removido com sucesso");
  return true;
};

// Função para verificar se um evento está nos favoritos
export const isEventFavorited = async (eventId: number): Promise<boolean> => {
  // Verificar se o usuário está logado
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return false;
  }

  const userId = session.user.id;
  console.log("Verificando favorito - UserID:", userId, "EventID:", eventId);

  // Verificar nos favoritos
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    console.error("Erro ao verificar favoritos:", error);
    return false;
  }

  const isFavorited = !!data;
  console.log("Evento está favoritado?", isFavorited);
  return isFavorited;
};

// Função para obter todos os eventos favoritos do usuário
export const getFavorites = async (): Promise<EventDetails[]> => {
  // Verificar se o usuário está logado
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return [];
  }

  const userId = session.user.id;

  // Buscar favoritos
  const { data: favorites, error: favoritesError } = await supabase
    .from("favorites")
    .select("event_id")
    .eq("user_id", userId);

  if (favoritesError || !favorites || favorites.length === 0) {
    console.log("Nenhum favorito encontrado ou erro:", favoritesError);
    return [];
  }

  console.log("Favoritos encontrados:", favorites);
  
  // Buscar detalhes dos eventos favoritados
  const eventIds = favorites.map(fav => fav.event_id);
  
  // Em uma aplicação real, buscaríamos estes eventos do backend
  // Por enquanto, vamos buscar os detalhes dos eventos usando os IDs
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .in("id", eventIds);
    
  if (eventsError || !events) {
    console.log("Erro ao buscar eventos favoritados:", eventsError);
    return [];
  }
  
  console.log("Eventos favoritados encontrados:", events);
  
  // Mapear os eventos para o formato EventDetails
  const eventDetails: EventDetails[] = events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description || "",
    date: event.date,
    time: new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    location: event.location,
    image: event.image_url || `https://picsum.photos/seed/${event.id}/800/500`,
    tickets: [],  // Estes dados seriam buscados de outra tabela
    venue: {
      name: event.location,
      address: "",
      capacity: 0,
      map_url: ""
    },
    minimumAge: event.minimum_age || 0,
    warnings: [],
    coordinates: { lat: 0, lng: 0 },
    status: event.status
  }));

  return eventDetails;
};

// Alias para compatibilidade com o código existente
export const getUserFavorites = getFavorites;

// Função para obter eventos recomendados com base nos favoritos
export const getRecommended = async (): Promise<EventDetails[]> => {
  // Em uma implementação real, buscaríamos recomendações baseadas nos favoritos
  // Por enquanto, retornamos uma lista vazia
  return [];
};

// Funções para gerenciamento de notificações
export const getUserNotifications = async (): Promise<Notification[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return [];
  }

  const userId = session.user.id;

  // Buscar notificações do usuário do Supabase
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Erro ao buscar notificações:", error);
    return [];
  }

  return data as Notification[];
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return false;
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    return false;
  }

  return true;
};

export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return false;
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Erro ao marcar todas as notificações como lidas:", error);
    return false;
  }

  return true;
};

export const clearAllNotifications = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return false;
  }

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Erro ao limpar todas as notificações:", error);
    return false;
  }

  return true;
};

// Função para inscrever nas notificações em tempo real
export const subscribeToNotifications = (callback: (notification: Notification) => void) => {
  const { data: { session } } = supabase.auth.getSession();
  if (!session) {
    console.log("Usuário não está autenticado para receber notificações");
    return {
      unsubscribe: () => {}
    };
  }

  console.log("Inscrito para receber notificações em tempo real");
  
  // Em uma implementação real, usaríamos o Supabase Realtime
  // Por enquanto, retornamos um objeto com método unsubscribe
  return {
    unsubscribe: () => {
      console.log("Desinscrito das notificações em tempo real");
    }
  };
};
