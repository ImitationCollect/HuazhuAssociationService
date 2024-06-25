import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionStr = exception ? `message:${exception['message']},stack:${exception['stack']}` : '';

        // 设置错误信息
        const message = exception['message'] ? exception['message'] : `${status >= 500 ? 'Service Error' : 'Client Error'}`;

        // 记录日志
        console.log('全局异常日志： %s %s %s error: %s', request.method, request.url, request.body, exceptionStr);

        // 发送响应
        response.status(status).json({
            code: status,
            timestamp: new Date().getTime(),
            message: message,
            method: request.method,
            path: request.url
        });
    }
}
