
import { Badge } from '@/components/ui/badge';

export type EventStatus = "active" | "paused" | "cancelled";

interface EventStatusBadgeProps {
  status: EventStatus;
}

export const EventStatusBadge = ({ status }: EventStatusBadgeProps) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Ativo</Badge>;
    case "paused":
      return <Badge variant="outline" className="text-amber-500 border-amber-500">Pausado</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelado</Badge>;
    default:
      return null;
  }
};
