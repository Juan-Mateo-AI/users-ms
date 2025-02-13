import { HttpStatus, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class TokensService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("TokenService");

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Database connected");
  }

  async generateUserInviteToken(userId: string) {
    if (!userId) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: "userId cannot be null",
      });
    }

    return this.token.create({
      data: {
        type: "invitation",
        entityName: "user",
        entityId: userId,
      },
    });
  }

  async generateForgotPasswordToken(userId: string) {
    return this.token.create({
      data: {
        type: "forgotPassword",
        entityName: "user",
        entityId: userId,
      },
    });
  }

  async validateToken({ type, token }) {
    const tokenData = await this.token.findFirst({
      where: {
        identifier: token,
        type,
      },
    });

    if (!tokenData || tokenData.expiredAt < new Date()) {
      return false;
    }

    if (tokenData.type === "invitation") {
      const user = await this.user.findUnique({
        where: {
          id: tokenData.entityId,
          active: false,
          acceptedInvitation: false,
        },
      });

      if (!user) {
        return false;
      }
    }

    return true;
  }

  async expireTokenAndGetUser(token) {
    const tokenData = await this.token.findFirst({
      where: {
        identifier: token,
      },
    });

    if (!tokenData) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: "Token not found",
      });
    }

    await this.token.update({
      where: {
        id: tokenData.id,
      },
      data: {
        expiredAt: new Date(),
      },
    });

    return this.user.update({
      where: {
        id: tokenData.entityId,
      },
      data: {
        active: true,
        acceptedInvitation: true,
      },
      select: {
        email: true,
        name: true,
      },
    });
  }

  async expireForgotPasswordTokenAndGetUser(token) {
    const tokenData = await this.token.findFirst({
      where: {
        identifier: token,
        type: "forgotPassword",
      },
    });

    if (!tokenData) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: "Token not found",
      });
    }

    await this.token.update({
      where: {
        id: tokenData.id,
      },
      data: {
        expiredAt: new Date(),
      },
    });

    return this.user.findFirst({
      where: {
        id: tokenData.entityId,
      },
    });
  }
}
