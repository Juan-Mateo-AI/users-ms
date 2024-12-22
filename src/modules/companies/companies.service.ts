import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { RpcException } from "@nestjs/microservices";
import { CurrentUser } from "./interfaces";
import { CompanyDto } from "./dto";

@Injectable()
export class CompaniesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("CompaniesService on UserMS");

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Database connected");
  }

  async update(
    companyId: string,
    currentUser: CurrentUser,
    company: CompanyDto
  ) {
    const currentCompanyToUpdate = await this.company.findFirst({
      where: { id: companyId },
    });

    if (!currentCompanyToUpdate) {
      throw new RpcException({
        status: 400,
        message: "Company not found",
      });
    }

    if (company.id === currentUser.company.id && currentUser.userRole.isAdmin) {
      return this.company.update({
        where: { id: companyId },
        data: {
          ...company,
          id: undefined,
          preferences: {
            update: {
              where: { id: company.preferences.id },
              data: { ...company.preferences, id: undefined },
            },
          },
        },
      });
    } else {
      throw new RpcException({
        status: 403,
        message: "Unauthorized",
      });
    }
  }

  async findOneById(id: string) {
    if (!id) {
      throw new RpcException({
        status: 400,
        message: "Id cannot be null",
      });
    }

    return this.company.findFirst({
      where: { id },
      include: {
        preferences: true,
      },
    });
  }
}
