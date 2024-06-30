import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TenantsService } from "./tenants.service";
import { TenantsController } from "./tenants.controller";
import { TenantsMiddleware } from "./tenants.middleware";
import { TenantRepositoryProvider } from "src/providers/tenant-repository.provider";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tenant } from "./entities/tenant.entity";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
    TypeOrmModule.forFeature([Tenant]),
  ],
  controllers: [TenantsController],
  providers: [
    TenantsService,
    TenantRepositoryProvider,
  ],
})
export class TenantsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(TenantsController);
  }
}
