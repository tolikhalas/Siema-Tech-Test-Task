import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  NotFoundException,
} from "@nestjs/common";

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(404).json({
      statusCode: 404,
      message: exception.message,
    });
  }
}
