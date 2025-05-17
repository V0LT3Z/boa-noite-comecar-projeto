
import { AuthProvider } from "@/contexts/auth";
import RegisterForm from './register/RegisterForm';

const RegisterFormWithProvider = ({ onSuccess }: { onSuccess: () => void }) => (
  <AuthProvider>
    <RegisterForm onSuccess={onSuccess} />
  </AuthProvider>
);

export default RegisterFormWithProvider;
