import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Services from './modules/index.service';
import Controllers from './modules/index.controller';
import Modules from './modules/index.module';
import { RedisModule } from '@/common/modules/redis.module';

// 根据不同的环境加载相应的配置文件
let envFilePath = ['.env'];
switch (process.env.RUNNING_ENV) {
    case 'dev':
        envFilePath.unshift('.env.dev');
        break;
    case 'prod':
        envFilePath.unshift('.env.prod');
        break;
    default:
        envFilePath.unshift('.env');
}

@Module({
    imports: [
        ...Modules,
        CacheModule.register({ isGlobal: true }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath,
            validationSchema: Joi.object({
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.number().default(5432),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_DATABASE: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_TOKEN_AUDIENCE: Joi.string().required(),
                JWT_TOKEN_ISSUER: Joi.string().required(),
                JWT_ACCESS_TOKEN_TTL: Joi.number().default(3600)
            })
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                return {
                    type: 'mysql',
                    host: config.get('DB_HOST'),
                    port: config.get('DB_PORT'),
                    database: config.get('DB_DATABASE'),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD'),
                    logging: ['query', 'error'],
                    synchronize: true, // HACK:开启时更新Entity中的字段会清空数据库数据
                    autoLoadEntities: true
                };
            }
        }),
        RedisModule
    ],
    controllers: [AppController, ...Controllers],
    providers: [AppService, ...Services]
})
export class AppModule {}
