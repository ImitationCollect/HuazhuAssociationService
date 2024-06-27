import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/filters/all-exception.filter';
import { TransformInterceptor } from './utils/interceptor/transform.interceptor';
import { ValidationPipe, BadRequestException, HttpStatus, ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 9999;

    // 全局过滤器
    app.useGlobalFilters(new AllExceptionsFilter());
    // 全局拦截器
    app.useGlobalInterceptors(new TransformInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)));
    // 全局中间件 ValidationPipe校验参数
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            exceptionFactory: errors => {
                // 此处要注意，errors是一个对象数组，包含了当前所调接口里，所有验证失败的参数及错误信息。
                let msg = '';
                errors.forEach(item => {
                    msg = Object.values(item.constraints).join('/') + ` ${msg}`;
                });
                return new BadRequestException({
                    message: msg,
                    status: HttpStatus.BAD_REQUEST
                });
            }
        })
    );

    // 创建Swagger选项
    const options = new DocumentBuilder().setTitle('Example API').setDescription('The example API description').setVersion('1.0').addTag('example').build();
    // 创建Swagger文档
    const document = SwaggerModule.createDocument(app, options);
    // 设置`/api`路由为Swagger文档及其UI的主页
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT);
}
bootstrap();
