import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { Utils } from '../../utils/utils';
import { phoneReg, IDCardReg18 } from '../../constants';
export class CreateUserDto {
    @IsNotEmpty({ message: 'phoneNumber不能为空' })
    @IsString()
    @Matches(phoneReg, { message: 'phoneNumber格式错误' })
    phoneNumber: string;
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
    @Matches(phoneReg, { message: 'phoneNumber格式错误' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'IDNumber不能为空' })
    @IsString()
    @Matches(IDCardReg18, { message: 'IDNumber格式错误' })
    IDNumber: string;
}

export class BaseQueryDto {
    @IsNotEmpty({ message: 'page不能为空' })
    @IsNumber()
    page: number;

    @IsNotEmpty({ message: 'pageSize不能为空' })
    @IsNumber()
    pageSize: number;
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
