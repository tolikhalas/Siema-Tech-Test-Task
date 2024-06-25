import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TenantsService } from "./tenants.service";
import { TenantsController } from "./tenants.controller";
import { TenantsMiddleware } from "./tenants.middleware";

@Module({
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(TenantsController);
  }
}
