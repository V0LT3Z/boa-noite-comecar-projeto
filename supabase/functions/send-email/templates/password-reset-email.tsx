
import React from "npm:react@18.2.0";
import EmailLayout from "./email-layout.tsx";

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({ name, resetLink }) => {
  return (
    <EmailLayout>
      <h2 style={{ color: "#333333", fontSize: "24px", fontWeight: "bold", margin: "0 0 20px 0" }}>
        Recuperação de senha
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Olá, {name}!
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Recebemos uma solicitação para redefinir a senha da sua conta no Lovue Tickets. 
        Para prosseguir, clique no botão abaixo:
      </p>
      
      <table role="presentation" border={0} cellPadding="0" cellSpacing="0" className="btn btn-primary" style={{
        width: "100%",
        borderCollapse: "separate",
        boxSizing: "border-box",
        marginBottom: "15px",
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
                      <a href={resetLink} target="_blank" style={{
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
                        Redefinir Senha
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0 0 15px 0" }}>
        Se você não solicitou a redefinição de senha, pode ignorar este e-mail com segurança. 
        Sua senha atual continuará funcionando.
      </p>
      
      <p style={{ fontSize: "14px", lineHeight: "1.6", margin: "15px 0 0 0", color: "#666666" }}>
        Por motivos de segurança, este link expirará em 24 horas.
      </p>
      
      <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "25px 0 0 0" }}>
        Atenciosamente,<br />
        Equipe Lovue Tickets
      </p>
    </EmailLayout>
  );
};

export default PasswordResetEmail;
