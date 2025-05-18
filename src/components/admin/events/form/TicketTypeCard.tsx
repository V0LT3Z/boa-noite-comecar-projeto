
import { Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EventFormValues } from "./eventFormSchema";

interface TicketTypeCardProps {
  index: number;
  onRemove: (index: number) => void;
  isDeleting: boolean;
}

const TicketTypeCard = ({ index, onRemove, isDeleting }: TicketTypeCardProps) => {
  const { control, getValues } = useFormContext<EventFormValues>();
  const ticketId = getValues(`tickets.${index}.id`);

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Tipo de Ingresso {index + 1}</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            disabled={isDeleting === ticketId}
          >
            {isDeleting === ticketId ? (
              "Removendo..."
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ticket Name */}
          <FormField
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
  );
};

export default TicketTypeCard;
