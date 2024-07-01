import { IsNotEmpty, IsNumber, IsString, Matches, isNotEmpty } from 'class-validator';
import { Utils } from '@/utils/utils';
import { PHONE_REG, ID_CARD_REG18, PASSWORD_REG, AUTH_TYPE_ENUM } from '@/constants';
import { BaseQueryDto } from '@/common/dtos/base-query.dto';

export class CreateUserDto {
    @IsNotEmpty({ message: 'authType不能为空' })
    authType: number = AUTH_TYPE_ENUM.USERNAME_PWD;
}
export class PhoneCodeRegisterDto extends CreateUserDto {
    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    @IsString()
    @Matches(PHONE_REG, { message: 'phoneNumber格式错误' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'code不能为空' })
    @IsNumber()
    code: number;
}

export class UsernameRegisterDto extends CreateUserDto {
    @IsNotEmpty({ message: 'userName不能为空' })
    @IsString()
    @Matches(PHONE_REG, { message: 'userName格式错误' })
    userName: string;

    @IsNotEmpty({ message: 'password不能为空' })
    @IsString()
    @Matches(PASSWORD_REG, { message: 'password格式错误' })
    password: number;

    @IsNotEmpty({ message: 'authType不能为空' })
    authType: number = AUTH_TYPE_ENUM.USERNAME_PWD;
}

export class EditUserDto {
    @IsNotEmpty({ message: 'userId不能为空' })
    @IsNumber()
    userId: number;

    @IsNotEmpty({ message: 'userName不能为空' })
    @IsString()
    userName: string;

    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    @IsString()
    @Matches(PHONE_REG, { message: 'phoneNumber格式错误' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'IDNumber不能为空' })
    @IsString()
    @Matches(ID_CARD_REG18, { message: 'IDNumber格式错误' })
    IDNumber: string;
}

export class QueryUserDto extends BaseQueryDto {
    userId: number;
    userName: string;
    phoneNumber: string;
    IDNumber: string;

    // 将时间戳转成时间字符串
    // @Transform(({ value }) => Utils.dateFormat(value))
    createTime: Date;

    // 将时间戳转成时间字符串
    // @Transform(({ value }) => Utils.dateFormat(value))
    updateTime: Date;
}
