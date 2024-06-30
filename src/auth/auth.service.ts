import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UserResponse } from "src/users/dto/user-response.dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { plainToClass } from "class-transformer";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/entities/user.entity";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return plainToClass(UserResponse, user, {
        excludeExtraneousValues: true,
      });
    }
    return null;
  }

  async register(createUserDto: CreateUserDto): Promise<UserResponse> {
    this.logger.log(`Registering user with email: ${createUserDto.email}`);
    return await this.usersService.create(createUserDto);
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    this.logger.log(`User ${user.email} logged in`);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
