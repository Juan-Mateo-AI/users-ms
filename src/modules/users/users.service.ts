import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { UpdateUserDto, UserToCreateDto, InviteUserDto } from "./dto";
import { NATS_SERVICE } from "src/config";
import { CurrentUser } from "./interfaces";
import { MailService } from "../mail/mail.service";
import { TokensService } from "../tokens/tokens.service";

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("UsersService");

  constructor(
    private readonly mailService: MailService,
    private readonly tokenService: TokensService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
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
        status: HttpStatus.BAD_REQUEST,
        message: "User role does not exists",
      });
    }

    const existingUser = await this.user.findUnique({
      where: { email: userToCreate.email },
    });

    if (existingUser) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
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
        status: HttpStatus.BAD_REQUEST,
        message: "User not found",
      });
    }

    const userRole = this.userRole.findFirst({
      where: { companyId: currentUser.companyId, id: userToUpdate.userRoleId },
    });

    if (!userRole) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
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
        status: HttpStatus.FORBIDDEN,
        message: "Unauthorized",
      });
    }
  }

  async findOne(email: string) {
    if (!email) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
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
        status: HttpStatus.BAD_REQUEST,
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
        status: HttpStatus.BAD_REQUEST,
        message: "companyId cannot be null",
      });
    }

    const [users, count] = await Promise.all([
      this.user.findMany({
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
      }),
      this.user.count({
        where: { companyId },
      }),
    ]);

    return { users, count };
  }

  async deleteUser(companyId: string, userId: string) {
    if (!companyId) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: "companyId cannot be null",
      });
    }

    return this.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async inviteUser(currentUser: CurrentUser, userToInvite: InviteUserDto) {
    const existingUser = await this.user.findUnique({
      where: { email: userToInvite.email },
    });

    if (existingUser) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: "Email address already in use",
      });
    }

    const agentUserRole = await this.userRole.findFirst({
      where: {
        name: "Agent",
        companyId: null,
      },
    });

    const user = await this.user.create({
      data: {
        ...userToInvite,
        userRoleId: agentUserRole.id,
        companyId: currentUser.companyId,
        active: false,
      } as any,
    });

    const invitationToken = await this.tokenService.generateUserInviteToken(
      user.id
    );

    return this.mailService.sendInvitationEmail(
      user,
      invitationToken.identifier
    );
  }
}
