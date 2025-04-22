
import React from "npm:react@18.2.0";
import EmailLayout from "./email-layout.tsx";

interface TicketInfo {
  name: string;
  quantity: number;
  price: number;
}

interface PurchaseConfirmationEmailProps {
  name: string;
  eventName: string;
  eventDate: string;
  ticketInfo: TicketInfo[];
  orderNumber: string;
  total: number;
}

const PurchaseConfirmationEmail: React.FC<PurchaseConfirmationEmailProps> = ({ 
  name, 
  eventName, 
  eventDate, 
  ticketInfo,
  orderNumber,
  total
}) => {
  return (
    <EmailLayout>
      <h2 style={{ color: "#333333", fontSize: "24px", fontWeight: "bold", margin: "0 0 20px 0" }}>
        Compra confirmada!
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Olá, {name}!
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Sua compra foi confirmada com sucesso. Abaixo estão os detalhes do seu pedido:
      </p>
      
      <div style={{ 
        backgroundColor: "#f9f9f9", 
        padding: "15px",
        borderRadius: "5px",
        marginBottom: "20px" 
      }}>
        <h3 style={{ 
          color: "#333333", 
          fontSize: "18px", 
          fontWeight: "bold", 
          margin: "0 0 10px 0" 
        }}>
          {eventName}
        </h3>
        <p style={{ fontSize: "16px", lineHeight: "1.4", margin: "0 0 5px 0" }}>
          <strong>Data:</strong> {eventDate}
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.4", margin: "0 0 15px 0" }}>
          <strong>Número do pedido:</strong> {orderNumber}
        </p>
        
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ 
                textAlign: "left", 
                padding: "8px 5px", 
                borderBottom: "1px solid #ddd" 
              }}>
                Ingresso
              </th>
              <th style={{ 
                textAlign: "center", 
                padding: "8px 5px", 
                borderBottom: "1px solid #ddd" 
              }}>
                Qtd
              </th>
              <th style={{ 
                textAlign: "right", 
                padding: "8px 5px", 
                borderBottom: "1px solid #ddd" 
              }}>
                Preço
              </th>
            </tr>
          </thead>
          <tbody>
            {ticketInfo.map((ticket, index) => (
              <tr key={index}>
                <td style={{ 
                  textAlign: "left", 
                  padding: "8px 5px", 
                  borderBottom: "1px solid #ddd" 
                }}>
                  {ticket.name}
                </td>
                <td style={{ 
                  textAlign: "center", 
                  padding: "8px 5px", 
                  borderBottom: "1px solid #ddd" 
                }}>
                  {ticket.quantity}
                </td>
                <td style={{ 
                  textAlign: "right", 
                  padding: "8px 5px", 
                  borderBottom: "1px solid #ddd" 
                }}>
                  R$ {ticket.price.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} style={{ 
                textAlign: "right", 
                padding: "12px 5px", 
                fontWeight: "bold" 
              }}>
                Total:
              </td>
              <td style={{ 
                textAlign: "right", 
                padding: "12px 5px", 
                fontWeight: "bold" 
              }}>
                R$ {total.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Seus ingressos estão anexados a este email e também podem ser acessados através da sua conta.
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
                      <a href="https://lovuetickets.com/meus-ingressos" target="_blank" style={{
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
                        Ver Meus Ingressos
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
        Obrigado pela sua compra!
      </p>
    </EmailLayout>
  );
};

export default PurchaseConfirmationEmail;
