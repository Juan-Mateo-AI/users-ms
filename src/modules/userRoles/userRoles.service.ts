import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { CreateUserRoleDto } from "./dto";
import { NATS_SERVICE } from "src/config";
import { UpdateUserDto } from "../users/dto";
import { SUPER_ADMIN_ROLE } from "../../constants/default-user-roles";

@Injectable()
export class UserRolesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("UserRoles Service");

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Database connected");
  }

  async create(userRole: CreateUserRoleDto) {
    return this.userRole.create({
      data: userRole,
    });
  }

  async update(userRoleId: string, userRole: UpdateUserDto) {
    const currentUserRoleToUpdate = await this.userRole.findFirst({
      where: { id: userRoleId },
    });

    if (!currentUserRoleToUpdate) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    if (!currentUserRoleToUpdate.companyId) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: "You cannot update a default custom role",
      });
    }

    return this.userRole.update({
      where: { id: userRoleId },
      data: userRole,
    });
  }

  async find(id: string) {
    if (!id) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: "UserRoleId cannot be null",
      });
    }

    return this.userRole.findFirst({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(companyId: string, page: number, pageSize: number) {
    if (!companyId) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: "CompanyId cannot be null",
      });
    }

    return this.userRole.findMany({
      where: {
        OR: [{ companyId }, { companyId: null }],
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async delete(companyId: string, userRoleId: string) {
    if (!companyId) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: "companyId cannot be null",
      });
    }

    const userRole = await this.userRole.findFirst({
      where: { id: userRoleId },
    });

    if (!userRole) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: "UserRole does not exists",
      });
    }

    if (!userRole.companyId) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: "Default UserRole cannot be deleted",
      });
    }

    const userRoleToReplaceWith = await this.userRole.findFirst({
      where: {
        isAdmin: userRole.isAdmin,
        companyId: null,
        name: { not: SUPER_ADMIN_ROLE },
      },
    });

    await this.user.updateMany({
      where: { userRoleId },
      data: { userRoleId: userRoleToReplaceWith.id },
    });

    return this.userRole.delete({
      where: {
        id: userRole.id,
      },
    });
  }
}
