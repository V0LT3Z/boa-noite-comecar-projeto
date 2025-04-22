
import React from "npm:react@18.2.0";
import EmailLayout from "./email-layout.tsx";

interface TicketSaleEmailProps {
  name: string;
  eventName: string;
  buyerName: string;
  saleAmount: number;
  ticketType: string;
}

const TicketSaleEmail: React.FC<TicketSaleEmailProps> = ({ 
  name, 
  eventName, 
  buyerName, 
  saleAmount, 
  ticketType 
}) => {
  return (
    <EmailLayout>
      <h2 style={{ color: "#333333", fontSize: "24px", fontWeight: "bold", margin: "0 0 20px 0" }}>
        Seu ingresso foi vendido!
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Olá, {name}!
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Temos boas notícias! Seu ingresso para o evento <strong>{eventName}</strong> foi vendido com sucesso no marketplace.
      </p>
      
      <div style={{ 
        backgroundColor: "#f0f7f0", 
        border: "1px solid #d4e8d4",
        borderRadius: "5px",
        padding: "15px",
        marginBottom: "20px" 
      }}>
        <h3 style={{ 
          color: "#2e7d32", 
          fontSize: "18px", 
          fontWeight: "bold", 
          margin: "0 0 10px 0" 
        }}>
          Detalhes da venda
        </h3>
        <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 5px 0" }}>
          <strong>Evento:</strong> {eventName}
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 5px 0" }}>
          <strong>Tipo de ingresso:</strong> {ticketType}
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 5px 0" }}>
          <strong>Comprador:</strong> {buyerName}
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0", fontWeight: "bold" }}>
          <strong>Valor da venda:</strong> R$ {saleAmount.toFixed(2)}
        </p>
      </div>
      
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        O valor da venda será transferido para sua conta conforme nossa política de pagamentos,
        descontadas as taxas aplicáveis.
      </p>
      
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Você pode verificar o status do pagamento e histórico de vendas na sua área de usuário.
      </p>
      
      <table role="presentation" border={0} cellPadding="0" cellSpacing="0" className="btn btn-primary" style={{
        width: "100%",
        borderCollapse: "separate",
        boxSizing: "border-box",
      }}>
        <tbody>
          <tr>
            <td align="center" style={{ padding: "0" }}>
              <table role="presentation" border={0} cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{
                      backgroundColor: "#9B87F5",
                      borderRadius: "5px",
                      textAlign: "center",
                    }}>
                      <a href="https://lovuetickets.com/minha-conta" target="_blank" style={{
                        backgroundColor: "#9B87F5",
                        border: "solid 1px #9B87F5",
                        borderRadius: "5px",
                        boxSizing: "border-box",
                        color: "#ffffff",
                        cursor: "pointer",
                        display: "inline-block",
                        fontSize: "16px",
                        fontWeight: "bold",
                        margin: "0",
                        padding: "12px 25px",
                        textDecoration: "none",
                        textTransform: "capitalize",
                      }}>
                        Ver Minha Conta
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "25px 0 0 0" }}>
        Obrigado por usar o Lovue Tickets!
      </p>
    </EmailLayout>
  );
};

export default TicketSaleEmail;
