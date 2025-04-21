
import { ReactNode } from 'react';

export interface NavigationItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

export type EventStatus = "active" | "paused" | "cancelled";

export interface EventItem {
  id: number;
  title: string;
  date: string;
  status: EventStatus;
  ticketsSold: number;
  totalRevenue: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}
