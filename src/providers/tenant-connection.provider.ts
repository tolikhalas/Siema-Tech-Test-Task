import { REQUEST } from "@nestjs/core";
import { getDataSourceToken } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";
import typeormConfig from "src/config/typeorm.config";
import { InternalServerErrorException, Scope } from "@nestjs/common";

export const tenantConnectionProvider = {
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
    await connection.query(`
        SELECT 'CREATE DATABASE ${dbName}'
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${dbName}')\gexec`);
  } catch (error) {
    console.log(error);
  }
}
