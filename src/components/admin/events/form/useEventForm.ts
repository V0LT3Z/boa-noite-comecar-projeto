
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AdminEventForm, AdminTicketType } from "@/types/admin";
import { EventFormValues, eventSchema } from "./eventFormSchema";
import { toast } from "@/hooks/use-toast";
import { createEvent, updateEvent, deleteTicketType } from "@/services/events";
import { useAuth } from "@/contexts/AuthContext";

export function useEventForm(event: any | undefined, onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingTicket, setIsDeletingTicket] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(event?.bannerUrl || null);
  const { user } = useAuth();
  
  // Initialize form with default or existing values
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      location: event?.location || "",
      date: event?.date ? new Date(event.date) : new Date(),
      time: event?.time || "19:00",
      minimumAge: event?.minimumAge?.toString() || "0",
      bannerUrl: event?.bannerUrl || "",
      venue: event?.venue || "",
      status: event?.status || "active",
      warnings: event?.warnings || [],
      tickets: event?.tickets?.length > 0 
        ? event.tickets.map(ticket => ({
            id: ticket.id,
            name: ticket.name,
            price: typeof ticket.price === 'number' ? ticket.price.toString() : ticket.price,
            description: ticket.description || "",
            availableQuantity: typeof ticket.availableQuantity === 'number' ? 
              ticket.availableQuantity.toString() : ticket.availableQuantity,
            maxPerPurchase: typeof ticket.maxPerPurchase === 'number' ? 
              ticket.maxPerPurchase.toString() : ticket.maxPerPurchase
          })) 
        : [{
            id: "new-1",
            name: "Entrada Padrão",
            price: "0",
            description: "Ingresso padrão para o evento",
            availableQuantity: "100",
            maxPerPurchase: "4"
          }]
    },
  });

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      
      // Update form value with the image URL
      form.setValue("bannerUrl", imageUrl);
    }
  };

  // Handle adding new ticket type
  const addTicketType = () => {
    const currentTickets = form.getValues("tickets") || [];
    form.setValue("tickets", [
      ...currentTickets,
      {
        id: `new-${Date.now()}`,
        name: `Tipo de Ingresso ${currentTickets.length + 1}`,
        price: "0",
        description: "",
        availableQuantity: "50",
        maxPerPurchase: "4"
      }
    ]);
  };

  // Handle removing ticket type
  const removeTicketType = async (index: number) => {
    const currentTickets = form.getValues("tickets") || [];
    if (currentTickets.length <= 1) {
      toast({
        title: "Não é possível remover",
        description: "Deve haver pelo menos um tipo de ingresso.",
        variant: "destructive"
      });
      return;
    }
    
    const ticketToRemove = currentTickets[index];
    
    // If this is an existing ticket in the database (has a numeric ID), delete it from the database
    if (ticketToRemove.id && typeof ticketToRemove.id === 'number' && event?.id) {
      try {
        setIsDeletingTicket(ticketToRemove.id);
        await deleteTicketType(ticketToRemove.id);
        toast({
          title: "Ingresso removido",
          description: `O ingresso "${ticketToRemove.name}" foi removido com sucesso.`,
          variant: "success"
        });
      } catch (error: any) {
        toast({
          title: "Erro ao remover",
          description: `Não foi possível remover o ingresso: ${error.message}`,
          variant: "destructive"
        });
        return; // Don't proceed if DB deletion failed
      } finally {
        setIsDeletingTicket(null);
      }
    }
    
    // Remove from the form state
    form.setValue("tickets", currentTickets.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting event data:", data);
      
      // Convert form data to AdminEventForm format
      const adminEventData: AdminEventForm = {
        title: data.title,
        description: data.description,
        location: data.location,
        date: format(data.date, "yyyy-MM-dd"),
        time: data.time,
        minimumAge: data.minimumAge,
        bannerUrl: data.bannerUrl || "",
        venue: data.venue || data.location, // Use location as venue if venue is not provided
        status: data.status,
        warnings: data.warnings,
        tickets: data.tickets.map((ticket): AdminTicketType => ({
          id: ticket.id || `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: ticket.name,
          price: ticket.price,
          description: ticket.description || "",
          availableQuantity: ticket.availableQuantity,
          maxPerPurchase: ticket.maxPerPurchase
        }))
      };
      
      try {
        if (event?.id) {
          // Update existing event
          await updateEvent(event.id, adminEventData);
        } else {
          // Create new event
          if (!user) {
            throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
          }
          await createEvent(adminEventData, user.id);
        }
        
        toast({
          title: event?.id ? "Evento atualizado" : "Evento criado",
          description: event?.id 
            ? "O evento foi atualizado com sucesso." 
            : "O evento foi criado com sucesso.",
          variant: "success"
        });
        
        // Call success callback
        onSuccess();
      } catch (error: any) {
        console.error("Erro ao salvar evento:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("Erro detalhado ao salvar evento:", error);
      toast({
        title: "Erro ao salvar",
        description: `Não foi possível salvar o evento: ${error.message || "Erro desconhecido"}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isDeletingTicket,
    previewImage,
    setPreviewImage,
    handleImageChange,
    addTicketType,
    removeTicketType,
    onSubmit
  };
}
