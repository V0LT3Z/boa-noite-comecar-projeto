
import { supabase } from "@/integrations/supabase/client";

// Tipos para os dados de email
interface EmailData {
  email: string;
  [key: string]: any;
}

// Tipo de email
export type EmailType = 
  | "welcome"
  | "purchase-confirmation"
  | "password-reset"
  | "event-notification"
  | "refund-confirmation"
  | "ticket-sale";

/**
 * Serviço para envio de emails
 */
export const EmailService = {
  /**
   * Envia um email através da edge function
   * @param type Tipo de email
   * @param data Dados para o template
   * @returns Resultado do envio
   */
  sendEmail: async (type: EmailType, data: EmailData) => {
    try {
      console.log(`Enviando email de tipo ${type} para ${data.email}`);
      
      const { data: result, error } = await supabase.functions.invoke("send-email", {
        body: {
          type,
          data
        }
      });
      
      if (error) {
        console.error("Erro ao enviar email:", error);
        throw new Error(`Falha ao enviar email: ${error.message}`);
      }
      
      console.log("Email enviado com sucesso:", result);
      return result;
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      throw new Error(`Falha ao enviar email: ${error}`);
    }
  },
  
  /**
   * Envia email de boas-vindas
   * @param email Email do destinatário
   * @param name Nome do destinatário
   */
  sendWelcomeEmail: (email: string, name: string) => {
    return EmailService.sendEmail("welcome", { email, name });
  },
  
  /**
   * Envia email de confirmação de compra
   * @param data Dados da compra
   */
  sendPurchaseConfirmation: (data: {
    email: string;
    name: string;
    eventName: string;
    eventDate: string;
    ticketInfo: Array<{name: string; quantity: number; price: number}>;
    orderNumber: string;
    total: number;
  }) => {
    return EmailService.sendEmail("purchase-confirmation", data);
  },
  
  /**
   * Envia email de recuperação de senha
   * @param email Email do destinatário
   * @param name Nome do destinatário
   * @param resetLink Link de recuperação de senha
   */
  sendPasswordReset: (email: string, name: string, resetLink: string) => {
    return EmailService.sendEmail("password-reset", { email, name, resetLink });
  },
  
  /**
   * Envia email de notificação sobre um evento
   * @param data Dados da notificação
   */
  sendEventNotification: (data: {
    email: string;
    name: string;
    eventName: string;
    eventDate: string;
    notificationType: "reminder" | "change" | "cancellation";
    message?: string;
  }) => {
    return EmailService.sendEmail("event-notification", data);
  },
  
  /**
   * Envia email de confirmação de reembolso
   * @param data Dados do reembolso
   */
  sendRefundConfirmation: (data: {
    email: string;
    name: string;
    eventName: string;
    refundAmount: number;
    refundDate: string;
  }) => {
    return EmailService.sendEmail("refund-confirmation", data);
  },
  
  /**
   * Envia email de notificação de venda de ingresso
   * @param data Dados da venda
   */
  sendTicketSale: (data: {
    email: string;
    name: string;
    eventName: string;
    buyerName: string;
    saleAmount: number;
    ticketType: string;
  }) => {
    return EmailService.sendEmail("ticket-sale", data);
  },
};
