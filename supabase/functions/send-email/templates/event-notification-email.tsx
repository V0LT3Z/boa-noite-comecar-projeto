
import React from "npm:react@18.2.0";
import EmailLayout from "./email-layout.tsx";

interface EventNotificationEmailProps {
  name: string;
  eventName: string;
  eventDate: string;
  notificationType: "reminder" | "change" | "cancellation";
  message?: string;
}

const EventNotificationEmail: React.FC<EventNotificationEmailProps> = ({ 
  name, 
  eventName, 
  eventDate, 
  notificationType,
  message 
}) => {
  // Definindo título e cores com base no tipo de notificação
  let title = "";
  let backgroundColor = "#f9f9f9";
  let borderColor = "#eeeeee";
  
  switch(notificationType) {
    case "reminder":
      title = `Lembrete: ${eventName} acontecerá em breve!`;
      backgroundColor = "#e6f7ff";
      borderColor = "#bae7ff";
      break;
    case "change":
      title = `Alteração no evento: ${eventName}`;
      backgroundColor = "#fff7e6";
      borderColor = "#ffe7ba";
      break;
    case "cancellation":
      title = `Cancelamento do evento: ${eventName}`;
      backgroundColor = "#fff1f0";
      borderColor = "#ffccc7";
      break;
  }

  return (
    <EmailLayout>
      <h2 style={{ color: "#333333", fontSize: "24px", fontWeight: "bold", margin: "0 0 20px 0" }}>
        {title}
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Olá, {name}!
      </p>
      
      <div style={{ 
        backgroundColor: backgroundColor, 
        borderLeft: `4px solid ${borderColor}`,
        padding: "15px",
        marginBottom: "20px" 
      }}>
        {notificationType === "reminder" && (
          <>
            <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 10px 0", fontWeight: "bold" }}>
              Seu evento está chegando!
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 5px 0" }}>
              <strong>Evento:</strong> {eventName}
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
              <strong>Data:</strong> {eventDate}
            </p>
            {message && (
              <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "10px 0 0 0" }}>
                {message}
              </p>
            )}
          </>
        )}
        
        {notificationType === "change" && (
          <>
            <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 10px 0", fontWeight: "bold" }}>
              Houve uma alteração importante no evento!
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 5px 0" }}>
              <strong>Evento:</strong> {eventName}
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 10px 0" }}>
              <strong>Nova data:</strong> {eventDate}
            </p>
            {message && (
              <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
                <strong>Detalhes da alteração:</strong> {message}
              </p>
            )}
          </>
        )}
        
        {notificationType === "cancellation" && (
          <>
            <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 10px 0", fontWeight: "bold" }}>
              Infelizmente, este evento foi cancelado.
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 5px 0" }}>
              <strong>Evento:</strong> {eventName}
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 10px 0" }}>
              <strong>Data original:</strong> {eventDate}
            </p>
            {message && (
              <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
                <strong>Motivo do cancelamento:</strong> {message}
              </p>
            )}
          </>
        )}
      </div>
      
      {notificationType !== "cancellation" && (
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
                        <a href={`https://lovuetickets.com/meus-ingressos`} target="_blank" style={{
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
      )}
      
      {notificationType === "cancellation" && (
        <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
          O valor do seu ingresso será automaticamente reembolsado conforme nossa política de cancelamento. 
          Você receberá um email de confirmação do reembolso em breve.
        </p>
      )}
      
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "25px 0 0 0" }}>
        Atenciosamente,<br />
        Equipe Lovue Tickets
      </p>
    </EmailLayout>
  );
};

export default EventNotificationEmail;
