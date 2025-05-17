
import { useState } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  confirmValue?: string;
  isConfirm?: boolean;
  error?: string;
  isLoading: boolean;
}

export default function PasswordField({
  value,
  onChange,
  confirmValue,
  isConfirm = false,
  error,
  isLoading
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Password strength checks
  const hasMinLength = value.length >= 8;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const passwordsMatch = !isConfirm ? true : (!!value && value === confirmValue);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={isConfirm ? "Confirmar senha" : "Senha"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          className={error ? "border-destructive pr-10" : "pr-10"}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      
      {!isConfirm && value && (
        <div className="space-y-1 text-xs mt-2">
          <p className="font-medium text-sm text-gray-700">A senha deve conter:</p>
          <div className={`flex items-center gap-1 ${hasMinLength ? "text-green-600" : "text-gray-500"}`}>
            <CheckCircle2 size={12} className={hasMinLength ? "text-green-600" : "text-gray-300"} />
            <span>Pelo menos 8 caracteres</span>
          </div>
          <div className={`flex items-center gap-1 ${hasUpperCase ? "text-green-600" : "text-gray-500"}`}>
            <CheckCircle2 size={12} className={hasUpperCase ? "text-green-600" : "text-gray-300"} />
            <span>Uma letra maiúscula (A-Z)</span>
          </div>
          <div className={`flex items-center gap-1 ${hasLowerCase ? "text-green-600" : "text-gray-500"}`}>
            <CheckCircle2 size={12} className={hasLowerCase ? "text-green-600" : "text-gray-300"} />
            <span>Uma letra minúscula (a-z)</span>
          </div>
          <div className={`flex items-center gap-1 ${hasNumber ? "text-green-600" : "text-gray-500"}`}>
            <CheckCircle2 size={12} className={hasNumber ? "text-green-600" : "text-gray-300"} />
            <span>Um número (0-9)</span>
          </div>
        </div>
      )}

      {isConfirm && value && (
        <div className={`flex items-center gap-1 text-xs ${passwordsMatch ? "text-green-600" : "text-gray-500"}`}>
          <CheckCircle2 size={12} className={passwordsMatch ? "text-green-600" : "text-gray-300"} />
          <span>Senhas coincidem</span>
        </div>
      )}
    </div>
  );
}
