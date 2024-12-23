import { Module } from "@nestjs/common";
import { NatsModule } from "src/transports/nats.module";
import { UserRolesController } from "./userRoles.controller";
import { UserRolesService } from "./userRoles.service";

@Module({
  controllers: [UserRolesController],
  providers: [UserRolesService],
  imports: [NatsModule],
})
export class UserRolesModule {}
