import { Injectable } from "@nestjs/common";
import { permissions } from "src/database/seeds/permissions.seed";
import { PermissionsService } from "src/permissions/permissions.service";

@Injectable()
export class SeedingService {
  constructor(private readonly permissionService: PermissionsService) {}

  async seedPermissions() {
    for (const permission of permissions) {
      const existingPermission =
        await this.permissionService.findPermissionByName(permission.name);
      if (!existingPermission) {
        await this.permissionService.create(permission);
      }
    }
  }
}
