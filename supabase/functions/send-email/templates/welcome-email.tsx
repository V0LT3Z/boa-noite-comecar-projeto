
import React from "npm:react@18.2.0";
import EmailLayout from "./email-layout.tsx";

interface WelcomeEmailProps {
  name: string;
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => {
  return (
    <EmailLayout>
      <h2 style={{ color: "#333333", fontSize: "24px", fontWeight: "bold", margin: "0 0 20px 0" }}>
        Olá, {name}!
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Seja bem-vindo(a) ao Lovue Tickets! Estamos felizes em ter você conosco.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Com o Lovue Tickets, você pode:
      </p>
      <ul style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        <li>Descobrir os melhores eventos perto de você</li>
        <li>Comprar ingressos com segurança e rapidez</li>
        <li>Gerenciar todos os seus ingressos em um só lugar</li>
        <li>Revender seus ingressos quando não puder comparecer</li>
      </ul>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 25px 0" }}>
        Comece a explorar os eventos disponíveis agora mesmo!
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
                        Explorar Eventos
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
        Se precisar de ajuda, entre em contato com nossa equipe de suporte.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "15px 0 0 0" }}>
        Obrigado por escolher o Lovue Tickets!
      </p>
    </EmailLayout>
  );
};

export default WelcomeEmail;
