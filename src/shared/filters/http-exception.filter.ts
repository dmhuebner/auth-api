import { ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest();
    const res = context.getResponse();

    if (error.getStatus() === HttpStatus.UNAUTHORIZED) {
      if (typeof error !== 'string') {
        error.response['message'] = error.response.message || 'Unauthorized';
      }
    }

    res.status(error.getStatus()).json({
      statusCode: error.getStatus(),
      error: error.response.name || error.name,
      message: error.response.message || error.message,
      errors: error.response.errors || null,
      timestamp: new Date().toISOString(),
      path: req ? req.url : null
    });
  }
}