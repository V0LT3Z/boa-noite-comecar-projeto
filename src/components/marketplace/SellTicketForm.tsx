
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const sellTicketSchema = z.object({
  eventId: z.string({
    required_error: "Por favor, selecione um evento",
  }),
  ticketId: z.string({
    required_error: "Por favor, selecione um ingresso",
  }),
  quantity: z.string().refine(
    (val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num > 0;
    },
    {
      message: "A quantidade deve ser maior que 0",
    }
  ),
  price: z.string(),
});

const SellTicketForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Mock data for user's tickets
  const userEvents = [
    { id: "101", name: "Deu Baile | Sexta" },
    { id: "102", name: "Festival de Verão" },
    { id: "103", name: "Metallica Tour" },
  ];
  
  const [selectedEventTickets, setSelectedEventTickets] = useState<any[]>([]);
  
  const form = useForm<z.infer<typeof sellTicketSchema>>({
    resolver: zodResolver(sellTicketSchema),
    defaultValues: {
      quantity: "1",
    },
  });

  const onEventChange = (eventId: string) => {
    // Mock data - in real app this would fetch tickets for the selected event
    if (eventId === "101") {
      setSelectedEventTickets([
        { id: "1", type: "Pista", price: 75.00 },
        { id: "2", type: "VIP", price: 150.00 },
      ]);
    } else if (eventId === "102") {
      setSelectedEventTickets([
        { id: "3", type: "Geral", price: 80.00 },
        { id: "4", type: "VIP", price: 180.00 },
      ]);
    } else if (eventId === "103") {
      setSelectedEventTickets([
        { id: "5", type: "Pista Premium", price: 350.00 },
      ]);
    }
    
    form.setValue("ticketId", "");
    form.setValue("price", "");
  };
  
  const onTicketChange = (ticketId: string) => {
    const ticket = selectedEventTickets.find(t => t.id === ticketId);
    if (ticket) {
      form.setValue("price", ticket.price.toFixed(2));
    }
  };
  
  const onSubmit = async (data: z.infer<typeof sellTicketSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Ingresso colocado à venda com sucesso!");
      form.reset();
      setSelectedEventTickets([]);
    } catch (error) {
      toast.error("Erro ao colocar ingresso à venda. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evento</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  onEventChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um evento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ticketId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingresso</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  onTicketChange(value);
                }}
                defaultValue={field.value}
                disabled={selectedEventTickets.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ingresso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedEventTickets.map((ticket) => (
                    <SelectItem key={ticket.id} value={ticket.id}>
                      {ticket.type} - R$ {ticket.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormDescription>
                O preço é fixado ao valor original do ingresso
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting || selectedEventTickets.length === 0}>
          {isSubmitting ? "Enviando..." : "Colocar à venda"}
        </Button>
      </form>
    </Form>
  );
};

export default SellTicketForm;
