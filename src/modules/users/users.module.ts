import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { NatsModule } from "src/transports/nats.module";
import { UserRoleService } from "./userRole.service";
import { MailModule } from "../mail/mail.module";
import { TokensModule } from "../tokens/tokens.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRoleService],
  imports: [NatsModule, MailModule, TokensModule],
})
export class UsersModule {}
