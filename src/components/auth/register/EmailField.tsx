
import { CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isLoading: boolean;
  isCheckingEmail: boolean;
  isEmailAvailable: boolean | null;
}

export default function EmailField({
  value,
  onChange,
  error,
  isLoading,
  isCheckingEmail,
  isEmailAvailable
}: EmailFieldProps) {
  const isValidEmailFormat = value && value.includes('@') && value.includes('.');

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="email"
          placeholder="Email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          className={error ? "border-destructive pr-10" : "pr-10"}
        />
        {isValidEmailFormat && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isCheckingEmail ? (
              <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isEmailAvailable === true ? (
              <CheckCircle2 size={18} className="text-green-600" />
            ) : isEmailAvailable === false ? (
              <XCircle size={18} className="text-destructive" />
            ) : null}
          </div>
        )}
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
