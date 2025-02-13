import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { envs } from "../../config";
import { User } from "@prisma/client";
import userInvitationEmailTemplate from "./templates/user-confirmation.template";
import userForgotPasswordEmailTemplate from "./templates/user-forgot-password-email.template";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendInvitationEmail(user: User, token: string) {
    const url = `${envs.webAppUrl}/invite-confirmation/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: `"Soporte Tecnico" <${envs.mailFrom}>`,
      subject: "Bienvenido a Chat AI! Confirma tu usuario",
      html: userInvitationEmailTemplate(user, url),
      context: {
        name: user.name,
        url,
      },
    });

    return {
      message: "Invitation email has been sent",
    };
  }

  async sendForgotPasswordEmail(user: User, token: string) {
    const url = `${envs.webAppUrl}/forgot-password/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: `"Soporte Tecnico" <${envs.mailFrom}>`,
      subject: "Recuperar contraseña",
      html: userForgotPasswordEmailTemplate(user, url),
      context: {
        name: user.name,
        url,
      },
    });

    return {
      message: "Forgot password email has been sent",
    };
  }
}
