
import * as z from "zod";

// Form schema for ticket type validation
export const ticketTypeSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().min(2, "Nome do ingresso deve ter pelo menos 2 caracteres"),
  price: z.string().min(1, "Preço é obrigatório"),
  description: z.string().optional().default(""),
  availableQuantity: z.string().min(1, "Quantidade disponível é obrigatória"),
  maxPerPurchase: z.string().min(1, "Quantidade máxima por compra é obrigatória"),
});

// Form schema for event validation
export const eventSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres"),
  location: z.string().min(5, "O local deve ter pelo menos 5 caracteres"),
  date: z.date({
    required_error: "A data do evento é obrigatória",
  }),
  time: z.string().default("19:00"),
  minimumAge: z.string().default("0"),
  bannerUrl: z.string().optional(),
  venue: z.string().default(""),
  status: z.enum(["active", "paused", "cancelled"]).default("active"),
  warnings: z.array(z.string()).default([]),
  tickets: z.array(ticketTypeSchema).min(1, "Adicione pelo menos um tipo de ingresso"),
});

export type EventFormValues = z.infer<typeof eventSchema>;
