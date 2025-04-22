
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

export interface AdminEventForm {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  venue: string;
  bannerUrl: string;
  minimumAge: string;
  status: "active" | "paused" | "cancelled";
  capacity?: number; // Added capacity as optional property
  price?: number; // Added price as optional property
  warnings: string[];
  tickets: AdminTicketType[];
}

export interface AdminTicketType {
  id: string;
  name: string;
  price: string;
  description: string;
  availableQuantity: string;
  maxPerPurchase: string;
}

export interface QRVerification {
  valid: boolean;
  message: string;
  ticketInfo?: {
    eventName: string;
    ticketType: string;
    userName: string;
  };
}
