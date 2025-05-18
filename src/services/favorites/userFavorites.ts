
import { supabase } from "@/integrations/supabase/client";
import { EventDetails } from "@/types/event";

// Function to get all favorite events of the user
export const getFavorites = async (): Promise<EventDetails[]> => {
  // Check if user is logged in
  const sessionResult = await supabase.auth.getSession();
  const session = sessionResult.data.session;
  
  if (!session) {
    return [];
  }

  const userId = session.user.id;

  // Fetch favorites
  const { data: favorites, error: favoritesError } = await supabase
    .from("favorites")
    .select("event_id")
    .eq("user_id", userId);

  if (favoritesError || !favorites || favorites.length === 0) {
    console.log("Nenhum favorito encontrado ou erro:", favoritesError);
    return [];
  }

  console.log("Favoritos encontrados:", favorites);
  
  // Fetch details of favorited events
  const eventIds = favorites.map(fav => fav.event_id);
  
  // In a real application, we would fetch these events from the backend
  // For now, we'll fetch the event details using the IDs
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .in("id", eventIds);
    
  if (eventsError || !events) {
    console.log("Erro ao buscar eventos favoritados:", eventsError);
    return [];
  }
  
  console.log("Eventos favoritados encontrados:", events);
  
  // Map events to EventDetails format
  // Fix type error by ensuring status is one of the accepted values
  const eventDetails: EventDetails[] = events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description || "",
    date: event.date,
    time: new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    location: event.location,
    image: event.image_url || `https://picsum.photos/seed/${event.id}/800/500`,
    tickets: [],  // This data would be fetched from another table
    venue: {
      name: event.location,
      address: "",
      capacity: 0,
      map_url: ""
    },
    minimumAge: event.minimum_age || 0,
    warnings: [],
    coordinates: { lat: 0, lng: 0 },
    // Type coercion to ensure compatibility with EventDetails
    status: (event.status as "active" | "paused" | "cancelled") || "active"
  }));

  return eventDetails;
};

// Alias for compatibility with existing code
export const getUserFavorites = getFavorites;

// Function to get recommended events based on favorites
export const getRecommended = async (): Promise<EventDetails[]> => {
  // In a real implementation, we would fetch recommendations based on favorites
  // For now, return an empty array
  return [];
};
