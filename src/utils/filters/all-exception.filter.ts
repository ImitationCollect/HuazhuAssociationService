import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { HttpStatus } from '@/constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const code = exception instanceof HttpException ? exception['response']['status'] || status : HttpStatus.INTERNAL_SERVER_ERROR;

        // 设置错误信息
        const message = exception['message'] ? exception['message'] : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
        const exceptionStr = exception ? `message:${message},stack:${exception['stack']}` : '';

        // 记录日志
        console.log('全局异常日志： %s %s %s error: %s', request.method, request.url, request.body, exceptionStr);

        // 发送响应
        response.status(status).json({
            code: code,
            timestamp: new Date().getTime(),
            message: message,
            method: request.method,
            path: request.url
        });
    }
}
