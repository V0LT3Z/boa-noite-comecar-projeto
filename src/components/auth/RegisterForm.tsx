
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

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
}).refine(data => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Password validation states
  const hasMinLength = formData.password && formData.password.length >= 8;
  const hasUpperCase = formData.password && /[A-Z]/.test(formData.password);
  const hasLowerCase = formData.password && /[a-z]/.test(formData.password);
  const hasNumber = formData.password && /[0-9]/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

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
      
      // In a real app, this would call a supabase/firebase method
      await signUp(formData.email || "", formData.password || "", formData.name || "");

      // In a real app, the navigation would happen after email confirmation
      toast({
        title: "Conta criada com sucesso!",
        description: "Seja bem-vindo ao TicketHub.",
        variant: "success",
      });
      
      navigate("/minha-conta");
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

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing again
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
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
        
        {/* Password requirements */}
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
        
        {/* Password match indicator */}
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
