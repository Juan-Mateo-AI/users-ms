import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { envs } from "../../config";
import { User } from "@prisma/client";
import userInvitationEmailTemplate from "./templates/user-confirmation.template";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendInvitationEmail(user: User, token: string) {
    const url = `${envs.webAppUrl}/invite-confirmation/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: `"Support Team" <${envs.mailFrom}>`,
      subject: "Welcome to Chat AI! Confirm your user",
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
}
