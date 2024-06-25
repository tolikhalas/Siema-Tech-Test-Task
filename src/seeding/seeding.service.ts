import { Injectable } from "@nestjs/common";
import { permissions } from "src/database/seeds/permissions.seed";
import { users } from "src/database/seeds/users.seed";
import { PermissionsService } from "src/permissions/permissions.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SeedingService {
  constructor(
    private readonly usersService: UsersService,
    private readonly permissionService: PermissionsService,
  ) {}

  async seedUsers() {
    for (const user of users) {
      const existingUser = await this.usersService.findOneByEmail(user.email);
      if (!existingUser) {
        await this.usersService.create(user);
      }
    }
  }

  async seedPermissions() {
    for (const permission of permissions) {
      try {
        const existingPermission =
          await this.permissionService.findPermissionByName(permission.name);
        if (!existingPermission) {
          await this.permissionService.create(permission);
        }
      } catch (error) {}
    }
  }
}
