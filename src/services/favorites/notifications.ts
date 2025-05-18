
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationSubscription } from "./types";

// Functions for notification management
export const getUserNotifications = async (): Promise<Notification[]> => {
  const sessionResult = await supabase.auth.getSession();
  const session = sessionResult.data.session;
  
  if (!session) {
    return [];
  }

  const userId = session.user.id;

  // Fetch user notifications from Supabase
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
  const sessionResult = await supabase.auth.getSession();
  const session = sessionResult.data.session;
  
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
  const sessionResult = await supabase.auth.getSession();
  const session = sessionResult.data.session;
  
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
  const sessionResult = await supabase.auth.getSession();
  const session = sessionResult.data.session;
  
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

// Function to subscribe to real-time notifications
export const subscribeToNotifications = (callback: (notification: Notification) => void): NotificationSubscription => {
  const sessionPromise = supabase.auth.getSession();
  
  // Use Promise and then() to avoid direct access to .data
  sessionPromise.then(({ data: { session } }) => {
    if (!session) {
      console.log("Usuário não está autenticado para receber notificações");
      return;
    }
    
    console.log("Inscrito para receber notificações em tempo real");
  });
  
  // In a real implementation, we would use Supabase Realtime
  // For now, return an object with unsubscribe method
  return {
    unsubscribe: () => {
      console.log("Desinscrito das notificações em tempo real");
    }
  };
};
