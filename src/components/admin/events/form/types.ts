
import { AdminEventForm } from "@/types/admin";

export interface EventFormProps {
  event?: any;
  onSuccess: () => void;
}

export interface FormSubmitData {
  adminEventData: AdminEventForm;
  eventId?: number;
}
