
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface FormattedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  format: (value: string) => string;
  onChange: (value: string) => void;
  onValidate?: (value: string) => boolean;
  isValid?: boolean;
}

const FormattedInput = React.forwardRef<HTMLInputElement, FormattedInputProps>(
  ({ format, value, onChange, onValidate, isValid, className, ...props }, ref) => {
    const [formattedValue, setFormattedValue] = useState(() => 
      value ? format(String(value)) : "");
    
    // Update formatted value when external value changes
    useEffect(() => {
      if (value !== undefined) {
        setFormattedValue(format(String(value)));
      }
    }, [value, format]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const formatted = format(rawValue);
      setFormattedValue(formatted);
      
      // Pass the formatted value to the parent component
      onChange(formatted);
      
      // If validation function is provided, call it immediately
      if (onValidate) {
        onValidate(formatted);
      }
    };

    const inputClasses = isValid === false ? "border-destructive font-gooddog" : cn(className, "font-gooddog");

    return (
      <Input
        ref={ref}
        {...props}
        value={formattedValue}
        onChange={handleChange}
        className={inputClasses}
      />
    );
  }
);

FormattedInput.displayName = "FormattedInput";

export default FormattedInput;
