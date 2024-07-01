import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { PHONE_REG, PASSWORD_REG } from '@/constants';

export class PhoneCodeDto {
    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    @IsString()
    @Matches(PHONE_REG, { message: 'phoneNumber格式错误' })
    phoneNumber: string;
}

export class LoginDto {
    @IsNotEmpty({ message: 'authType不能为空' })
    authType: number = 1; // 默认手机号 验证码登录
}

export class PhoneCodeLoginDto {
    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    @IsString()
    @Matches(PHONE_REG, { message: 'phoneNumber格式错误' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'code不能为空' })
    @IsNumber()
    code: number;
}

export class UsernamePwdLoginDto {
    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    @IsString()
    @Matches(PHONE_REG, { message: 'phoneNumber格式错误' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'password不能为空' })
    @IsString()
    @Matches(PASSWORD_REG, { message: 'password格式错误' })
    password: string;
}
