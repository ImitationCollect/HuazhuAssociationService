import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY, JWT_CONSTANTS, USER_LOGIN_TIME_KEY } from '@/constants';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
@Injectable()
export class JWTAccessTokenGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        @InjectRedis() private readonly redis: Redis
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
        const decode = this.jwtService.decode(token);

        if (isPublic) return true;

        // 退出登录
        if (request?.url?.includes('logout')) {
            if (!token) throw new BadRequestException('缺少用户信息');
            await this.redis.expire(USER_LOGIN_TIME_KEY(decode.userId), 0);
            return true;
        }

        if (!token) throw new UnauthorizedException('未登录或登录失效');

        try {
            // 使用登录使用确认token的实时性和唯一性
            const key = await this.redis.get(USER_LOGIN_TIME_KEY(decode.userId));
            const payload = await this.jwtService.verifyAsync(token, { secret: JWT_CONSTANTS.SECRET + key });
            // 用户信息发送给下一步
            request[REQUEST_USER_KEY] = payload;
        } catch (error) {
            throw new UnauthorizedException('未登录或登录失效');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        // HACK:web端传递数据: JWTBearer token
        const [_, token] = request.headers.authorization?.split(' ') ?? [];
        return token;
    }
}
