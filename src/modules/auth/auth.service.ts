import { Injectable, BadRequestException, Inject, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { PhoneCodeService } from '@/common/services/phone-code.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { Utils } from '@/utils/utils';
import { JWT_CONSTANTS } from '@/constants';
import { validate } from '@/utils/validation/validate';
import { PhoneCodeLoginDto, UsernamePwdLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private readonly jwtService: JwtService
    ) {}

    async generateTokens(params) {
        const token = await this.signToken({ userId: params.userId, phoneNumber: params.phoneNumber, userName: params.userName });
        return { access_token: token };
    }

    /**
     * 生成jwt token
     * @param payload
     * @returns
     */
    private async signToken<T>(payload: any) {
        return this.jwtService.signAsync(
            {
                ...payload
            },
            {
                secret: JWT_CONSTANTS.SECRET,
                expiresIn: JWT_CONSTANTS.EXPIRESIN
            }
        );
    }

    /**
     * 模拟手机验证码发送
     * @param params
     * @returns
     */
    async getPhoneCode(params) {
        const { phoneNumber } = params || {};
        const find = await this.userRepository.findOne({ where: { phoneNumber } });

        if (!find) {
            throw new UnprocessableEntityException('您的手机号未注册');
        } else {
            const phoneCodeService = new PhoneCodeService();
            const code = await phoneCodeService.send(params.phoneNumber);
            // cacheManager v5 ，过期时间是1分钟，单位是毫秒
            await this.cacheManager.set(`${params.phoneNumber}-code`, code, 60000);
            return code;
        }
    }

    /**
     * 用户名密码登录
     * @param params
     */
    async usernamePwdLogin(params) {
        await validate(UsernamePwdLoginDto, params);

        const { phoneNumber } = params || {};
        const find = await this.userRepository.findOne({ where: { phoneNumber } });

        if (!find) throw new UnauthorizedException('您的手机号未注册');
    }

    /**
     * 手机号、验证码登录
     * @param params
     */
    async phoneCodeLogin(params) {
        await validate(PhoneCodeLoginDto, params);

        const { phoneNumber } = params || {};
        const code = await this.cacheManager.get(`${phoneNumber}-code`);
        const find = await this.userRepository.findOne({ where: { phoneNumber } });

        if (!find) throw new UnauthorizedException('您的手机号未注册');

        if (Utils.isNull(code)) {
            throw new BadRequestException('验证码已过期');
        } else if (code == params.code) {
            // 登录成功，返回token
            return this.generateTokens(find);
        } else {
            throw new BadRequestException('验证码错误');
        }
    }
}
