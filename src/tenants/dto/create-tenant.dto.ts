import { User } from "src/users/entities/user.entity";

export class CreateTenantDto {
  name: string;
  type: string;
  description?: string;
  user?: User;
}
