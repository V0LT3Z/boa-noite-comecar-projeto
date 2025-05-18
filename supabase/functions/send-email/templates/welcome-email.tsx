
import React from "npm:react@18.2.0";
import EmailLayout from "./email-layout.tsx";

interface WelcomeEmailProps {
  name: string;
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => {
  return (
    <EmailLayout>
      <h2 style={{ color: "#333333", fontSize: "24px", fontWeight: "bold", margin: "0 0 20px 0" }}>
        Bem-vindo(a), {name}!
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Estamos muito felizes em ter você como parte da nossa comunidade! Sua conta foi criada com sucesso.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Com a sua conta, você pode:
      </p>
      <ul style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
        <li>Descobrir e comprar ingressos para os melhores eventos</li>
        <li>Guardar seus ingressos em um só lugar de forma segura</li>
        <li>Receber notificações sobre eventos do seu interesse</li>
        <li>Gerenciar todas as suas compras com facilidade</li>
      </ul>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 25px 0" }}>
        Aproveite ao máximo nossa plataforma e não perca nenhum evento especial!
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
                      <a href="https://lovuetickets.com" target="_blank" style={{
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
                        Explorar Eventos Agora
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
        Se tiver qualquer dúvida ou precisar de assistência, não hesite em entrar em contato com nossa equipe.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "15px 0 0 0" }}>
        Agradecemos por escolher a nossa plataforma!
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "15px 0 0 0", fontStyle: "italic" }}>
        Equipe Lovue Tickets
      </p>
    </EmailLayout>
  );
};

export default WelcomeEmail;
