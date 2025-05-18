
// Types related to favorites and notifications
import { EventDetails } from "@/types/event";

// Notification type definition
export interface Notification {
  id: string;
  user_id: string;
  event_id: number;
  message: string;
  type: "ticket_running_out" | "event_update" | "favorite_update" | "transaction_update";
  is_read: boolean;
  created_at: string;
}

// Subscription return type
export interface NotificationSubscription {
  unsubscribe: () => void;
}
