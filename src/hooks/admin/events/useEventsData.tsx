
import { useCallback, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { fetchEvents } from "@/services/events";
import { EventItem } from "@/types/admin";

/**
 * Hook for handling the loading and filtering of events data.
 */
export function useEventsData(
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>,
  setLoadingEvents: React.Dispatch<React.SetStateAction<boolean>>,
  isCreatingEvent: boolean,
  searchQuery: string,
  apiCallInProgressRef: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>,
  deletedEventIdsRef: React.MutableRefObject<number[]>
) {
  // Load events with useCallback to prevent unnecessary re-renders
  const loadEvents = useCallback(async () => {
    // Skip if we're already loading or unmounted
    if (apiCallInProgressRef.current || !isMountedRef.current) return;
    
    try {
      console.log("Iniciando carregamento de eventos");
      apiCallInProgressRef.current = true;
      setLoadingEvents(true);
      
      // Fetch events from the API
      const fetchedEvents = await fetchEvents();
      
      // Skip state update if component unmounted during fetch
      if (!isMountedRef.current) return;
      
      // Filter out any previously deleted events that might still come from the API
      const filteredEvents = fetchedEvents.filter(
        event => !deletedEventIdsRef.current.includes(event.id)
      );
      
      console.log(`Eventos após filtragem: ${filteredEvents.length} (removidos: ${deletedEventIdsRef.current.length})`);
      
      // Format events for display
      const formattedEvents: EventItem[] = filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: format(new Date(event.date), "yyyy-MM-dd"),
        status: (event.status as "active" | "paused" | "cancelled") || "active",
        ticketsSold: event.tickets_sold || 0,
        totalRevenue: 0,
        description: event.description || "",
        location: event.location || "",
        venue: event.location || "",
        minimumAge: event.minimum_age?.toString() || "0"
      }));
      
      setEvents(formattedEvents);
      console.log(`${formattedEvents.length} eventos carregados com sucesso`);
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error("Erro ao carregar eventos:", error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar a lista de eventos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      // Skip state update if component unmounted
      if (isMountedRef.current) {
        setLoadingEvents(false);
      }
      apiCallInProgressRef.current = false;
    }
  }, [setEvents, setLoadingEvents, isMountedRef, apiCallInProgressRef, deletedEventIdsRef]);

  // Load events on mount and when event creation state changes
  useEffect(() => {
    if (!isCreatingEvent) {
      loadEvents();
    }
  }, [isCreatingEvent, loadEvents]);

  // Filter events based on search query
  const getFilteredEvents = useCallback((events: EventItem[]) => {
    return events.filter(event => {
      return event.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  return { loadEvents, getFilteredEvents };
}
