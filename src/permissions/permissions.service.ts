import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Permission } from "./entities/permission.entity";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { AssignPermissionsDto } from "./dto/assign-permissions.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly usersService: UsersService,
  ) {}

  /* 
    CRUD Permissions methods
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }
    return permission;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);
    Object.assign(permission, updatePermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
  }

  /* 
    Helper methods
   */
  async findPermissionByName(name: string) {
    const permission = await this.permissionRepository.findOne({
      where: { name: name },
    });
    if (!permission) {
      throw new NotFoundException(`There is no permission ${name}`);
    }
    return permission;
  }

  /* 
    Per User Permissions' methods
   */

  async assignPermissions(
    userId: number,
    assignPermissionsDto: AssignPermissionsDto,
  ): Promise<Permission[]> {
    const user = await this.usersService.findOne(userId);
    const permissionsToAssign = await Promise.all(
      assignPermissionsDto.permissionIds.map((id) => this.findOne(id)),
    );

    user.permissions = [
      ...user.permissions,
      ...permissionsToAssign.filter(
        (permission) => !user.permissions.some((p) => p.id === permission.id),
      ),
    ];

    await this.usersService.update(userId, user);
    return user.permissions;
  }

  async getUserPermissions(userId: number): Promise<Permission[]> {
    const user = await this.usersService.findOne(userId);
    return user.permissions;
  }

  async removeUserPermissions(
    userId: number,
    assignPermissionsDto: AssignPermissionsDto,
  ): Promise<Permission[]> {
    const user = await this.usersService.findOne(userId);
    const permissionsToRemove = await Promise.all(
      assignPermissionsDto.permissionIds.map((id) => this.findOne(id)),
    );

    user.permissions = user.permissions.filter(
      (permission) => !permissionsToRemove.some((p) => p.id === permission.id),
    );

    await this.usersService.update(userId, user);
    return user.permissions;
  }
}
