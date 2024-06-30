import { REQUEST } from "@nestjs/core";
import { getDataSourceToken } from "@nestjs/typeorm";
import { Request } from "express";
import { DataSource } from "typeorm";
import { UserFilteredTenantRepository } from "./filtered-tenant.repository";
import { User } from "src/users/entities/user.entity";
import { InternalServerErrorException } from "@nestjs/common";

export const TenantRepositoryProvider = {
  provide: "TENANT_REPOSITORY",
  useFactory: (request: Request, connection: DataSource) => {
    const { user } = request;
    if (!user) {
      throw new InternalServerErrorException(
        "User not found in request. Ensure TenantMiddleware is applied.",
      );
    }
    return new UserFilteredTenantRepository(connection, user as User);
  },
  inject: [REQUEST, getDataSourceToken()],
};
