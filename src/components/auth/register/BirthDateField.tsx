
import FormattedInput from "@/components/FormattedInput";
import { formatDate } from "./validation";

interface BirthDateFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isLoading: boolean;
}

export default function BirthDateField({ value, onChange, error, isLoading }: BirthDateFieldProps) {
  return (
    <div className="space-y-2">
      <FormattedInput
        placeholder="Data de nascimento (DD/MM/AAAA)"
        value={value}
        onChange={onChange}
        disabled={isLoading}
        format={formatDate}
        className={error ? "border-destructive" : ""}
        maxLength={10}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
