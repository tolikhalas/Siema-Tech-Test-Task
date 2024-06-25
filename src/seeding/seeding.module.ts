import { Module } from "@nestjs/common";
import { SeedingService } from "./seeding.service";
import { PermissionsModule } from "src/permissions/permissions.module";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule, PermissionsModule],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}
