import { Module } from "@nestjs/common";
import { UsersModule } from "./modules/users/users.module";
import { NatsModule } from "./transports/nats.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { UserRolesModule } from "./modules/userRoles/userRoles.module";

@Module({
  imports: [UsersModule, NatsModule, CompaniesModule, UserRolesModule],
})
export class AppModule {}
