
import { FormEvent, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight, CheckCircle2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import FormattedInput from "@/components/FormattedInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

const validateCPF = (cpf: string) => {
  const numbers = cpf.replace(/[^\d]/g, "");
  
  if (numbers.length !== 11) return false;
  
  if (numbers.split("").every(char => char === numbers[0])) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(10))) return false;
  
  return true;
};

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve ter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve ter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve ter pelo menos um número"),
  confirmPassword: z.string(),
  cpf: z.string().regex(cpfRegex, "CPF inválido").refine(validateCPF, "CPF inválido"),
  birthDate: z.date({
    required_error: "Data de nascimento é obrigatória",
    invalid_type_error: "Data inválida",
  }).refine((date) => {
    const age = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    return age >= 18;
  }, "Você precisa ter pelo menos 18 anos"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    birthDate: undefined,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Password validation helpers
  const hasMinLength = useMemo(() => 
    (formData.password?.length || 0) >= 8, [formData.password]
  );
  
  const hasUpperCase = useMemo(() => 
    /[A-Z]/.test(formData.password || ""), [formData.password]
  );
  
  const hasLowerCase = useMemo(() => 
    /[a-z]/.test(formData.password || ""), [formData.password]
  );
  
  const hasNumber = useMemo(() => 
    /[0-9]/.test(formData.password || ""), [formData.password]
  );
  
  const passwordsMatch = useMemo(() => 
    !!formData.password && formData.password === formData.confirmPassword, 
    [formData.password, formData.confirmPassword]
  );

  const formatCPF = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string | Date) => {
    setFormData({ ...formData, [field]: value });
    
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = registerSchema.safeParse(formData);
      
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
        setIsLoading(false);
        return;
      }
      
      setFormErrors({});
      
      await register({
        fullName: formData.name || "",
        email: formData.email || "",
        password: formData.password || "",
        cpf: formData.cpf,
        birthDate: formData.birthDate?.toISOString(),
      });

      toast({
        title: "Conta criada com sucesso!",
        description: "Seja bem-vindo ao TicketHub.",
        variant: "success",
      });
      
      navigate("/minha-conta");
      onSuccess();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Nome completo"
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          disabled={isLoading}
          className={formErrors.name ? "border-destructive" : ""}
        />
        {formErrors.name && <p className="text-destructive text-sm">{formErrors.name}</p>}
      </div>

      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={isLoading}
          className={formErrors.email ? "border-destructive" : ""}
        />
        {formErrors.email && <p className="text-destructive text-sm">{formErrors.email}</p>}
      </div>

      <div className="space-y-2">
        <FormattedInput
          placeholder="CPF"
          value={formData.cpf || ""}
          onChange={(e) => handleInputChange("cpf", e.target.value)}
          disabled={isLoading}
          format={formatCPF}
          className={formErrors.cpf ? "border-destructive" : ""}
        />
        {formErrors.cpf && <p className="text-destructive text-sm">{formErrors.cpf}</p>}
      </div>

      <div className="space-y-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.birthDate && "text-muted-foreground",
                formErrors.birthDate && "border-destructive"
              )}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.birthDate ? (
                format(formData.birthDate, "dd/MM/yyyy")
              ) : (
                "Data de nascimento"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.birthDate}
              onSelect={(date) => handleInputChange("birthDate", date as Date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        {formErrors.birthDate && (
          <p className="text-destructive text-sm">{formErrors.birthDate}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={formData.password || ""}
            onChange={(e) => handleInputChange("password", e.target.value)}
            disabled={isLoading}
            className={formErrors.password ? "border-destructive pr-10" : "pr-10"}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {formErrors.password && <p className="text-destructive text-sm">{formErrors.password}</p>}
        
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
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar senha"
            value={formData.confirmPassword || ""}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            disabled={isLoading}
            className={formErrors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {formErrors.confirmPassword && <p className="text-destructive text-sm">{formErrors.confirmPassword}</p>}
        
        {formData.confirmPassword && (
          <div className={`flex items-center gap-1 text-xs ${passwordsMatch ? "text-green-600" : "text-gray-500"}`}>
            <CheckCircle2 size={12} className={passwordsMatch ? "text-green-600" : "text-gray-300"} />
            <span>Senhas coincidem</span>
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-primary hover:bg-gradient-primary-hover"
        disabled={isLoading}
      >
        {isLoading ? "Cadastrando..." : "Cadastrar"}
        <ArrowRight size={16} />
      </Button>

      <p className="text-sm text-center text-gray-600 mt-4">
        Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
      </p>
    </form>
  );
};

export default RegisterForm;
