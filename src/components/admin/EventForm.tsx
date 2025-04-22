
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { createEvent } from "@/services/events";
import { AdminEventForm, AdminTicketType } from "@/types/admin";

// Form schema for ticket type validation
const ticketTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome do ingresso deve ter pelo menos 2 caracteres"),
  price: z.string().min(1, "Preço é obrigatório"),
  description: z.string().optional().default(""),
  availableQuantity: z.string().min(1, "Quantidade disponível é obrigatória"),
  maxPerPurchase: z.string().min(1, "Quantidade máxima por compra é obrigatória"),
});

// Form schema for event validation
const eventSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres"),
  location: z.string().min(5, "O local deve ter pelo menos 5 caracteres"),
  date: z.date({
    required_error: "A data do evento é obrigatória",
  }),
  time: z.string().default("19:00"),
  minimumAge: z.string().default("0"),
  price: z.coerce.number().min(0, "O preço não pode ser negativo"),
  capacity: z.coerce.number().min(1, "A capacidade deve ser pelo menos 1"),
  bannerUrl: z.string().optional(),
  venue: z.string().default(""), // Added venue field to match AdminEventForm type
  status: z.enum(["active", "paused", "cancelled"]).default("active"),
  warnings: z.array(z.string()).default([]),
  tickets: z.array(ticketTypeSchema).min(1, "Adicione pelo menos um tipo de ingresso"),
});

// Types for form data and component props
type EventFormValues = z.infer<typeof eventSchema>;
type EventFormProps = {
  event?: any; // Existing event data for editing
  onSuccess: () => void; // Callback on successful submission
};

export default function EventForm({ event, onSuccess }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(event?.bannerUrl || null);
  
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
      price: event?.price || 0,
      capacity: event?.capacity || 100,
      bannerUrl: event?.bannerUrl || "",
      venue: event?.venue || "",
      status: event?.status || "active",
      warnings: event?.warnings || [],
      tickets: event?.tickets?.length > 0 
        ? event.tickets 
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
  const removeTicketType = (index: number) => {
    const currentTickets = form.getValues("tickets") || [];
    if (currentTickets.length <= 1) {
      toast({
        title: "Não é possível remover",
        description: "Deve haver pelo menos um tipo de ingresso.",
        variant: "destructive"
      });
      return;
    }
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
        venue: data.location, // Using location as venue
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
          // Update existing event logic will be here
          console.log("Updating event:", event.id);
        } else {
          // Create new event
          await createEvent(adminEventData);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Banner image upload */}
        <div className="space-y-2">
          <FormLabel>Banner do Evento</FormLabel>
          <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg">
            {previewImage ? (
              <div className="relative w-full max-w-md">
                <img 
                  src={previewImage} 
                  alt="Banner preview" 
                  className="w-full h-auto rounded-lg object-cover" 
                  style={{ maxHeight: "200px" }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPreviewImage(null);
                    form.setValue("bannerUrl", "");
                  }}
                >
                  Remover
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Arraste e solte ou clique para selecionar uma imagem
                </p>
              </div>
            )}
            <div className="w-full">
              <Input
                id="banner"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Event title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Evento</FormLabel>
              <FormControl>
                <Input placeholder="Nome do evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o evento" 
                  className="min-h-32" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local</FormLabel>
              <FormControl>
                <Input placeholder="Endereço do evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Event time */}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event price and capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Defina 0 para eventos gratuitos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidade</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormDescription>
                  Número máximo de ingressos disponíveis
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Event minimum age */}
        <FormField
          control={form.control}
          name="minimumAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idade Mínima</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormDescription>
                Defina 0 para sem restrição de idade
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ticket Types Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Tipos de Ingressos</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addTicketType}
            >
              <Plus className="h-4 w-4 mr-2" /> Adicionar Tipo
            </Button>
          </div>

          {form.watch("tickets")?.map((_, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Tipo de Ingresso {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTicketType(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ticket Name */}
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: VIP, Backstage, Pista" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ticket Price */}
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ticket Available Quantity */}
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.availableQuantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade Disponível</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ticket Max Per Purchase */}
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.maxPerPurchase`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Máx. por Compra</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ticket Description */}
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Descreva este tipo de ingresso" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-secondary text-white"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Salvando..."
            : event?.id
            ? "Atualizar Evento"
            : "Criar Evento"}
        </Button>
      </form>
    </Form>
  );
}
