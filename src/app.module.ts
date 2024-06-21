import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Services from './modules/services';
import Controllers from './modules/controllers';
import Modules from './modules/modules';

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
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath
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
                    logging: config.get('DB_LOGGING'),
                    synchronize: config.get('DB_SYNC'),
                    autoLoadEntities: true
                };
            }
        }),
        ...Modules
    ],
    controllers: [AppController, ...Controllers],
    providers: [AppService, ...Services]
})
export class AppModule {}
