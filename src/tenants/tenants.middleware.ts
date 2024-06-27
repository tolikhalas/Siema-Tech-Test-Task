import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class TenantsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers["x-tenant-id"]?.toString();
    if (!tenantId) {
      throw new BadRequestException("X-TENANT-ID not provided");
    }
    console.log(tenantId);
    req["tenantId"] = tenantId;
    next();
  }
}
