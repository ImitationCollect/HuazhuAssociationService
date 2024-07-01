import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from '@/constants';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';

@Injectable()
export class JWTAccessTokenGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

        if (isPublic) return true;

        if (!token) throw new UnauthorizedException('未登录或登录失效');

        try {
            const payload = await this.jwtService.verifyAsync(token);
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
