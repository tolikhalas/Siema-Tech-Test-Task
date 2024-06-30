// app.module.ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { SeedingModule } from "./seeding/seeding.module";
import typeormConfig from "./config/typeorm.config";
import { SeedingService } from "./seeding/seeding.service";
import { TenantsModule } from "./tenants/tenants.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "./config/logger.config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => typeormConfig,
    }),
    UsersModule,
    AuthModule,
    PermissionsModule,
    SeedingModule,
    TenantsModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  constructor(private readonly seedingService: SeedingService) {}

  async onModuleInit() {
    await this.seedingService.seedUsers();
    await this.seedingService.seedPermissions();
  }
}
