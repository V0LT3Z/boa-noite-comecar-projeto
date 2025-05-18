
import { supabase } from "@/integrations/supabase/client";
import { EventDetails } from "@/types/event";

// Function to add an event to favorites
export const addToFavorites = async (eventId: number) => {
  // Check if user is logged in
  const sessionResult = await supabase.auth.getSession();
  const session = sessionResult.data.session;
  
  if (!session) {
    throw new Error("Você precisa estar logado para adicionar favoritos");
  }

  const userId = session.user.id;
  console.log("Adicionando favorito - UserID:", userId, "EventID:", eventId);

  // Check if already in favorites
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
    // If it exists already, do nothing
    console.log("Evento já está nos favoritos");
    return true;
  }

  // If it doesn't exist, add to favorites
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

// Function to remove an event from favorites
export const removeFromFavorites = async (eventId: number) => {
  // Check if user is logged in
  const sessionResult = await supabase.auth.getSession();
  const session = sessionResult.data.session;
  
  if (!session) {
    throw new Error("Você precisa estar logado para remover favoritos");
  }

  const userId = session.user.id;
  console.log("Removendo favorito - UserID:", userId, "EventID:", eventId);

  // Remove from favorites
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

// Function to check if an event is favorited
export const isEventFavorited = async (eventId: number): Promise<boolean> => {
  // Check if user is logged in
  const sessionResult = await supabase.auth.getSession();
  const session = sessionResult.data.session;
  
  if (!session) {
    return false;
  }

  const userId = session.user.id;
  console.log("Verificando favorito - UserID:", userId, "EventID:", eventId);

  // Check in favorites
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
