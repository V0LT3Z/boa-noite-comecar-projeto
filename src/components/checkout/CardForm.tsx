
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import FormattedInput from "@/components/FormattedInput"
import { UseFormReturn } from "react-hook-form"

interface CardFormProps {
  form: UseFormReturn<any>;
}

const CardForm = ({ form }: CardFormProps) => {
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
  )
}

export default CardForm
