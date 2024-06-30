import { REQUEST } from "@nestjs/core";
import { getDataSourceToken } from "@nestjs/typeorm";
import { Request } from "express";
import { DataSource } from "typeorm";
import { UserFilteredTenantRepository } from "./filtered-tenant.repository";
import { User } from "src/users/entities/user.entity";
import { InternalServerErrorException } from "@nestjs/common";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

export const TenantRepositoryProvider = {
  provide: "TENANT_REPOSITORY",
  useFactory: (request: Request, connection: DataSource, logger: Logger) => {
    const { user } = request;
    if (!user) {
      logger.error(
        "User not found in request. Ensure TenantMiddleware is applied.",
      );
      throw new InternalServerErrorException(
        "User not found in request. Ensure TenantMiddleware is applied.",
      );
    }
    return new UserFilteredTenantRepository(connection, user as User);
  },
  inject: [REQUEST, getDataSourceToken(), WINSTON_MODULE_PROVIDER],
};
