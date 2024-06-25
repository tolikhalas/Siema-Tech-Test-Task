import { OmitType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";

export class UserResponse extends OmitType(User, [
  "password",
  "hashPassword",
] as const) {}
