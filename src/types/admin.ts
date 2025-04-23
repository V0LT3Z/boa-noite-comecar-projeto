
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
  venue?: string;
  minimumAge?: string;
  description?: string;
  location?: string;
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
  capacity?: number; 
  price?: number;
  warnings: string[];
  tickets: AdminTicketType[];
}

export interface AdminTicketType {
  id?: string | number; // Changed to accept both string and number
  name: string;
  price: string; // Changed from number to string to match the form
  description: string;
  availableQuantity: string; // Changed from number to string to match the form
  maxPerPurchase: string; // Changed from number to string to match the form
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
