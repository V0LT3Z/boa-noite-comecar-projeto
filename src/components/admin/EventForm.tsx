
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

// Form schema for event validation
const eventSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres"),
  location: z.string().min(5, "O local deve ter pelo menos 5 caracteres"),
  date: z.date({
    required_error: "A data do evento é obrigatória",
  }),
  price: z.coerce.number().min(0, "O preço não pode ser negativo"),
  capacity: z.coerce.number().min(1, "A capacidade deve ser pelo menos 1"),
  bannerUrl: z.string().optional(),
});

// Types for form data and component props
type EventFormValues = z.infer<typeof eventSchema>;
type EventFormProps = {
  event?: any; // Existing event data for editing
  onSuccess: () => void; // Callback on successful submission
};

export function EventForm({ event, onSuccess }: EventFormProps) {
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
      price: event?.price || 0,
      capacity: event?.capacity || 100,
      bannerUrl: event?.bannerUrl || "",
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

  // Handle form submission
  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting event data:", data);
      
      const eventData = {
        title: data.title,
        description: data.description,
        location: data.location,
        date: format(data.date, "yyyy-MM-dd"),
        price: data.price,
        capacity: data.capacity,
        banner_url: data.bannerUrl || null,
        status: "active",
      };

      if (event?.id) {
        // Update existing event
        const { error } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", event.id);
          
        if (error) throw error;
        toast({
          title: "Evento atualizado",
          description: "O evento foi atualizado com sucesso.",
        });
      } else {
        // Create new event
        const { error } = await supabase
          .from("events")
          .insert([eventData]);
          
        if (error) throw error;
        toast({
          title: "Evento criado",
          description: "O evento foi criado com sucesso.",
        });
      }
      
      // Call success callback
      onSuccess();
      
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o evento. Tente novamente.",
        variant: "destructive",
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
