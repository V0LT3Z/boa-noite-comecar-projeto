
import { registerSchema } from "./schema";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useRegisterForm from "./useRegisterForm";
import NameField from "./NameField";
import EmailField from "./EmailField";
import CPFField from "./CPFField";
import BirthDateField from "./BirthDateField";
import RoleSelector from "./RoleSelector";
import PasswordField from "./PasswordField";

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const {
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
  } = useRegisterForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <NameField 
        value={formData.name || ""}
        onChange={(value) => handleInputChange("name", value)}
        error={formErrors.name}
        isLoading={isLoading}
      />

      <EmailField
        value={formData.email || ""}
        onChange={(value) => handleInputChange("email", value)}
        error={formErrors.email}
        isLoading={isLoading}
        isCheckingEmail={isCheckingEmail}
        isEmailAvailable={isEmailAvailable}
      />

      <CPFField
        value={formData.cpf || ""}
        onChange={(value) => handleInputChange("cpf", value)}
        onValidate={validateCPFInput}
        error={formErrors.cpf}
        isLoading={isLoading}
        isCheckingCPF={isCheckingCPF}
        isCPFValid={isCPFValid}
        isCPFAvailable={isCPFAvailable}
      />

      <BirthDateField
        value={formData.birthDate || ""}
        onChange={(value) => handleInputChange("birthDate", value)}
        error={formErrors.birthDate}
        isLoading={isLoading}
      />

      <RoleSelector
        value={formData.role || 'user'}
        onChange={handleRoleChange}
        isLoading={isLoading}
      />

      <PasswordField
        value={formData.password || ""}
        onChange={(value) => handleInputChange("password", value)}
        error={formErrors.password}
        isLoading={isLoading}
      />

      <PasswordField
        value={formData.confirmPassword || ""}
        onChange={(value) => handleInputChange("confirmPassword", value)}
        confirmValue={formData.password}
        isConfirm={true}
        error={formErrors.confirmPassword}
        isLoading={isLoading}
      />

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
