
import { supabase } from "@/integrations/supabase/client";
import { EventDetails } from "@/types/event";
import { fetchEventById } from "@/services/events";

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

  // Verificar se já está nos favoritos
  const { data: existing, error: checkError } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .maybeSingle();

  if (checkError) {
    throw checkError;
  }

  if (existing) {
    // Se já existe, não faz nada
    return existing;
  }

  // Se não existe, adiciona aos favoritos
  const { data, error } = await supabase
    .from("favorites")
    .insert({
      user_id: userId,
      event_id: eventId
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Função para remover um evento dos favoritos
export const removeFromFavorites = async (eventId: number) => {
  // Verificar se o usuário está logado
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Você precisa estar logado para remover favoritos");
  }

  const userId = session.user.id;

  // Remover dos favoritos
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("event_id", eventId);

  if (error) {
    throw error;
  }

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

  return !!data;
};

// Função para obter todos os eventos favoritos do usuário - ALTERADA PARA BUSCAR EVENTOS REAIS
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

  // Buscar os eventos reais baseados nos IDs favoritos
  try {
    const favoriteEvents: EventDetails[] = [];
    
    for (const fav of favorites) {
      const event = await fetchEventById(fav.event_id);
      if (event) {
        // Garantir que a imagem do evento seja preservada
        favoriteEvents.push(event);
      } else {
        console.log(`Evento favoritado com ID ${fav.event_id} não encontrado`);
      }
    }
    
    return favoriteEvents;
  } catch (error) {
    console.error("Erro ao buscar detalhes dos eventos favoritos:", error);
    return [];
  }
};

// Alias para compatibilidade com o código existente
export const getUserFavorites = getFavorites;

// Função para obter eventos recomendados com base nos favoritos
export const getRecommended = async (): Promise<EventDetails[]> => {
  // Buscar eventos reais favoritos
  const favoriteEvents = await getFavorites();
  
  // Se não houver favoritos, retornar uma lista vazia
  if (favoriteEvents.length === 0) {
    return [];
  }
  
  // Em uma implementação real, usaríamos um algoritmo de recomendação
  // Por enquanto, vamos usar os próprios favoritos como "recomendados"
  return favoriteEvents;
};

// Funções para gerenciamento de notificações
export const getUserNotifications = async (): Promise<Notification[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return [];
  }

  const userId = session.user.id;

  // Em uma implementação real, buscaríamos do Supabase
  // Por enquanto, retornamos dados de exemplo
  const mockNotifications: Notification[] = [
    {
      id: "notif-1",
      user_id: userId,
      event_id: 1,
      message: "O evento Festival de Música Eletrônica 2023 está quase esgotando!",
      type: "ticket_running_out",
      is_read: false,
      created_at: new Date().toISOString()
    },
    {
      id: "notif-2",
      user_id: userId,
      event_id: 2,
      message: "O evento Show de Rock - Bandas Nacionais teve uma mudança de horário.",
      type: "event_update",
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString() // Ontem
    }
  ];

  return mockNotifications;
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  // Em uma implementação real, atualizaríamos no Supabase
  console.log(`Marcando notificação ${notificationId} como lida`);
  return true;
};

export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  // Em uma implementação real, atualizaríamos no Supabase
  console.log("Marcando todas as notificações como lidas");
  return true;
};

export const clearAllNotifications = async (): Promise<boolean> => {
  // Em uma implementação real, excluiríamos do Supabase
  console.log("Limpando todas as notificações");
  return true;
};

// Função para inscrever nas notificações em tempo real
export const subscribeToNotifications = (callback: (notification: Notification) => void) => {
  // Em uma implementação real, usaríamos o Supabase Realtime
  console.log("Inscrito para receber notificações em tempo real");
  
  // Retorna um objeto com método unsubscribe para desinscrever
  return {
    unsubscribe: () => {
      console.log("Desinscrito das notificações em tempo real");
    }
  };
};
