import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class TenantsMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const payload = this.jwtService.verify(token);
        const user = await this.usersService.findOne(payload.sub);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        throw new BadRequestException(`Invalid token: ${error.message}`);
      }
    }
    next();
  }
}
