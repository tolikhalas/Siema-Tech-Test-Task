import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { NotFoundFilter } from "src/filters/not-found.filter";

@UseFilters(NotFoundFilter)
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    console.log("Received body: ", createUserDto);
    return this.authService.register(createUserDto);
  }
}
