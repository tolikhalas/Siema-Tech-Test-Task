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
  @Patch()
  assignPermissions(
    @Param("id") id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.permissionsService.assignPermissions(+id, assignPermissionsDto);
  }

  @Get()
  getPermissions(@Param("id") id: string) {
    console.log("Get permissions");
    return this.permissionsService.getUserPermissions(+id);
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
