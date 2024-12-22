import { Module } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CompaniesController } from "./companies.controller";
import { NatsModule } from "src/transports/nats.module";

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [NatsModule],
})
export class CompaniesModule {}
