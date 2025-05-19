
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
    return [];
  }

  // Mock de dados para eventos favoritos
  // Em uma aplicação real, buscaríamos estes dados do backend
  const mockFavorites: EventDetails[] = favorites.map(fav => ({
    id: fav.event_id,
    title: `Evento ${fav.event_id}`,
    description: "Descrição do evento favorito",
    date: "2023-12-15",
    time: "20:00",
    location: "São Paulo, SP",
    image: "https://picsum.photos/seed/event3/800/500",
    tickets: [
      { id: 1, name: "Ingresso Comum", price: 150.0, availableQuantity: 100, maxPerPurchase: 4, description: "Acesso à área comum" },
      { id: 2, name: "Ingresso VIP", price: 300.0, availableQuantity: 50, maxPerPurchase: 2, description: "Acesso à área VIP" }
    ],
    venue: {
      name: "Arena XYZ",
      address: "Av. Principal, 1000",
      capacity: 5000,
      map_url: "https://maps.google.com"
    },
    minimumAge: 18,
    warnings: ["Proibido fumar", "Entrada de menores apenas com acompanhante"],
    coordinates: { lat: -23.55, lng: -46.64 },
    status: "active" 
  }));

  return mockFavorites;
};

// Alias para compatibilidade com o código existente
export const getUserFavorites = getFavorites;

// Função para obter eventos recomendados com base nos favoritos
export const getRecommended = async (): Promise<EventDetails[]> => {
  // Mock de dados para eventos recomendados
  // Em uma aplicação real, usaríamos um algoritmo de recomendação
  const mockRecommended: EventDetails[] = [
    {
      id: 101,
      title: "Evento Recomendado 1",
      description: "Este evento combina com seus gostos",
      date: "2023-11-25",
      time: "19:00",
      location: "Rio de Janeiro, RJ",
      image: "https://picsum.photos/seed/rec1/800/500",
      tickets: [
        { id: 1, name: "Ingresso Comum", price: 120.0, availableQuantity: 80, maxPerPurchase: 4, description: "Acesso à área comum" },
        { id: 2, name: "Ingresso VIP", price: 240.0, availableQuantity: 40, maxPerPurchase: 2, description: "Acesso à área VIP" }
      ],
      venue: {
        name: "Centro de Eventos ABC",
        address: "Rua das Flores, 500",
        capacity: 3000,
        map_url: "https://maps.google.com"
      },
      minimumAge: 16,
      warnings: ["Proibido fumar"],
      coordinates: { lat: -22.91, lng: -43.21 },
      status: "active"
    }
  ];

  return mockRecommended;
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
