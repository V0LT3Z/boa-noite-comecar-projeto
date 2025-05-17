
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string | null;
  fullName: string;
  role?: 'user' | 'producer' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProducer: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<{success: boolean, requiresEmailConfirmation: boolean, error?: string}>;
  logout: () => void;
  openAuthModal: () => void;
  resendConfirmationEmail: (email: string) => Promise<boolean>;
  checkEmailExists: (email: string) => Promise<boolean>;
  checkCPFExists: (cpf: string) => Promise<boolean>;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  cpf?: string;
  birthDate?: string;
  role?: 'user' | 'producer' | 'admin';
}
