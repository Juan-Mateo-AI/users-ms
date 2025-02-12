import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { join } from "path";
import { envs } from "../../config/envs";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: envs.mailHost,
        secure: false,
        auth: {
          user: envs.mailFrom,
          pass: envs.mailPassword,
        },
      },
      defaults: {
        from: `"No Reply" <${envs.mailFrom}>`,
      },
      template: {
        dir: join(__dirname, "templates"),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
