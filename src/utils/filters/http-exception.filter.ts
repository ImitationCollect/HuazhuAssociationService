import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        // 设置错误信息
        const message = exception.message ? exception.message : `${status >= 500 ? 'Service Error' : 'Client Error'}`;

        // 记录日志
        console.log('全局 HttpException 异常日志： %s %s error: %s', request.method, request.url, exception.message);

        // 发送响应
        response.status(status).json({
            code: status,
            message: message,
            timestamp: new Date().getTime(),
            path: request.url
        });
    }
}
