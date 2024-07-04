import { IsNotEmpty, IsNumber, IsString, Matches, isNumber } from 'class-validator';
import { PHONE_REG, PASSWORD_REG } from '@/constants';

export class PhoneCodeDto {
    @Matches(PHONE_REG, { message: 'phoneNumber格式错误' })
    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    phoneNumber: string;
}

export class LoginDto {
    @IsNotEmpty({ message: 'authType不能为空' })
    authType: number = 1; // 默认手机号 验证码登录
}

export class LogoutDto {}

export class PhoneCodeLoginDto {
    @Matches(PHONE_REG, { message: 'phoneNumber格式错误' })
    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    phoneNumber: string;

    @IsNumber()
    @IsNotEmpty({ message: 'code不能为空' })
    code: number;
}

export class UsernamePwdLoginDto {
    @Matches(PHONE_REG, { message: 'phoneNumber格式错误' })
    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    phoneNumber: string;

    @Matches(PASSWORD_REG, { message: 'password格式错误' })
    @IsNotEmpty({ message: 'password不能为空' })
    password: string;
}
