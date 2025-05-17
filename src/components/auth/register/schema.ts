
import { z } from "zod";
import { validateCPF, cpfRegex, isValidDateFormat } from "./validation";

export const registerSchema = z.object({
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

export type RegisterFormData = z.infer<typeof registerSchema>;
