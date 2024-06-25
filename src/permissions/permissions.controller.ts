import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { AssignPermissionsDto } from "./dto/assign-permissions.dto";

@Controller("users/:id/permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  assignPermissions(
    @Param("id") id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.permissionsService.assignUserPermissions(
      +id,
      assignPermissionsDto,
    );
  }

  @Get()
  getPermissions(@Param("id") id: string) {
    return this.permissionsService.getUserPermissions(+id);
  }

  @Patch()
  updatePermissions(
    @Param("id") id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.permissionsService.updateUserPermissions(
      +id,
      assignPermissionsDto,
    );
  }

  @Delete()
  findOne(
    @Param("id") id: string,
    @Body() assignPermisionsDto: AssignPermissionsDto,
  ) {
    return this.permissionsService.removeUserPermissions(
      +id,
      assignPermisionsDto,
    );
  }
}
