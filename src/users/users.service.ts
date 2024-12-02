import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { UpdateUserDto, UserToCreateDto } from "./dto";
import { NATS_SERVICE } from "src/config";

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("UsersService");

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Database connected");
  }

  async create(userToCreate: UserToCreateDto) {
    const userRole = this.userRole.findFirst({
      where: { companyId: userToCreate.companyId },
    });

    if (!userRole) {
      throw new RpcException({
        status: 400,
        message: "Invalid User Role provided",
      });
    }

    return this.user.create({
      data: userToCreate,
    });
  }

  async update(user: UpdateUserDto) {
    const userRole = this.userRole.findFirst({
      where: { companyId: userToCreate.companyId },
    });

    if (!userRole) {
      throw new RpcException({
        status: 400,
        message: "Invalid User Role provided",
      });
    }

    return this.user.create({
      data: userToCreate,
    });
  }
  async findOne(email: string) {
    if (!email) {
      throw new RpcException({
        status: 400,
        message: "Email cannot be null",
      });
    }

    return this.user.findFirst({
      where: { email },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        userRole: {
          select: {
            id: true,
            name: true,
            isAdmin: true,
          },
        },
      },
    });
  }

  async findOneById(id: string) {
    if (!id) {
      throw new RpcException({
        status: 400,
        message: "Id cannot be null",
      });
    }

    return this.user.findFirst({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        userRole: {
          select: {
            id: true,
            name: true,
            isAdmin: true,
          },
        },
      },
    });
  }
}
