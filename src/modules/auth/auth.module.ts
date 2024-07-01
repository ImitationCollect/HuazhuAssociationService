import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWT_CONSTANTS } from '@/constants';
import { JWTAccessTokenGuard } from './guards/jwt-access-token.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: JWT_CONSTANTS.SECRET,
            signOptions: { expiresIn: JWT_CONSTANTS.EXPIRESIN }
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: JWTAccessTokenGuard
        }
    ]
})
export class AuthModule {}
