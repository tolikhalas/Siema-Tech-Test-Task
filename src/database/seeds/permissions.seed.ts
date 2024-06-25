import { CreatePermissionDto } from "../../permissions/dto/create-permission.dto";

export const permissions: CreatePermissionDto[] = [
  { name: "CREATE_USER" },
  { name: "READ_USERS" },
  { name: "UPDATE_USER" },
  { name: "DELETE_USER" },
];
