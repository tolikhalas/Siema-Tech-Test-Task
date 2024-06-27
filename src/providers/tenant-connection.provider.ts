import { REQUEST } from "@nestjs/core";
import { getDataSourceToken } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";
import typeormConfig from "src/config/typeorm.config";
import { InternalServerErrorException, Scope } from "@nestjs/common";
import { Tenant } from "src/tenants/entities/tenant.entity";

export const TenantConnectionProvider = {
  provide: "TENANT_CONNECTION",
  useFactory: async (request, connection: DataSource) => {
    const databaseName = `tenant_${request.tenantId}`;

    await createDatabase(databaseName, connection);

    try {
      if (!request.tenantId) {
        throw new InternalServerErrorException(
          "Make sure to apply tenantsMiddleware",
        );
      }

      const options = {
        ...typeormConfig,
        database: databaseName,
        entities: [Tenant],
      } as DataSourceOptions;

      const dataSource = new DataSource(options);
      return dataSource.initialize();
    } catch (error) {
      console.log(error);
    }
  },
  inject: [REQUEST, getDataSourceToken()],
  scope: Scope.REQUEST,
};

async function createDatabase(dbName: string, connection: DataSource) {
  try {
    const dbExists = await connection.query(
      `
      SELECT 1 FROM pg_database WHERE datname = $1
    `,
      [dbName],
    );

    if (dbExists.length === 0) {
      await connection.query(`CREATE DATABASE "${dbName}"`);
    }
  } catch (error) {
    console.log(error);
  }
}
