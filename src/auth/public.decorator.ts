import { SetMetadata, applyDecorators } from "@nestjs/common";

export function Public(): ClassDecorator & MethodDecorator {
  return applyDecorators(SetMetadata("isPublic", true));
}
