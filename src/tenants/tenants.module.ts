import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TenantsService } from "./tenants.service";
import { TenantsController } from "./tenants.controller";
import { TenantsMiddleware } from "./tenants.middleware";
import { TenantConnectionProvider } from "src/providers/tenant-connection.provider";

@Module({
  controllers: [TenantsController],
  providers: [TenantsService, TenantConnectionProvider],
})
export class TenantsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(TenantsController);
  }
}
