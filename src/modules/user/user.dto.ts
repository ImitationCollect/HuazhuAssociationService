import { IsNotEmpty, IsNumber, IsString, Matches, isNotEmpty } from 'class-validator';
import { Utils } from '@/utils/utils';
import { PHONE_REG, ID_CARD_REG18, PASSWORD_REG, AUTH_TYPE_ENUM } from '@/constants';
import { BaseQueryDto } from '@/common/dtos/base-query.dto';

export class CreateUserDto {
    @IsNotEmpty({ message: 'authType不能为空' })
    authType: number = AUTH_TYPE_ENUM.USERNAME_PWD;
}
export class PhoneCodeRegisterDto extends CreateUserDto {
    @Matches(PHONE_REG, { message: 'phoneNumber格式错误' })
    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'code不能为空' })
    @IsNumber()
    code: number;
}

export class UsernameRegisterDto extends CreateUserDto {
    @Matches(PHONE_REG, { message: 'phoneNumber格式错误' })
    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    phoneNumber: string;

    @Matches(PASSWORD_REG, { message: 'password格式错误' })
    @IsNotEmpty({ message: 'password不能为空' })
    password: string;
}

export class EditUserDto {
    @IsNumber()
    @IsNotEmpty({ message: 'userId不能为空' })
    userId: number;

    @IsString()
    @IsNotEmpty({ message: 'userName不能为空' })
    userName: string;

    @Matches(PHONE_REG, { message: 'phoneNumber格式错误' })
    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    phoneNumber: string;

    @Matches(ID_CARD_REG18, { message: 'IDNumber格式错误' })
    @IsNotEmpty({ message: 'IDNumber不能为空' })
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
