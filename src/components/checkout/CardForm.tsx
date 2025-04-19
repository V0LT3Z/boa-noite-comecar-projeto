
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import FormattedInput from "@/components/FormattedInput"
import { Input } from "@/components/ui/input";

const cardSchema = z.object({
  cardNumber: z.string().min(16, "Número do cartão inválido").max(19),
  expiryDate: z.string().min(4, "Data de validade inválida").max(5),
  cvc: z.string().min(3, "CVC inválido").max(3),
  holderName: z.string().min(3, "Nome do titular inválido"),
});

type CardFormValues = z.infer<typeof cardSchema>;

interface CardFormProps {
  onSubmit: (data: CardFormValues) => void;
  isSubmitting: boolean;
}

const CardForm = ({ onSubmit, isSubmitting }: CardFormProps) => {
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      holderName: "",
    },
  });

  const formatCardNumber = (value: string) => {
    if (!value) return "";
    const cardNumberChunks = [];
    for (let i = 0; i < value.length; i += 4) {
      cardNumberChunks.push(value.slice(i, i + 4));
    }
    return cardNumberChunks.join(' ').trim().slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    if (!value) return "";
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    if (value.length > 2) {
      return `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    return value;
  };

  const formatCVC = (value: string) => {
    return value.slice(0, 3);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Cartão</FormLabel>
                <FormControl>
                  <FormattedInput 
                    format={formatCardNumber}
                    placeholder="0000 0000 0000 0000" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="holderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Titular</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome como está no cartão" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validade</FormLabel>
                  <FormControl>
                    <FormattedInput 
                      format={formatExpiryDate}
                      placeholder="MM/AA" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cvc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVC</FormLabel>
                  <FormControl>
                    <FormattedInput 
                      format={formatCVC}
                      placeholder="123" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-primary text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processando pagamento..." : "Finalizar Pagamento"}
        </Button>
      </form>
    </Form>
  )
}

export default CardForm
