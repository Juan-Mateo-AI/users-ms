import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { NatsModule } from "./transports/nats.module";

@Module({
  imports: [UsersModule, NatsModule],
})
export class AppModule {}
