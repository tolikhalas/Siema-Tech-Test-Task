import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseFilters,
} from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { NotFoundFilter } from "src/filters/not-found.filter";

@UseFilters(NotFoundFilter)
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.authService.login(user);
  }

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    console.log("Received body: ", createUserDto);
    return this.authService.register(createUserDto);
  }
}
