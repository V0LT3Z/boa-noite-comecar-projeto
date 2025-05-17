import { FormEvent, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import FormattedInput from "@/components/FormattedInput";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

const validateCPF = (cpf: string) => {
  // Remove non-numeric characters
  const numbers = cpf.replace(/[^\d]/g, "");
  
  // Check if it has 11 digits
  if (numbers.length !== 11) return false;
  
  // Check if all digits are the same
  if (numbers.split("").every(char => char === numbers[0])) return false;
  
  // Validate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(9))) return false;
  
  // Validate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(10))) return false;
  
  return true;
};

const isValidDateFormat = (dateString: string) => {
  // Check the format first
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false;
  
  const [day, month, year] = dateString.split('/').map(Number);
  
  // Check if the date is valid
  const date = new Date(year, month - 1, day);
  return (
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year &&
    year >= 1900 && 
    year <= new Date().getFullYear()
  );
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
  cpf: z.string().regex(cpfRegex, "CPF inválido").refine(validateCPF, "CPF inválido ou inexistente"),
  birthDate: z.string().refine(isValidDateFormat, "Data inválida. Use o formato DD/MM/YYYY"),
  role: z.enum(['user', 'producer']).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const navigate = useNavigate();
  const { register, checkEmailExists, checkCPFExists } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    birthDate: "",
    role: "user",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isCPFValid, setIsCPFValid] = useState<boolean | null>(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingCPF, setIsCheckingCPF] = useState(false);
  const [isCPFAvailable, setIsCPFAvailable] = useState<boolean | null>(null);

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

  const formatDate = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  // Check if email already exists with debounce
  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email && formData.email.includes('@') && formData.email.includes('.')) {
        setIsCheckingEmail(true);
        const exists = await checkEmailExists(formData.email);
        setIsEmailAvailable(!exists);
        
        if (exists) {
          setFormErrors(prev => ({
            ...prev,
            email: "Este email já está cadastrado. Tente fazer login."
          }));
        } else {
          setFormErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.email;
            return newErrors;
          });
        }
        setIsCheckingEmail(false);
      }
    };
    
    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email, checkEmailExists]);

  // Add new effect for checking if CPF exists in database
  useEffect(() => {
    const checkCpf = async () => {
      // Only check if CPF is valid format (complete)
      if (formData.cpf && formData.cpf.length === 14 && validateCPF(formData.cpf)) {
        setIsCheckingCPF(true);
        const exists = await checkCPFExists(formData.cpf);
        setIsCPFAvailable(!exists);
        
        if (exists) {
          setFormErrors(prev => ({
            ...prev,
            cpf: "Este CPF já está cadastrado. Não é possível criar múltiplas contas com o mesmo CPF."
          }));
        } else {
          setFormErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.cpf;
            return newErrors;
          });
        }
        setIsCheckingCPF(false);
      }
    };
    
    const timeoutId = setTimeout(checkCpf, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.cpf, checkCPFExists]);

  const validateCPFInput = (value: string): boolean => {
    if (value.length === 14) {
      const isValid = validateCPF(value);
      setIsCPFValid(isValid);
      
      if (!isValid) {
        setFormErrors(prev => ({ ...prev, cpf: "CPF inválido ou inexistente" }));
        return false;
      } else {
        // Don't clear error here - let the checkCPFExists effect handle this
        // We just validate format here, not uniqueness
        return true;
      }
    } else {
      setIsCPFValid(null);
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cpf;
        return newErrors;
      });
      return false;
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    if (field !== "cpf" && field !== "email" && formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData({ 
      ...formData, 
      role: value as 'user' | 'producer' 
    });
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
      
      // Double check if email is available
      if (formData.email) {
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          setFormErrors({
            ...formErrors,
            email: "Este email já está cadastrado. Tente fazer login."
          });
          setIsLoading(false);
          return;
        }
      }
      
      // Double check if CPF exists
      if (formData.cpf) {
        const cpfExists = await checkCPFExists(formData.cpf);
        if (cpfExists) {
          setFormErrors({
            ...formErrors,
            cpf: "Este CPF já está cadastrado. Não é possível criar múltiplas contas com o mesmo CPF."
          });
          setIsLoading(false);
          return;
        }
      }
      
      setFormErrors({});
      
      const [day, month, year] = (formData.birthDate as string).split('/').map(Number);
      const birthDateISO = new Date(year, month - 1, day).toISOString();
      
      const registerResult = await register({
        fullName: formData.name || "",
        email: formData.email || "",
        password: formData.password || "",
        cpf: formData.cpf,
        birthDate: birthDateISO,
        role: formData.role,
      });

      // Always close the authentication modal on success
      if (registerResult.success) {
        if (registerResult.requiresEmailConfirmation) {
          // Email confirmation required
          toast({
            title: "Conta criada com sucesso!",
            description: "Por favor, verifique seu email e clique no link de confirmação para ativar sua conta.",
            variant: "success",
          });
          
          // Just close the modal, but don't navigate since they need to confirm email first
          onSuccess();
        } else {
          // Email already confirmed (rare case) - can navigate directly
          toast({
            title: "Conta criada com sucesso!",
            description: "Seja bem-vindo ao TicketHub.",
            variant: "success",
          });
          
          // Navigate to appropriate page
          if (formData.role === 'producer') {
            navigate("/admin");
          } else {
            navigate("/minha-conta");
          }
          
          onSuccess();
        }
      } else if (registerResult.error) {
        // Show error from register function
        toast({
          title: "Erro no cadastro",
          description: registerResult.error,
          variant: "destructive",
        });
      }
      // If registration failed, the AuthContext already shows the appropriate toast
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
        <div className="relative">
          <Input
            type="email"
            placeholder="Email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isLoading}
            className={formErrors.email ? "border-destructive pr-10" : "pr-10"}
          />
          {formData.email && formData.email.includes('@') && formData.email.includes('.') && (
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
        {formErrors.email && <p className="text-destructive text-sm">{formErrors.email}</p>}
      </div>

      <div className="space-y-2">
        <div className="relative">
          <FormattedInput
            placeholder="CPF"
            value={formData.cpf || ""}
            onChange={(value: string) => handleInputChange("cpf", value)}
            onValidate={validateCPFInput}
            disabled={isLoading}
            format={formatCPF}
            isValid={formErrors.cpf ? false : undefined}
            className={formErrors.cpf ? "border-destructive" : ""}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isCheckingCPF ? (
              <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isCPFValid === false ? (
              <XCircle size={18} className="text-destructive" />
            ) : isCPFAvailable === false ? (
              <XCircle size={18} className="text-destructive" />
            ) : isCPFAvailable === true && isCPFValid === true ? (
              <CheckCircle2 size={18} className="text-green-600" />
            ) : null}
          </div>
        </div>
        {formErrors.cpf && <p className="text-destructive text-sm">{formErrors.cpf}</p>}
      </div>

      <div className="space-y-2">
        <FormattedInput
          placeholder="Data de nascimento (DD/MM/AAAA)"
          value={formData.birthDate || ""}
          onChange={(value: string) => handleInputChange("birthDate", value)}
          disabled={isLoading}
          format={formatDate}
          className={formErrors.birthDate ? "border-destructive" : ""}
          maxLength={10}
        />
        {formErrors.birthDate && <p className="text-destructive text-sm">{formErrors.birthDate}</p>}
      </div>

      <div className="space-y-2">
        <Select 
          value={formData.role || 'user'}
          onValueChange={handleRoleChange}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo de conta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Usuário</SelectItem>
            <SelectItem value="producer">Produtor de Eventos</SelectItem>
          </SelectContent>
        </Select>
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
