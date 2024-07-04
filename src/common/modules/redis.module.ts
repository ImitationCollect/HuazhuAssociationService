import { Global, Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';

@Global()
@Module({
    imports: [
        NestRedisModule.forRoot({
            type: 'single',
            // url: string,
            options: {
                host: 'localhost', // Redis 服务器地址
                port: 6379 // Redis 端口
                // password: 'your_password', // 如果有设置密码的话
                // db: 0
            }
        })
    ],
    providers: [],
    exports: []
})
export class RedisModule {}
