import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { NotFoundFilter } from "src/filters/not-found.filter";
import { AuthGuard } from "@nestjs/passport";

@UseFilters(NotFoundFilter)
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* 
    Email/Password Login
   */
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
    return this.authService.register(createUserDto);
  }

  /* 
    Google OAuth2
   */
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleLogin() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req, @Res() res) {
    const jwt = await this.authService.login(req.user);
    res.set("authorization", jwt.access_token);
    return res.json(req.user);
  }
}
