
import { useAuth } from "@/contexts/AuthContext";
import RegisterForm from './register/RegisterForm';

const RegisterFormWithProvider = ({ onSuccess }: { onSuccess: () => void }) => (
  <div>
    <RegisterForm onSuccess={onSuccess} />
  </div>
);

export default RegisterFormWithProvider;
