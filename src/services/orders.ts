
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";

interface SelectedTicket {
  ticketId: number;
  quantity: number;
}

// Função para criar uma nova ordem
export const createOrder = async (
  eventId: number,
  selectedTickets: SelectedTicket[],
  paymentMethod: string
) => {
  // Buscar os tipos de ingressos para calcular o preço
  const { data: ticketTypes, error: ticketError } = await supabase
    .from("ticket_types")
    .select("*")
    .in("id", selectedTickets.map(t => t.ticketId));

  if (ticketError) throw ticketError;
  if (!ticketTypes || ticketTypes.length === 0) {
    throw new Error("Nenhum tipo de ingresso encontrado");
  }

  // Começar uma transação
  const orders = [];

  // Criar uma ordem para cada tipo de ingresso
  for (const selected of selectedTickets) {
    if (selected.quantity <= 0) continue;

    const ticketType = ticketTypes.find(t => t.id === selected.ticketId);
    if (!ticketType) continue;

    // Verificar se a quantidade solicitada está disponível
    if (selected.quantity > ticketType.available_quantity) {
      throw new Error(`Quantidade solicitada indisponível para ${ticketType.name}`);
    }

    // Calcular o preço total
    const totalPrice = ticketType.price * selected.quantity;

    // Inserir a ordem
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        event_id: eventId,
        ticket_type_id: ticketType.id,
        quantity: selected.quantity,
        total_price: totalPrice,
        payment_method: paymentMethod,
        payment_status: "paid" // No mundo real, isso seria "pending" até a confirmação do gateway
      })
      .select()
      .single();

    if (orderError) throw orderError;
    orders.push(order);

    // Gerar tickets individuais com QR codes
    const tickets = [];
    for (let i = 0; i < selected.quantity; i++) {
      tickets.push({
        order_id: order.id,
        event_id: eventId,
        ticket_type_id: ticketType.id,
        qr_code: nanoid(10).toUpperCase(), // gera um código QR único
      });
    }

    // Inserir os tickets
    const { error: ticketsError } = await supabase
      .from("tickets")
      .insert(tickets);

    if (ticketsError) throw ticketsError;

    // Atualizar a quantidade disponível
    const { error: updateError } = await supabase
      .from("ticket_types")
      .update({
        available_quantity: ticketType.available_quantity - selected.quantity
      })
      .eq("id", ticketType.id);

    if (updateError) throw updateError;

    // Atualizar o contador de tickets vendidos no evento
    const { error: eventUpdateError } = await supabase
      .rpc("increment_tickets_sold", {
        event_id: eventId,
        amount: selected.quantity
      });

    if (eventUpdateError) {
      // Fallback sem usar RPC
      const { data: event } = await supabase
        .from("events")
        .select("tickets_sold")
        .eq("id", eventId)
        .single();

      if (event) {
        await supabase
          .from("events")
          .update({
            tickets_sold: (event.tickets_sold || 0) + selected.quantity
          })
          .eq("id", eventId);
      }
    }
  }

  return orders;
};

// Função para verificar um QR code
export const verifyTicketQR = async (qrCode: string) => {
  const { data, error } = await supabase
    .from("tickets")
    .select(`
      is_used,
      events!inner(title),
      ticket_types!inner(name),
      user_id
    `)
    .eq("qr_code", qrCode)
    .single();

  if (error) {
    return {
      valid: false,
      message: "Ingresso inválido!"
    };
  }

  if (data.is_used) {
    return {
      valid: false,
      message: "Ingresso já utilizado!",
      ticketInfo: {
        eventName: data.events.title,
        ticketType: data.ticket_types.name,
        userName: data.user_id || "Não identificado"
      }
    };
  }

  // Marcar o ingresso como usado
  await supabase
    .from("tickets")
    .update({ is_used: true })
    .eq("qr_code", qrCode);

  return {
    valid: true,
    message: "Ingresso válido!",
    ticketInfo: {
      eventName: data.events.title,
      ticketType: data.ticket_types.name,
      userName: data.user_id || "Não identificado"
    }
  };
};
