import { Injectable, BadRequestException, Inject, UnprocessableEntityException, UnauthorizedException, HttpException } from '@nestjs/common';
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
import { HashingService } from '@/common/services/hashing.service';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { HttpStatus, USER_PHONE_CODE_KEY, USER_LOGIN_TIME_KEY } from '@/constants';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private readonly jwtService: JwtService,
        @InjectRedis() private readonly redis: Redis
    ) {}

    async generateTokens(params) {
        const loginTime = Utils.getTimeStamp(new Date());
        const token = await this.signToken({ userId: params.userId, phoneNumber: params.phoneNumber, userName: params.userName, loginTime });
        await this.redis.set(USER_LOGIN_TIME_KEY(params.userId), loginTime, 'EX', JWT_CONSTANTS.EXPIRESIN_NUMBER);
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
                secret: JWT_CONSTANTS.SECRET + payload.loginTime,
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
            // redis过期时间是1分钟，单位是秒
            await this.redis.set(USER_PHONE_CODE_KEY(find.userId), code, 'EX', 60);
            return code;
        }
    }

    /**
     * 用户名密码登录
     * @param params
     */
    async usernamePwdLogin(params) {
        await validate(UsernamePwdLoginDto, params);

        const { phoneNumber, password } = params || {};
        const find = await this.userRepository.findOne({ where: { phoneNumber } });

        if (!find) throw new UnauthorizedException('您的手机号未注册');

        const hashingService = new HashingService();
        const isEqual = hashingService.compare(password, find.password);
        if (!isEqual) {
            throw new UnauthorizedException('密码错误');
        }

        return this.generateTokens(find);
    }

    /**
     * 手机号、验证码登录
     * @param params
     */
    async phoneCodeLogin(params) {
        await validate(PhoneCodeLoginDto, params);

        const { phoneNumber } = params || {};
        const find = await this.userRepository.findOne({ where: { phoneNumber } });
        const code = await this.redis.get(USER_PHONE_CODE_KEY(find.userId));
        const isExists = await this.redis.exists(USER_PHONE_CODE_KEY(find.userId));

        if (!find) throw new UnauthorizedException('您的手机号未注册');

        // if (!isExists) throw new HttpException({ status: HttpStatus.NO_PHONE_CODE_SENT, message: '未发送验证码' }, 200, {});

        if (!isExists || Utils.isNull(code)) {
            throw new BadRequestException('未发送验证码或验证码已过期');
        } else if (code == params.code) {
            // 登录成功，返回token
            return this.generateTokens(find);
        } else {
            throw new BadRequestException('验证码错误');
        }
    }

    /**退出登录
     *
     * @param params
     */
    async logout(params) {
        return;
    }
}
