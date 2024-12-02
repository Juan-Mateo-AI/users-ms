import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { NatsModule } from "src/transports/nats.module";
import { UserRoleService } from "./userRole.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRoleService],
  imports: [NatsModule],
})
export class UsersModule {}
