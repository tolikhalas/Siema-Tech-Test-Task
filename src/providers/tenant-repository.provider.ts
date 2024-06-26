import { Tenant } from "src/tenants/entities/tenant.entity";
import { DataSource } from "typeorm";

export const TenantRepositoryProvider = {
  provide: "TENANT_REPOSITORY",
  useFactory: (connection: DataSource) => {
    return connection.getRepository(Tenant);
  },
  inject: ["TENANT_CONNECTION"],
};
