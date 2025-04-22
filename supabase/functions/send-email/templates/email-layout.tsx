
import React from "npm:react@18.2.0";

interface EmailLayoutProps {
  children: React.ReactNode;
}

const EmailLayout: React.FC<EmailLayoutProps> = ({ children }) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <style>
          {`
            @media only screen and (max-width: 620px) {
              table.body h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important;
              }
              
              table.body p,
              table.body ul,
              table.body ol,
              table.body td,
              table.body span,
              table.body a {
                font-size: 16px !important;
              }
              
              table.body .wrapper,
              table.body .article {
                padding: 10px !important;
              }
              
              table.body .content {
                padding: 0 !important;
              }
              
              table.body .container {
                padding: 0 !important;
                width: 100% !important;
              }
              
              table.body .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important;
              }
              
              table.body .btn table {
                width: 100% !important;
              }
              
              table.body .btn a {
                width: 100% !important;
              }
              
              table.body .img-responsive {
                height: auto !important;
                max-width: 100% !important;
                width: auto !important;
              }
            }
          
            @media all {
              .ExternalClass {
                width: 100%;
              }
              
              .ExternalClass,
              .ExternalClass p,
              .ExternalClass span,
              .ExternalClass font,
              .ExternalClass td,
              .ExternalClass div {
                line-height: 100%;
              }
              
              .apple-link a {
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                text-decoration: none !important;
              }
              
              #MessageViewBody a {
                color: inherit;
                text-decoration: none;
                font-size: inherit;
                font-family: inherit;
                font-weight: inherit;
                line-height: inherit;
              }
              
              .btn-primary table td:hover {
                background-color: #8B5CF6 !important;
              }
              
              .btn-primary a:hover {
                background-color: #8B5CF6 !important;
                border-color: #8B5CF6 !important;
              }
            }
          `}
        </style>
      </head>
      <body style={{
        backgroundColor: "#f6f6f6",
        fontFamily: "sans-serif",
        fontSize: "14px",
        lineHeight: "1.4",
        margin: 0,
        padding: 0,
        WebkitFontSmoothing: "antialiased",
        msTextSizeAdjust: "100%",
        WebkitTextSizeAdjust: "100%",
      }}>
        <table role="presentation" border={0} cellPadding="0" cellSpacing="0" className="body" style={{
          backgroundColor: "#f6f6f6",
          width: "100%",
        }}>
          <tr>
            <td>&nbsp;</td>
            <td className="container" style={{
              display: "block",
              margin: "0 auto",
              maxWidth: "580px",
              padding: "10px",
              width: "580px",
            }}>
              <div className="content" style={{
                boxSizing: "border-box",
                display: "block",
                margin: "0 auto",
                maxWidth: "580px",
                padding: "10px",
              }}>
                {/* START CENTERED WHITE CONTAINER */}
                <table role="presentation" className="main" style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "3px",
                  width: "100%",
                }}>
                  {/* START LOGO HEADER */}
                  <tr>
                    <td className="header" style={{
                      padding: "20px 0",
                      textAlign: "center",
                      backgroundColor: "#8B5CF6",
                      borderTopLeftRadius: "3px",
                      borderTopRightRadius: "3px",
                    }}>
                      <h1 style={{
                        color: "#ffffff",
                        fontSize: "32px",
                        fontWeight: "bold",
                        margin: 0,
                      }}>
                        Lovue Tickets
                      </h1>
                    </td>
                  </tr>
                  
                  {/* START MAIN CONTENT AREA */}
                  <tr>
                    <td className="wrapper" style={{
                      boxSizing: "border-box",
                      padding: "20px",
                    }}>
                      <table role="presentation" border={0} cellPadding="0" cellSpacing="0">
                        <tr>
                          <td>
                            {children}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                
                {/* START FOOTER */}
                <div className="footer" style={{
                  clear: "both",
                  marginTop: "10px",
                  textAlign: "center",
                  width: "100%",
                }}>
                  <table role="presentation" border={0} cellPadding="0" cellSpacing="0">
                    <tr>
                      <td className="content-block" style={{
                        color: "#999999",
                        fontSize: "12px",
                        textAlign: "center",
                        paddingBottom: "10px",
                        paddingTop: "10px",
                      }}>
                        <span className="apple-link" style={{color: "#999999", fontSize: "12px", textAlign: "center"}}>
                          © 2024 Lovue Tickets. Todos os direitos reservados.
                        </span>
                        <br />
                        <span style={{color: "#999999", fontSize: "12px", textAlign: "center"}}>
                          Esta mensagem é automática. Por favor, não responda a este e-mail.
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
  );
};

export default EmailLayout;
