import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { UpdateUserDto, UserToCreateDto } from "./dto";
import { NATS_SERVICE } from "src/config";

@Injectable()
export class UserRoleService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("UserRoleService");

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Database connected");
  }
  async findOne(id: string) {
    if (!id) {
      throw new RpcException({
        status: 400,
        message: "Id cannot be null",
      });
    }

    return this.userRole.findFirst({
      where: { id },
    });
  }
}
