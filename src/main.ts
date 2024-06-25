import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/filters/all-exception.filter';
import { HttpExceptionFilter } from './utils/filters/http-exception.filter';
import { TransformInterceptor } from './utils/interceptor/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 9999;

    // 全局过滤器
    app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());
    // 全局拦截器
    app.useGlobalInterceptors(new TransformInterceptor());

    // 创建Swagger选项
    const options = new DocumentBuilder().setTitle('Example API').setDescription('The example API description').setVersion('1.0').addTag('example').build();
    // 创建Swagger文档
    const document = SwaggerModule.createDocument(app, options);
    // 设置`/api`路由为Swagger文档及其UI的主页
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT);
}
bootstrap();
