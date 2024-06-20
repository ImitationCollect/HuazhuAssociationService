import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Services from './modules/services';
import Controllers from './modules/controllers';

@Module({
    imports: [],
    controllers: [AppController, ...Controllers],
    providers: [AppService, ...Services]
})
export class AppModule {}
