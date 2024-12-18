import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { UpdateUserDto, UserToCreateDto } from "./dto";
import { NATS_SERVICE } from "src/config";
import { CurrentUser } from "./interfaces";
import { catchError } from "rxjs";

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
    const userRole = await this.userRole.findFirst({
      where: {
        id: userToCreate.userRoleId,
        OR: [{ companyId: userToCreate.companyId }, { companyId: null }],
      },
    });

    if (!userRole) {
      throw new RpcException({
        status: 400,
        message: "User role does not exists",
      });
    }

    const existingUser = await this.user.findUnique({
      where: { email: userToCreate.email },
    });

    if (existingUser) {
      throw new RpcException({
        status: 409,
        message: "Email address already in use",
      });
    }

    return this.user.create({
      data: userToCreate,
    });
  }

  async update(
    userId: string,
    currentUser: CurrentUser,
    userToUpdate: UpdateUserDto
  ) {
    const currentUserToUpdate = await this.user.findFirst({
      where: { id: userId },
    });

    if (!currentUserToUpdate) {
      throw new RpcException({
        status: 400,
        message: "User not found",
      });
    }

    const userRole = this.userRole.findFirst({
      where: { companyId: currentUser.companyId, id: userToUpdate.userRoleId },
    });

    if (!userRole) {
      throw new RpcException({
        status: 400,
        message: "Invalid User Role provided",
      });
    }

    if (
      currentUserToUpdate.id === currentUser.id ||
      (currentUserToUpdate.companyId === currentUser.company.id &&
        currentUser.userRole.isAdmin)
    ) {
      return this.user.update({
        where: { id: userId },
        data: { ...userToUpdate, companyId: undefined, email: undefined },
      });
    } else {
      throw new RpcException({
        status: 403,
        message: "Unauthorized",
      });
    }
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

  async findAllByCompanyId(companyId: string, page: number, pageSize: number) {
    if (!companyId) {
      throw new RpcException({
        status: 400,
        message: "companyId cannot be null",
      });
    }

    return this.user.findMany({
      where: { companyId },
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
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
}
