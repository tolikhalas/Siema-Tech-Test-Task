import { Module } from "@nestjs/common";
import { SeedingService } from "./seeding.service";
import { PermissionsModule } from "src/permissions/permissions.module";

@Module({
  imports: [PermissionsModule],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}
