
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface FormattedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  format: (value: string) => string;
  onChange: (value: string) => void;
}

const FormattedInput = React.forwardRef<HTMLInputElement, FormattedInputProps>(
  ({ format, value, onChange, ...props }, ref) => {
    const [formattedValue, setFormattedValue] = useState(() => 
      value ? format(String(value)) : "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const formatted = format(rawValue);
      setFormattedValue(formatted);
      
      // Pass the formatted value to the parent component
      onChange(formatted);
    };

    return (
      <Input
        ref={ref}
        {...props}
        value={formattedValue}
        onChange={handleChange}
      />
    );
  }
);

FormattedInput.displayName = "FormattedInput";

export default FormattedInput;
