
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface FormattedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  format: (value: string) => string;
}

const FormattedInput = React.forwardRef<HTMLInputElement, FormattedInputProps>(
  ({ format, value, onChange, ...props }, ref) => {
    const [formattedValue, setFormattedValue] = useState(() => 
      value ? format(String(value)) : "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^\d]/g, "");
      const formatted = format(rawValue);
      setFormattedValue(formatted);
      
      // Create a synthetic event to pass back to the original onChange handler
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: rawValue
        }
      };
      
      if (onChange) {
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
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
