
import React from "npm:react@18.2.0";
import EmailLayout from "./email-layout.tsx";

interface RefundConfirmationEmailProps {
  name: string;
  eventName: string;
  refundAmount: number;
  refundDate: string;
}

const RefundConfirmationEmail: React.FC<RefundConfirmationEmailProps> = ({ 
  name, 
  eventName, 
  refundAmount, 
  refundDate 
}) => {
  return (
    <EmailLayout>
      <h2 style={{ color: "#333333", fontSize: "24px", fontWeight: "bold", margin: "0 0 20px 0" }}>
        Reembolso confirmado
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Olá, {name}!
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Confirmamos que o reembolso referente ao evento <strong>{eventName}</strong> foi processado com sucesso.
      </p>
      
      <div style={{ 
        backgroundColor: "#f9f9f9",
        border: "1px solid #eeeeee",
        borderRadius: "5px", 
        padding: "15px",
        marginBottom: "20px" 
      }}>
        <h3 style={{ 
          color: "#333333", 
          fontSize: "18px", 
          fontWeight: "bold", 
          margin: "0 0 10px 0" 
        }}>
          Detalhes do reembolso
        </h3>
        <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 5px 0" }}>
          <strong>Evento:</strong> {eventName}
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 5px 0" }}>
          <strong>Valor reembolsado:</strong> R$ {refundAmount.toFixed(2)}
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
          <strong>Data do processamento:</strong> {refundDate}
        </p>
      </div>
      
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        O valor reembolsado será creditado de volta ao seu método de pagamento original em até 7 dias úteis,
        dependendo da sua instituição financeira.
      </p>
      
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Caso tenha alguma dúvida sobre o reembolso, não hesite em entrar em contato com nossa
        equipe de suporte.
      </p>
      
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "25px 0 0 0" }}>
        Atenciosamente,<br />
        Equipe Lovue Tickets
      </p>
    </EmailLayout>
  );
};

export default RefundConfirmationEmail;
