
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { RegisterFormData } from "./schema";
import { validateCPF } from "./validation";

export default function useRegisterForm(onSuccess: () => void) {
  const navigate = useNavigate();
  const { register, checkEmailExists, checkCPFExists } = useAuth();
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

  // Efeito para verificar se o CPF existe no banco de dados
  useEffect(() => {
    const checkCpf = async () => {
      // Verificar apenas se o CPF tem um formato válido e completo
      if (formData.cpf && formData.cpf.length === 14 && validateCPF(formData.cpf)) {
        setIsCheckingCPF(true);
        try {
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
              // Só remover o erro se for relacionado ao CPF existente
              // Mantemos outros erros de CPF inválido se existirem
              if (prev.cpf && prev.cpf.includes("já está cadastrado")) {
                delete newErrors.cpf;
              }
              return newErrors;
            });
          }
        } catch (error) {
          console.error("Erro ao verificar CPF:", error);
        } finally {
          setIsCheckingCPF(false);
        }
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
        // Não limpar os erros aqui, apenas os relacionados à validação do formato
        // O erro de CPF já cadastrado será gerenciado pelo useEffect acima
        setFormErrors(prev => {
          const newErrors = { ...prev };
          if (prev.cpf && prev.cpf === "CPF inválido ou inexistente") {
            delete newErrors.cpf;
          }
          return newErrors;
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Verificar explicitamente se o CPF já está cadastrado antes de prosseguir
      if (formData.cpf && formData.cpf.length === 14) {
        const cpfExists = await checkCPFExists(formData.cpf);
        if (cpfExists) {
          setFormErrors(prev => ({
            ...prev,
            cpf: "Este CPF já está cadastrado. Não é possível criar múltiplas contas com o mesmo CPF."
          }));
          setIsLoading(false);
          return;
        }
      }
      
      // Verificar se há erros no formulário antes de enviar
      if (Object.keys(formErrors).length > 0) {
        console.log("Formulário contém erros:", formErrors);
        setIsLoading(false);
        return;
      }
      
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

      if (registerResult.success) {
        if (registerResult.requiresEmailConfirmation) {
          toast({
            title: "Conta criada com sucesso!",
            description: "Por favor, verifique seu email e clique no link de confirmação para ativar sua conta.",
            variant: "success",
          });
          onSuccess();
        } else {
          toast({
            title: "Conta criada com sucesso!",
            description: "Seja bem-vindo ao TicketHub.",
            variant: "success",
          });
          
          if (formData.role === 'producer') {
            navigate("/admin");
          } else {
            navigate("/minha-conta");
          }
          
          onSuccess();
        }
      } else if (registerResult.error) {
        toast({
          title: "Erro no cadastro",
          description: registerResult.error,
          variant: "destructive",
        });
      }
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

  return {
    formData,
    formErrors,
    isLoading,
    isCheckingEmail,
    isCheckingCPF,
    isEmailAvailable,
    isCPFValid,
    isCPFAvailable,
    handleInputChange,
    handleRoleChange,
    handleSubmit,
    validateCPFInput,
  };
}
