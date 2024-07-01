import { Controller, Get, Param, Body, Post, Delete, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PhoneCodeDto, LoginDto, PhoneCodeLoginDto } from './dto/auth.dto';
import { AUTH_TYPE_ENUM } from '@/constants';
import { Public } from '@/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('send-phone-code')
    @ApiOperation({ summary: '获取手机验证码' })
    @Public()
    getPhoneCode(@Body() phoneCodeDto: PhoneCodeDto) {
        return this.authService.getPhoneCode(phoneCodeDto);
    }

    @Post('login')
    @ApiOperation({ summary: '手机验证码登录' })
    @Public()
    login(@Body() loginDto: LoginDto) {
        const { authType } = loginDto || {};

        switch (authType) {
            case AUTH_TYPE_ENUM.PHONE_CODE:
                return this.authService.phoneCodeLogin(loginDto);
            case AUTH_TYPE_ENUM.USERNAME_PWD:
                return this.authService.usernamePwdLogin(loginDto);
            default:
                return this.authService.usernamePwdLogin(loginDto);
        }
    }
}
