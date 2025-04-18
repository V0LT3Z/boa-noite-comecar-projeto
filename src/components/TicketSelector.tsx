
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TicketType } from "@/types/event"

interface TicketSelectorProps {
  ticket: TicketType
  quantity: number
  onQuantityChange: (quantity: number) => void
}

const TicketSelector = ({ ticket, quantity, onQuantityChange }: TicketSelectorProps) => {
  const isDecrementDisabled = quantity === 0
  const isIncrementDisabled = quantity >= ticket.maxPerPurchase || quantity >= ticket.availableQuantity

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{ticket.name}</h3>
          {ticket.description && (
            <p className="text-sm text-gray-500">{ticket.description}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold">R$ {ticket.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">
            {ticket.availableQuantity} disponíveis
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Máximo: {ticket.maxPerPurchase} por pessoa
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={isDecrementDisabled}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={isIncrementDisabled}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TicketSelector
