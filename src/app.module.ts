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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeormConfig,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    PermissionsModule,
    SeedingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly seedingService: SeedingService) {}

  async onModuleInit() {
    await this.seedingService.seedUsers();
    await this.seedingService.seedPermissions();
  }
}
