
import { Input } from "@/components/ui/input";

interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isLoading: boolean;
}

export default function NameField({ value, onChange, error, isLoading }: NameFieldProps) {
  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Nome completo"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
