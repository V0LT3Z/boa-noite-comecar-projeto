
import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TicketType } from "@/types/event"

interface TicketSelectorProps {
  tickets: TicketType[]
  onPurchase?: (selectedTickets: { ticketId: number, quantity: number }[]) => void
}

const TicketSelector = ({ tickets, onPurchase }: TicketSelectorProps) => {
  const [selectedTickets, setSelectedTickets] = useState<{ ticketId: number, quantity: number }[]>(
    tickets?.map(ticket => ({ ticketId: ticket.id, quantity: 0 })) || []
  );

  const handleQuantityChange = (ticketId: number, quantity: number) => {
    setSelectedTickets(prev => 
      prev.map(item => 
        item.ticketId === ticketId ? { ...item, quantity } : item
      )
    );
  };

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(selectedTickets.filter(item => item.quantity > 0));
    }
  };

  if (!tickets || tickets.length === 0) {
    return <div className="p-4">Nenhum ingresso disponível</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ingressos</h2>
      {tickets.map(ticket => {
        const selectedTicket = selectedTickets.find(item => item.ticketId === ticket.id);
        const quantity = selectedTicket ? selectedTicket.quantity : 0;
        const isDecrementDisabled = quantity === 0;
        const isIncrementDisabled = quantity >= (ticket.maxPerPurchase || 0) || quantity >= (ticket.availableQuantity || 0);
        
        return (
          <div key={ticket.id} className="p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{ticket.name}</h3>
                {ticket.description && (
                  <p className="text-sm text-gray-500">{ticket.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Máximo: {ticket.maxPerPurchase} por pessoa
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">R$ {ticket.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  {ticket.availableQuantity} disponíveis
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end mt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(ticket.id, quantity - 1)}
                  disabled={isDecrementDisabled}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(ticket.id, quantity + 1)}
                  disabled={isIncrementDisabled}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="border-b border-gray-200 mt-4"></div>
          </div>
        );
      })}
      
      {onPurchase && (
        <div className="space-y-2">
          <Button 
            onClick={handlePurchase}
            className="w-full bg-primary text-white"
            disabled={!selectedTickets.some(item => item.quantity > 0)}
            size="lg"
          >
            Comprar Ingressos
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            size="lg"
          >
            Adicionar aos favoritos
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicketSelector;
