import { User } from "@prisma/client";

const userForgotPasswordEmailTemplate = (user: User, invitationLink: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Recupera tu contraseña</title>
    </head>
    <body
      style="
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      "
    >
      <table
        role="presentation"
        style="
          width: 100%;
          border-collapse: collapse;
          background-color: #ffffff;
          max-width: 600px;
          margin: 20px auto;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        "
      >
        <tr>
          <td
            style="
              padding: 20px;
              text-align: center;
              background-color: #007bff;
              color: #ffffff;
              font-size: 24px;
              font-weight: bold;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
            "
          >
            ¡Hola, <span style="text-transform: capitalize">${user.name}</span>!
          </td>
        </tr>
        <tr>
          <td
            style="
              padding: 20px;
              text-align: center;
              font-size: 18px;
              color: #333;
            "
          >
            Has solicitado restablecer tu contraseña. <br /><br />
            Haz clic en el botón a continuación para crear una nueva contraseña.
          </td>
        </tr>
        <tr>
          <td style="text-align: center; padding: 20px">
            <a
              href="${invitationLink}"
              style="
                display: inline-block;
                padding: 14px 28px;
                font-size: 18px;
                color: #ffffff;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
              "
            >
              Restablecer Contraseña
            </a>
          </td>
        </tr>
        <tr>
          <td
            style="
              padding: 20px;
              text-align: center;
              font-size: 16px;
              color: #555;
            "
          >
            Si no has solicitado este cambio, puedes ignorar este correo.
          </td>
        </tr>
        <!-- Firma -->
        <tr>
          <td
            style="
              text-align: center;
              padding: 10px;
              font-size: 14px;
              color: #777;
            "
          >
            Saludos,<br />
            <strong>El equipo de Chat AI</strong>
          </td>
        </tr>
        <tr>
          <td
            style="
              text-align: center;
              padding: 10px;
              font-size: 12px;
              color: #aaa;
            "
          >
            &copy; 2025 Chat AI. Todos los derechos reservados.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

export default userForgotPasswordEmailTemplate;
